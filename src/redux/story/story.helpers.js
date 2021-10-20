import DB from "../../firebase/functions";
import firebase from "firebase/app";
export const handleAddStory = (story) => {
	if (!story) return;
	return new Promise((resolve, reject) => {
		DB.collection("stories")
			.doc()
			.set(story)
			.then(() => {
				resolve();
			})
			.catch((err) => reject(err));
	});
};

export const handleFetchStories = ({
	filterType,
	startAfterDoc,
	persistStories = [],
}) => {
	return new Promise((resolve, reject) => {
		const pageSize = 5;
		let ref = DB.collection("stories")
			.orderBy("createdDate", "asc")
			.limit(pageSize);

		if (filterType) {
			ref = ref.where("storyCategory", "==", filterType);
		}

		if (startAfterDoc) {
			ref = ref.startAfter(startAfterDoc);
		}

		ref
			.get()
			.then((snapshot) => {
				const totalCount = snapshot.size;
				const data = [
					...persistStories,
					...snapshot.docs.map((doc) => {
						return {
							...doc.data(),
							documentID: doc.id,
						};
					}),
				];
				resolve({
					data,
					queryDoc: snapshot.docs[totalCount - 1],
					isLastPage: totalCount < 1,
				});
			})
			.catch((err) => reject(err));
	});
};

export const handleFetchStory = (storyID) => {
	return new Promise((resolve, reject) => {
		DB.collection("stories")
			.doc(storyID)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) {
					resolve(snapshot.data());
				}
			})
			.catch((err) => reject(err));
	});
};

export const handleFetchUserStories = ({
	userId,
	startAfterDoc,
	persistStories = [],
}) => {
	return new Promise((resolve, reject) => {
		const pageSize = 5;
		let ref = DB.collection("stories")
			.orderBy("createdDate", "asc")
			.limit(pageSize);

		// if (filterType) {
		// 	ref = ref.where("storyCategory", "==", filterType);
		// }
		if (userId) {
			ref = ref.where("storyUserUID", "==", userId);
		}

		if (startAfterDoc) {
			ref = ref.startAfter(startAfterDoc);
		}

		ref
			.get()
			.then((snapshot) => {
				const totalCount = snapshot.size;
				const data = [
					...persistStories,
					...snapshot.docs.map((doc) => {
						return {
							...doc.data(),
							documentID: doc.id,
						};
					}),
				];
				resolve({
					data,
					queryDoc: snapshot.docs[totalCount - 1],
					isLastPage: totalCount < 1,
				});
			})
			.catch((err) => reject(err));
	});
};

export const handleDeleteStory = (documentID) => {
	return new Promise((resolve, reject) => {
		DB.collection("stories")
			.doc(documentID)
			.delete()
			.then(() => {
				resolve();
			})
			.catch((error) => reject(error));
	});
};

export const handleLikeStory = (displayName, documentID) => {
	const likeDocument = DB.collection("likes");
	const increment = firebase.firestore.FieldValue.increment(+1);
	const story = DB.collection("stories").doc(documentID);
	likeDocument.doc().set({
		displayName,
		documentID,
	});
	story.update({
		likeCount: increment,
		liked: true,
	});
	return likeDocument;
};

export const handleUnLikeStory = (documentID) => {
	const likeDocument = DB.collection("likes");
	const decrement = firebase.firestore.FieldValue.increment(-1);
	const story = DB.collection("stories").doc(documentID);
	// const storyDoc = await story.get();
	likeDocument
		.doc(documentID)
		.delete()
		.then(() => {
			console.log("unlike success");
		});
	story.update({
		likeCount: decrement,
		liked: false,
	});
	return likeDocument;
};
