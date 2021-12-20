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
	userErrorStart,
	resetPasswordSuccess,
	userSuccessStart,
} from "./user.action";
import { handleFetchUser, handleResetPasswordAPI } from "./user.helpers";
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
		if (user)
			yield put(
				userSuccessStart([
					{
						title: "Successfully",
						message:
							"Welcome to the community start sharing and start engaging you will be redirected automatically.",
					},
				])
			);
	} catch (e) {
		if (e.code === "auth/popup-blocked") {
			yield put(
				userErrorStart([
					{
						title: "Popup Blocked",
						message:
							"Your browser or extension has blocked the popup for authentication. Please allow popups for this site in your browser",
					},
				])
			);
		}
		console.log(e);
	}
}

export function* onGoogleSignInStart() {
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
	payload: { displayName, email, password, confirmPassword },
}) {
	if (password !== confirmPassword) {
		yield put(
			userErrorStart([
				{
					title: "Incorrect Password",
					message: "Password don't match try again",
				},
			])
		);
		return;
	}

	try {
		const { user } = yield auth.createUserWithEmailAndPassword(email, password);

		yield localStorage.setItem("currentUser", JSON.stringify(user));
		const additionalData = { displayName };
		yield getSnapshotFromUserAuth(user, additionalData);
		if (user)
			yield put(
				userSuccessStart([
					{
						title: "Registration Successfully",
						message:
							"Welcome to your new account and to the community start sharing and start engaging you will be redirected automatically.",
					},
				])
			);
	} catch (e) {
		switch (e.code) {
			case "auth/email-already-in-use":
				yield put(
					userErrorStart([
						{
							title: "Email already in use",
							message: "Sorry Email already in use by another user",
						},
					])
				);
				break;
			case "auth/invalid-email":
				yield put(
					userErrorStart([
						{
							title: "Invalid Email",
							message: "Invalid Email",
						},
					])
				);
				break;
			case "auth/weak-password":
				yield put(
					userErrorStart([
						{
							title: "Weak Password",
							message: "Weak Password",
						},
					])
				);
				break;
			default:
				yield put(userErrorStart([e]));
		}
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
		yield put(
			userSuccessStart([
				{
					title: "Login Successfully",
					message:
						"Welcome back to the community you will be redirected automatically.",
				},
			])
		);
	} catch (e) {
		switch (e.code) {
			case "auth/user-not-found":
				yield put(
					userErrorStart([
						{
							title: "User not found",
							message:
								"No user with this credentials found in our database, please try again. code: 404",
						},
					])
				);
				break;
			case "auth/wrong-password":
				yield put(
					userErrorStart([
						{
							title: "Incorrect Password",
							message:
								"Your password is incorrect, please try again. code: 403",
						},
					])
				);
				break;
			default:
				yield put(userErrorStart([e]));
		}
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

export function* resetPassword({ payload: { email, webAddress } }) {
	try {
		yield call(handleResetPasswordAPI, { email, webAddress });
		yield put(resetPasswordSuccess());
	} catch (e) {
		yield put(
			userErrorStart([
				{
					title: "Email not found",
					message:
						"No user with this credentials found in our database, please try again. code: 404",
				},
			])
		);
		console.log(e);
	}
}

export function* onResetPasswordStart() {
	yield takeLatest(userTypes.RESET_PASSWORD_START, resetPassword);
}

export function* onFetchUserDataStart() {
	yield takeLatest(userTypes.FETCH_USER_DATA, fetchUserData);
}

export default function* userSagas() {
	yield all([
		call(onGoogleSignInStart),
		call(onCheckUserSession),
		call(onSignOutUserStart),
		call(onEmailSignUp),
		call(onEmailLogin),
		call(onFetchUserDataStart),
		call(onResetPasswordStart),
	]);
}
