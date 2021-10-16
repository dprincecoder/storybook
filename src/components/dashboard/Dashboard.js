import React, { useState, useEffect } from "react";
import usrA from "./PhotoGrid_Plus_1605606730565.png";
import Button from "../forms/button/Button";
import AuthWrapper from "../authwrapper/Authwraper";
import InputForm from "../forms/inputs/InputForm";
import "./dashboard.scss";
import { useDispatch, useSelector } from "react-redux";
import { signOutUserStart } from "../../redux/user/user.action";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import { storage } from "../../firebase/functions.js";
import {
	handleUpdateUserImage,
	handleUpdateUserDetails,
} from "../../redux/user/user.helpers";

const mapState = ({ user }) => ({
	userData: user.userData,
});
const Dashboard = () => {
	const dispatch = useDispatch();
	const { userData } = useSelector(mapState);
	const [showEditInput, setShowEditInput] = useState(false);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState([]);
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
			updateDisplayName,
			updateFirstName,
			updateLastName,
			updateCountry,
			updateCity,
			userId
		);
		reset();
		window.location.reload();
	};

	const handleUpdateImage = () => {
		let uploadTask = storage
			.ref(`userImages/${updateImage.name}`)
			.put(updateImage);
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
					.child(updateImage.name)
					.getDownloadURL()
					.then((firebaseUrl) => {
						// const newUrl = (prevURl) => ({ ...prevURl, imgUrl: firebaseUrl });
						setImageUrl(firebaseUrl);
					});
			}
		);
		window.location.reload();
	};

	handleUpdateUserImage(imageUrl, userId);

	const handleLogout = () => {
		dispatch(signOutUserStart());
	};
	return (
		<div className="row">
			{!displayName || !userId ? (
				<IsLoadingSkeleton />
			) : (
				<>
					<div className="col s12 m12">
						<div className="card">
							<div className="card-image">
								<img src={profilePic} alt={displayName} />
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
									<div className="section">
										<Button
											onClick={handleLogout}
											custom="waves-effect waves-light red">
											LOG Out
										</Button>
									</div>
								</AuthWrapper>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Dashboard;
