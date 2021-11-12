import { takeLatest, call, all, put } from "redux-saga/effects";
import {
	auth,
	getCurrentUser,
	handleUserProfile,
	provider,
} from "../../firebase/functions";
import {
	setUserData,
	signInSuccess,
	signOutUserSuccess,
	userError,
} from "./user.action";
import { handleFetchUser } from "./user.helpers";
import userTypes from "./user.types";

//listen for a change in user
export function* getSnapshotFromUserAuth(user, additionalData = {}) {
	try {
		const userRef = yield call(handleUserProfile, {
			userAuth: user,
			additionalData,
		});
		const snapshot = yield userRef.get();
		yield put(
			signInSuccess({
				id: snapshot.id,
				...snapshot.data(),
			})
		);
	} catch (error) {
		console.log(error);
	}
}

//check is user is already logged in
export function* isUserAuthenticated() {
	try {
		const userAuth = yield getCurrentUser();
		if (!userAuth) return;
		yield getSnapshotFromUserAuth(userAuth);
	} catch (error) {
		console.log(error);
	}
}

export function* onCheckUserSession() {
	yield takeLatest(userTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

//create user using google
export function* googleSignIn() {
	try {
		const { user } = yield auth.signInWithPopup(provider);
		yield localStorage.setItem("currentUser", JSON.stringify(user));
		yield getSnapshotFromUserAuth(user);
	} catch (error) {
		console.log(error);
	}
}

export function* onGogleSignInStart() {
	yield takeLatest(userTypes.GOOGLE_SIGN_IN_START, googleSignIn);
}

export function* signOutUser() {
	try {
		yield auth.signOut();
		yield put(signOutUserSuccess());
		yield localStorage.setItem("currentUser", null);
		yield window.location.reload();
	} catch (error) {
		console.log(error);
	}
}

export function* onSignOutUserStart() {
	yield takeLatest(userTypes.SIGN_OUT_USER_START, signOutUser);
}

export function* emailSignUp({
	payload: {
		email,
		password,
		displayName,
		confirmPassword,
		firstName,
		lastName,
		country,
		city,
	},
}) {
	if (password !== confirmPassword) {
		const newError = ["Password don't match try again"];
		yield put(userError(newError));
		return;
	}

	try {
		const { user } = yield auth.createUserWithEmailAndPassword(email, password);
		console.log(user);

		yield localStorage.setItem("currentUser", JSON.stringify(user));
		const additionalData = { displayName, firstName, lastName, country, city };
		yield getSnapshotFromUserAuth(user, additionalData);
	} catch (error) {
		console.log(error);
	}
}

export function* onEmailSignUp() {
	yield takeLatest(userTypes.SIGN_UP_USER_START, emailSignUp);
}

export function* emailLogin({ payload: { email, password } }) {
	try {
		const { user } = yield auth.signInWithEmailAndPassword(email, password);
		yield localStorage.setItem("currentUser", JSON.stringify(user));
		yield getSnapshotFromUserAuth(user);
	} catch (error) {
		console.log(error);
	}
}

export function* onEmailLogin() {
	yield takeLatest(userTypes.EMAIL_SIGN_IN_START, emailLogin);
}

export function* fetchUserData({ payload }) {
	try {
		const userData = yield handleFetchUser(payload);
		yield put(setUserData(userData));
	} catch (error) {
		console.log(error);
	}
}

export function* onFetchUserDataStart() {
	yield takeLatest(userTypes.FETCH_USER_DATA, fetchUserData);
}

export default function* userSagas() {
	yield all([
		call(onGogleSignInStart),
		call(onCheckUserSession),
		call(onSignOutUserStart),
		call(onEmailSignUp),
		call(onEmailLogin),
		call(onFetchUserDataStart),
	]);
}
