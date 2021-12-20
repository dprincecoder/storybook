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
		const { displayName, email, photoURL } = userAuth;
		const timestamp = new Date().toISOString();
		const profilePic = !photoURL ? dummyAvatar : photoURL;
		try {
			await userRef
				.set({
					displayName,
					email,
					firstName: "",
					lastName: "",
					country: "",
					city: "",
					profilePic,
					bio: "",
					web: "",

					createdDate: timestamp,
					following: [],
					followers: [],
					activeStatus: "online",
					userId: uid,
					...additionalData,
				})
				.then(() => {
					DB.collection("Notifications")
						.doc(uid)
						.set({
							createdDate: timestamp,
							seen: false,
							read: false,
							userThatSentNote: "Storybook Admin",
							userThatOwnNotificationId: uid,
							note: `Welcome to the community, ${displayName}! Please fill out your profile and start sharing your stories. You can also follow other users to see their stories, comment, or even reply to a comment. Please take a look at our About page at the very topbar to see more information. Happy reading! 📖`,
							logo: "/assets/storybook.jpg",
						});
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
