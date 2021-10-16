import DB from "../../firebase/functions";
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
	filterType,
	startAfterDoc,
	persistStories = [],
}) => {
	return new Promise((resolve, reject) => {
		const pageSize = 5;
		let ref = DB.collection("stories")
			.orderBy("createdDate", "desc")
			.limit(pageSize);

		if (filterType) {
			ref = ref.where("storyCategory", "==", filterType);
		}
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
