import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { storage } from "../../firebase/functions";
import { addStoryStart } from "../../redux/story/story.action";
import AuthWrapper from "../authwrapper/Authwraper";
import Button from "../forms/button/Button";
import InputForm from "../forms/inputs/InputForm";
import IsLoading from "../loading/IsLoading";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import "./addstory.scss";

const mapState = ({ user }) => ({
	userData: user.userData,
});

const AddStory = () => {
	const { userData } = useSelector(mapState);
	const dispatch = useDispatch();
	const history = useHistory();
	const inputRef = useRef();
	const { profilePic, displayName } = userData;
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [photos, setPhotos] = useState([]);
	const [photoURL, setPhotoURL] = useState("");
	const [imageUpload, setImageUpload] = useState(null);
	const [storyDetails, setStoryDetails] = useState("");
	const [loading, setLoading] = useState();
	const [progress, setProgress] = useState(0);
	const [linkUrl, setLinkurl] = useState("");

	const upload = (image) => {
		const uploadTask = storage.ref(`storyImages/${image.name}`).put(image);

		// const promises = [];
		// imageUpload.map((img) => {
		// 	if (!img) return;
		// 	const uploadTask = storage.ref(`storyImages/${img.name}`).put(img);
		// 	promises.push(uploadTask);
		// 	uploadTask.on(
		// 		"state_changed",
		// 		(snapshot) => {
		// 							setProgress(
		// 								(snapshot.bytesTransferred / snapshot.totalBytes) * 100
		// 							);

		// 		},
		// 		(err) => {
		// 			console.log(err);
		// 		},
		// 		async () => {
		// 			await storage
		// 				.ref("storyImages")
		// 				.child(img.name)
		// 				.getDownloadURL()
		// 				.then((firebaseUrl) => {
		// 					setPhotoURL(firebaseUrl);
		// 					dispatch(
		// 						addStoryStart({
		// 							userThatPublished: displayName,
		// 							userthatPublishedProfilePic: profilePic,
		// 							storyTitle: title,
		// 							storyCategory: category,
		// 							storyDetails: storyDetails,
		// 							storyPhotos: firebase.firestore.FieldValue.arrayUnion({
		// 								url: { firebaseUrl },
		// 							}),
		// 						})
		// 					);
		// 				});
		// 		}
		// 	);
		// });
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
			},
			(err) => {
				console.log(err);
			},
			async () => {
				await storage
					.ref("storyImages")
					.child(image.name)
					.getDownloadURL()
					.then((firebaseUrl) => {
						dispatch(
							addStoryStart({
								userThatPublished: displayName,
								userthatPublishedProfilePic: profilePic,
								storyTitle: title,
								storyCategory: category,
								storyDetails: storyDetails,
								storyPhotos: firebaseUrl,
								storyVideo: "",
							})
						);
					});
			}
		);
	};
	const handlePublish = (e) => {
		e.preventDefault();
		setLoading(true);
		if (imageUpload) {
			upload(imageUpload);
		}
		if (linkUrl) {
			dispatch(
				addStoryStart({
					userThatPublished: displayName,
					userthatPublishedProfilePic: profilePic,
					storyTitle: title,
					storyCategory: category,
					storyDetails: storyDetails,
					storyPhotos: linkUrl,
					storyVideo: "",
				})
			);
		}
		// dispatch(
		// 	addStoryStart({
		// 		userThatPublished: displayName,
		// 		userthatPublishedProfilePic: profilePic,
		// 		storyTitle: title,
		// 		storyCategory: category,
		// 		storyDetails: storyDetails,
		// 		storyPhotos: photoURL,
		// 	})
		// );
		// Promise.all(promises)
		// 	.then(() => {
		// 		setTrueState(true);
		// 	})
		// 	.catch((err) => console.log(err));
		reset();
		setTimeout(() => {
			history.push("/");
			// setLoading(false);
		}, 2000);
	};

	const reset = () => {
		setTitle("");
		setCategory("");
		setStoryDetails("");
		setPhotos([]);
		inputRef.current.value = "";
	};
	const handleCancel = (e) => {
		reset();
	};
	// const handlePhotosChange = (e) => {
	// 	// for upload only
	// 	for (let i = 0; i < e.target.files.length; i++) {
	// 		const newImage = e.target.files[i];
	// 		// newImage["id"] = Math.random();
	// 		setImageUpload((prevImages) => [...prevImages, newImage]);
	// 	}

	// 	// for preview only
	// 	const photosArr = Array.from(e.target.files).map((photo) =>
	// 		URL.createObjectURL(photo)
	// 	);
	// 	setPhotos(photosArr);
	// 	Array.from(e.target.files).map((photo) => URL.revokeObjectURL(photo));
	// 	// setImageUpload(e.target.files[0]);
	// };

	// const sourcePhotos = (source) => {
	// 	return source.map((photo, index) => {
	// 		return (
	// 			<div className="" key={index}>
	// 				<img src={photo} alt="" className="responsive-img" />
	// 			</div>
	// 		);
	// 	});
	// };
	const configAuthWrapper = {
		headline: "Share your story",
	};
	return (
		<>
			{!displayName ? (
				<IsLoadingSkeleton />
			) : (
				<div className="container">
					<div className="card-content">
						<AuthWrapper {...configAuthWrapper}>
							<form onSubmit={handlePublish}>
								Title:
								<InputForm
									type="text"
									name="title"
									placeholder="Enter your story Title"
									value={title}
									required
									handleChange={(e) => setTitle(e.target.value)}
								/>
								Category:
								<InputForm
									type="text"
									name="category"
									placeholder="E.g marriage, family, relationship or vacation"
									value={category}
									required
									handleChange={(e) => setCategory(e.target.value)}
								/>
								<div className="file-field input-field">
									<div className="btn">
										<span>Select</span>
										<input
											type="file"
											multiple={true}
											name="photos"
											accept="image/jpg,image/png,image/gif,video/mp4"
											onChange={(e) => setImageUpload(e.target.files[0])}
										/>
									</div>
									<div className="file-path-wrapper">
										<input
											ref={inputRef}
											className="file-path validate"
											type="text"
											placeholder="Upload one or more files"
										/>
									</div>
								</div>
								OR
								<InputForm
									type="text"
									name="category"
									placeholder="Drop image link here"
									value={linkUrl}
									handleChange={(e) => setLinkurl(e.target.value)}
								/>
								{/* {photos && sourcePhotos(photos)} */}
								{imageUpload && (
									<img
										src={URL.createObjectURL(imageUpload)}
										alt=""
										className="responsive-img"
									/>
								)}
								<div className="divider"></div>
								{progress > 0 && (
									<progress value={progress} id="uploader" max="100" />
								)}
								<div className="divider"></div>
								Share your story in details:
								<textarea
									name="storyDetails"
									placeholder="Start Typing"
									id="story-details"
									value={storyDetails}
									className="add-story-textarea"
									onChange={(evt) =>
										setStoryDetails(evt.target.value)
									}></textarea>
								<div className="divider"></div>
								<br />
								<div className="section" style={{ display: "flex" }}>
									<Button
										custom="blue"
										type="submit"
										disabled={loading || !title}>
										publish
									</Button>
									{loading && <IsLoading />}
								</div>
							</form>
							<br />
							{title && (
								<Button onClick={handleCancel} custom="red">
									Cancel
								</Button>
							)}
						</AuthWrapper>
					</div>
				</div>
			)}
		</>
	);
};

export default AddStory;
