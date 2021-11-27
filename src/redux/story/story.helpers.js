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

export const handleLikeStory = async (
	userId,
	displayName,
	profilePic,
	storyTitle,
	storyId,
	storyUserUID
) => {
	let likeDocument = DB.collection("storyLikes");
	let date = new Date().toISOString();
	let likeDocu = DB.collection("storyLikes")
		.where("userId", "==", userId)
		.where("storyId", "==", storyId)
		.limit(1);

	let increment = firebase.firestore.FieldValue.increment(+1);
	const decrement = firebase.firestore.FieldValue.increment(-1);

	let story = DB.collection("stories").doc(storyId);
	let likeDoc = await likeDocu.get();

	if (likeDoc.empty) {
		likeDocument.doc(`${userId}~${storyId}`).set({
			userId,
			displayName,
			storyId,
		});
		story.update({
			likeCount: increment,
		});
		if (userId === storyUserUID) {
			return;
		} else {
			DB.collection("notifications")
				.doc(`${userId}~${storyId}`)
				.set({
					displayName,
					storyId,
					userThatLikedId: userId,
					type: "like",
					createDate: date,
					read: false,
					profilePic,
					storyTitle,
					storyUserUID: storyUserUID || "",
				});
		}
	} else {
		likeDocument.doc(`${userId}~${storyId}`).delete();
		story.update({
			likeCount: decrement,
		});

		DB.collection("notifications").doc(`${userId}~${storyId}`).delete();
	}

	return likeDocument;
};

export const handleLikeVideo = async (userId, displayName, videoID) => {
	let likeDocument = DB.collection("videoLikes");
	let increment = firebase.firestore.FieldValue.increment(+1);
	let likeDocu = DB.collection("videoLikes")
		.where("userId", "==", userId)
		.where("videoID", "==", videoID)
		.limit(1);
	let decrement = firebase.firestore.FieldValue.increment(-1);
	let video = DB.collection("videos").doc(videoID);
	let likeDoc = await likeDocu.get();
	if (likeDoc.empty) {
		likeDocument.doc(videoID).set({
			userId,
			displayName,
			videoID,
		});
		video.update({
			likeCount: increment,
		});
	} else {
		likeDocument.doc(videoID).delete();
		video.update({
			likeCount: decrement,
		});
	}
	return likeDocument;
};

export const handleAddComment = (comments) => {
	if (!comments) return;
	return new Promise((resolve, reject) => {
		DB.collection("comments")
			.doc()
			.set(comments)
			.then(() => {
				resolve();
			})
			.catch((err) => reject(err));
	});
};

export const handleLikeComment = async (
	userId,
	displayName,
	profilePic,
	userThatLikeComment,
	commentMsg,
	commentOwnerId,
	commentID
) => {
	let likeDocument = DB.collection("commentLikes");
	let increment = firebase.firestore.FieldValue.increment(+1);
	let likeDocu = DB.collection("commentLikes")
		.where("userId", "==", userId)
		.where("commentID", "==", commentID)
		.limit(1);
	let decrement = firebase.firestore.FieldValue.increment(-1);
	let comment = DB.collection("comments").doc(commentID);
	let likeDoc = await likeDocu.get();
	if (likeDoc.empty) {
		likeDocument.doc(`${userId}~${commentID}`).set({
			userId,
			displayName,
			commentID,
		});
		comment.update({
			likeCount: increment,
		});
		if (userId === commentOwnerId) {
			return;
		} else {
			DB.collection("notifications").doc(`${userId}~${commentID}`).set({
				userId,
				displayName,
				commentID,
				userThatLikeComment,
				type: "likeComment",
				profilePic,
				commentMsg,
			});
		}
	} else {
		likeDocument.doc(`${userId}~${commentID}`).delete();
		comment.update({
			likeCount: decrement,
		});
		DB.collection("notifications").doc(`${userId}~${commentID}`).delete();
	}

	return likeDocument;
};
