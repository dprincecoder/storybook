import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { firebaseConfig } from "./config";
import dummyAvatar from "../dummyAvatar.png";

const firebaseApp = firebase.initializeApp(firebaseConfig);

const DB = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const handleUserProfile = async ({ userAuth, additionalData }) => {
	if (!userAuth) return;

	const { uid } = userAuth;

	const userRef = DB.doc(`users/${uid}`);
	const snapshot = await userRef.get();

	if (!snapshot.exists) {
		const { email, displayName, firstName, lastName, country, city, photoURL } =
			userAuth;
		const timestamp = new Date();
		const profilePic = !photoURL ? dummyAvatar : photoURL;
		try {
			await userRef.set({
				email,
				displayName,
				firstName: firstName || "",
				lastName: lastName || "",
				country: country || "",
				city: city || "",
				profilePic,
                createdDate: timestamp,
                userId: uid,
				...additionalData,
			});
		} catch (error) {
			console.log(error);
		}
	}
	return userRef;
};

const getCurrentUser = () => {
	return new Promise((resolve, reject) => {
		const unsubscribe = auth.onAuthStateChanged((userAuth) => {
			unsubscribe();
			resolve(userAuth);
		}, reject);
	});
};

export { auth, provider, handleUserProfile, getCurrentUser };
export default DB;
