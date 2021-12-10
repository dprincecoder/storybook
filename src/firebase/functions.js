import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import { firebaseConfig } from "./config";
import dummyAvatar from "../dummyAvatar.png";

const firebaseApp = firebase.initializeApp(firebaseConfig);

const DB = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebaseApp.storage();

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
				bio: "",
				areaOfExpertise: "",
				createdDate: timestamp,
				following: [],
				followers: [],
				online: true,
				userId: uid,
				...additionalData,
			});
		} catch (error) {
			console.error(error);
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

export { auth, provider, handleUserProfile, getCurrentUser, storage };
export default DB;
