import DB, { auth } from "../../firebase/functions";

//helper function to fetch products from database
export const handleFetchUser = (userId) => {
	return new Promise((resolve, reject) => {
		// if (!userId) return;
		DB.collection("users")
			.doc(userId)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) {
					resolve(snapshot.data());
				}
			})
			.catch((err) => reject(err));
	});
};

export const handleUpdateUserImage = (imageUrl, userId) => {
	if (!imageUrl) return;
	const ref = DB.collection("users").doc(userId);
	ref.update({
		profilePic: imageUrl,
	});
};

export const handleUpdateUserDetails = (
	displayName,
	firstName,
	lastName,
	country,
	city,
	userId,
	bio,
	web
) => {
	if (!displayName || !firstName || !lastName || !country || !city) return;
	const ref = DB.collection("users").doc(userId);
	ref.update({
		displayName: displayName,
		firstName: firstName,
		lastName: lastName,
		country: country,
		city: city,
		bio: bio,
		web: web,
	});
};

export const handleResetPasswordAPI = (email, webAddress) => {
	//redirect users to login page after they sent reset email
	const redirectUrl = { url: `${webAddress}/users/login` };

	return new Promise((resolve, reject) => {
		auth
			.sendPasswordResetEmail(email, redirectUrl)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				const resetPasswordErr = [err.message];
				reject(resetPasswordErr);
			});
	});
};
