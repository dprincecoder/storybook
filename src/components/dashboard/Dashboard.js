import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../../firebase/functions.js";
import {
	handleUpdateUserDetails,
	handleUpdateUserImage,
} from "../../redux/user/user.helpers";
import AuthWrapper from "../authwrapper/Authwraper";
import Button from "../forms/button/Button";
import InputForm from "../forms/inputs/InputForm";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import UserStory from "../userStory/UserStory";
import "./dashboard.scss";

const mapState = ({ user }) => ({
	userData: user.userData,
});
const Dashboard = () => {
	const dispatch = useDispatch();
	const { userData } = useSelector(mapState);
	const [showEditInput, setShowEditInput] = useState(false);
	const [updateDisplayName, setUpdateDisplayName] = useState("");
	const [updateImage, setUpdateImage] = useState(null);
	const [updateCountry, setUpdateCountry] = useState("");
	const [updateCity, setUpdateCity] = useState("");
	const [updateFirstName, setUpdateFirstName] = useState("");
	const [updateLastName, setUpdateLastName] = useState("");
	const [progress, setProgress] = useState(0);
	const [imageUrl, setImageUrl] = useState(null);
	const {
		displayName,
		userId,
		email,
		firstName,
		lastName,
		profilePic,
		country,
		city,
	} = userData;

	const reset = () => {
		setUpdateDisplayName("");
		setUpdateFirstName("");
		setUpdateLastName("");
		setUpdateCountry("");
		setUpdateCity("");
		setShowEditInput(!showEditInput);
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		handleUpdateUserDetails(
			updateDisplayName || displayName,
			updateFirstName,
			updateLastName,
			updateCountry,
			updateCity,
			userId
		);
		reset();
		setTimeout(() => {
			window.location.reload();
		}, 2000);
	};

	const handleUpdateImage = () => {
		const newImageName = new Date().toISOString() + updateImage.name;
		let uploadTask = storage.ref(`userImages/${newImageName}`).put(updateImage);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
			},
			(error) => {
				console.log(error);
			},
			async () => {
				await storage
					.ref("userImages")
					.child(newImageName)
					.getDownloadURL()
					.then((firebaseUrl) => {
						// const newUrl = (prevURl) => ({ ...prevURl, imgUrl: firebaseUrl });
						handleUpdateUserImage(firebaseUrl, userId);
						// setImageUrl(firebaseUrl);
						setTimeout(() => {
							window.location.reload();
						}, 2000);
					});
			}
		);
		// setTimeout(() => {
		// 	window.location.reload();
		// }, 10000);
	};

	return (
		<div className="row">
			{!displayName || !userId ? (
				<IsLoadingSkeleton />
			) : (
				<>
					<div className="col s12 m12">
						<h5>My Dashboard</h5>
						<div className="card">
							<div className="card-image">
								<div className="img-con">
									<img
										src={profilePic}
										alt={displayName}
										className="dash-img"
									/>
								</div>
								<InputForm
									type="file"
									id="file-input"
									style={{ display: "none" }}
									handleChange={(e) => setUpdateImage(e.target.files[0])}
								/>
								<label htmlFor="file-input">
									<div className="btn-floating halfway-fab waves-effect waves-light blue">
										<i className="fas fa-edit"></i>
									</div>
								</label>
								{updateImage && (
									<div className="">
										<img
											src={URL.createObjectURL(updateImage)}
											alt=""
											className="responsive-img"
										/>
										<Button
											onClick={handleUpdateImage}
											custom="bt green btn-success">
											Update
										</Button>
										&nbsp;&nbsp;
										{progress > 0 && (
											<progress value={progress} id="uploader" max="100" />
										)}
									</div>
								)}
							</div>
							<div className="divider"></div>
							{/* <div className="divider"></div> */}
							<div className="card-content">
								<AuthWrapper
									custom={`row ${showEditInput ? "show-input" : "hide-input"}`}>
									<Button
										onClick={() => setShowEditInput(!showEditInput)}
										custom="btn-floating halfway waves-effect waves-light blue">
										<i className="fas fa-edit"></i>
									</Button>
									<span>Intro</span>
									<div className="divider"></div>
									<form onSubmit={handleUpdate}>
										<div className="usrName">
											<span>
												Dispaly Name:
												<h5 style={{ color: "#037fff" }}>
													{displayName && displayName}
												</h5>
											</span>
											<div className="divider"></div>
											<InputForm
												type="text"
												value={updateDisplayName}
												name="displayName"
												handleChange={(e) =>
													setUpdateDisplayName(e.target.value)
												}
											/>
										</div>

										<span>
											First Name: <h6>{firstName && firstName}</h6>
										</span>
										<div className="divider"></div>
										<InputForm
											type="text"
											value={updateFirstName}
											name="updateFirstName"
											handleChange={(e) => setUpdateFirstName(e.target.value)}
										/>
										<span>
											Last Name: <h6>{lastName && lastName}</h6>
										</span>

										<div className="divider"></div>

										<InputForm
											type="text"
											value={updateLastName}
											name="updateLastName"
											handleChange={(e) => setUpdateLastName(e.target.value)}
										/>
										<span>
											Country: <h6>{country && country}</h6>
										</span>
										<div className="divider"></div>

										<InputForm
											type="text"
											value={updateCountry}
											name="updateCountry"
											handleChange={(e) => setUpdateCountry(e.target.value)}
										/>
										<span>
											City: <h6>{city && city}</h6>
										</span>
										<div className="divider"></div>

										<InputForm
											type="text"
											value={updateCity}
											name="updateCity"
											handleChange={(e) => setUpdateCity(e.target.value)}
										/>
										<h6>Email</h6>
										<span>
											Email: <h6>{email && email}</h6>
										</span>
										<div className="divider"></div>
										<div className="section">
											<Button type="submit">Update</Button>
											<Button
												onClick={() => setShowEditInput(!showEditInput)}
												custom="red shift">
												Cancel
											</Button>
										</div>
									</form>
								</AuthWrapper>
							</div>
						</div>
						<span>Your Stories</span>
						<div className="my-stories">
							<UserStory userId={userId} />
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Dashboard;
