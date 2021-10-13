import React, { useState, useEffect } from "react";
import usrA from "./PhotoGrid_Plus_1605606730565.png";
import Button from "../forms/button/Button";
import AuthWrapper from "../authwrapper/Authwraper";
import InputForm from "../forms/inputs/InputForm";
import "./dashboard.scss";
import { useDispatch, useSelector } from "react-redux";
import { signOutUserStart } from "../../redux/user/user.action";
import IsLoading from "../loading/IsLoading";
// import {isDisconnected} from '../network/NetworkDetector'

const mapState = ({ user }) => ({
	userData: user.userData,
});
const Dashboard = () => {
	const isDisconnected = localStorage.getItem('networkcondition')
	const { userData } = useSelector(mapState);
	const dispatch = useDispatch();
	const [showEditInput, setShowEditInput] = useState(false);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState([]);
	const [updateDisplayName, setUpdateDisplayName] = useState("");
	const [updateCountry, setUpdateCountry] = useState("");
	const [updateCity, setUpdateCity] = useState("");
	const [updateFirstName, setUpdateFirstName] = useState("");
	const [updateLastName, setUpdateLastName] = useState("");
	const { displayName, email, firstName, lastName, profilePic, country, city } =
		userData;

	const handleUpdate = (e) => {
		e.preventDefault();
	};


	let loadTime;
	function loadFunction() {
		loadTime = setTimeout(() => {
			setLoading(false);
		}, 5000);
	}

	useEffect(() => {
		loadFunction();

		return () => {
			clearTimeout(loadTime);
			console.log("removed");
		}
	}, []);
	const handleLogout = () => {
		dispatch(signOutUserStart());
	};
	return (
		<div className="row">
			{loading || isDisconnected === "offline" ? (
				<IsLoading />
			) : (
				<>
					<div className="col s12 m12">
						<div className="card">
							<div className="card-image">
								<img src={profilePic} alt={displayName} />
								<Button custom="btn-floating halfway-fab waves-effect waves-light blue">
									<i className="fas fa-edit"></i>
								</Button>
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
												<h5 style={{color: "#037fff"}}>{displayName && displayName}</h5>
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
											<Button>Update</Button>
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
