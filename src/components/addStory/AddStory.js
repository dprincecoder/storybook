import { CKEditor } from "ckeditor4-react";
import React, { useRef, useState } from "react";
import AuthWrapper from "../authwrapper/Authwraper";
import InputForm from "../forms/inputs/InputForm";
import Button from "../forms/button/Button";
import { useSelector, useDispatch } from "react-redux";
import { addStoryStart } from "../../redux/story/story.action";
import { storage } from "../../firebase/functions";
import IsLoading from "../loading/IsLoading";
import firebase from "firebase/app";

import "./addstory.scss";

const mapState = ({ user }) => ({
	userData: user.userData,
});

const AddStory = () => {
	const { userData } = useSelector(mapState);
	const dispatch = useDispatch();
	const inputRef = useRef();
	const { profilePic, displayName } = userData;
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [photos, setPhotos] = useState([]);
	const [photosURL, setPhotosURL] = useState("");
	const [imageUpload, setImageUpload] = useState(null);
	const [storyDetails, setStoryDetails] = useState("");
	const [loading, setLoading] = useState();
	// console.log(imageUpload);
	// let photosURL = [];
	const upload = (img) => {
		if (!img) return;
		const uploadTask = storage.ref(`storyImages/${img.name}`).put(img);
		uploadTask.on(
			"state_changed",
			(snapshot) => {},
			(err) => console.error(err),
			() => {
				storage
					.ref("storyImages")
					.child(img.name)
					.getDownloadURL()
					.then((url) => {
						// const newUrl = (prevURl) => [...prevURl, url];
						setPhotosURL(url);
					});
			}
		);
		// imageUpload.map((img) => {
		// });
	};

	const handlePublish = (e) => {
		e.preventDefault();
		setLoading(true);
		upload(imageUpload);
		// const arr = photosURL.map((photo) => {
		// 	return photo;
		// });
		// console.log(arr);
		console.log(photosURL);
		setTimeout(() => {
			dispatch(
				addStoryStart({
					userThatPublished: displayName,
					userthatPublishedProfilePic: profilePic,
					storyTitle: title,
					storyCategory: category,
					storyDetails: storyDetails,
					storyPhotos: photosURL,
				})
			);
			setLoading(false);
		}, 10000);
		console.log(photosURL);
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
	const handlePhotosChange = (e) => {
		//for upload only
		// for (let i = 0; i < e.target.files.length; i++) {
		// 	const newImage = e.target.files[i];
		// 	// newImage["id"] = Math.random();
		// 	setImageUpload((prevImages) => [...prevImages, newImage]);
		// }

		//for preview only
		// const photosArr = Array.from(e.target.files).map((photo) =>
		// 	URL.createObjectURL(photo)
		// );
		// setPhotos(photosArr);
		// Array.from(e.target.files).map((photo) => URL.revokeObjectURL(photo));
		setImageUpload(e.target.files[0]);
	};

	const configAuthWrapper = {
		headline: "Share you story",
	};
	// const sourcePhotos = (source) => {
	// 	return source.map((photo, index) => {
	// 		return (
	// 			<div className="" key={index}>
	// 				<img src={photo} alt="" className="responsive-img" />
	// 			</div>
	// 		);
	// 	});
	// };
	return (
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
									// multiple={true}
									name="photos"
									accept="image/jpg,image/png,image/gif,video/mp4"
									onChange={handlePhotosChange}
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
						{/* {photos && sourcePhotos(photos)} */}
						{imageUpload && (
							<img
								src={URL.createObjectURL(imageUpload)}
								alt=""
								className="responsive-img"
							/>
						)}
						{photos}
						<div className="divider"></div>
						Share your story in details:
						<CKEditor
							required
							onChange={(evt) => setStoryDetails(evt.editor.getData())}
						/>
						<div className="divider"></div>
						<br />
						<div className="section" style={{ display: "flex" }}>
							<Button custom="blue" type="submit" disabled={loading || !title}>
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
	);
};

export default AddStory;
