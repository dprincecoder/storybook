import React, { useEffect, useState } from "react";
import AuthWrapper from "../authwrapper/Authwraper";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputForm from "../forms/inputs/InputForm";
import Button from "../forms/button/Button";

import IsLoading from "../loading/IsLoading";
import {
	resetPasswordStart,
	resetUserState,
	userErrorStart,
} from "../../redux/user/user.action";
import { Alert, AlertTitle } from "@mui/material";

const mapState = ({ user }) => ({
	resetPasswordSuccess: user.resetPasswordSuccess,
	userError: user.userError,
});
const Recovery = () => {
	const [email, setEmail] = useState("");
	const [failedEmail, setFailedEmail] = useState([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccMsg] = useState("");

	const { resetPasswordSuccess, userError } = useSelector(mapState);
	const history = useHistory();
	const dispatch = useDispatch();

	useEffect(() => {
		if (resetPasswordSuccess) {
			setSuccMsg(
				"We have have sent you password reset email link, please follow it to complete this action."
			);
			dispatch(resetUserState());
			setTimeout(() => {
				history.push("/users/login");
			}, 3000);
		}
	}, [resetPasswordSuccess]);
	useEffect(() => {
		return () => dispatch(userErrorStart({}));
	}, []);
	useEffect(() => {
		if (Array.isArray(userError) && userError.length > 0) {
			setFailedEmail(userError);
		}
	}, [userError]);

	const handleRecovery = async (e) => {
		e.preventDefault();
		dispatch(userErrorStart({}));
		setLoading(true);
		setTimeout(() => {
			dispatch(resetPasswordStart({ email }));
			setLoading(false);
		}, 3000);
	};

	const configAuthwrapper = {
		headline: "Email Recovery",
	};
	return (
		<div className="container">
			<div className="welcome">
				<h3>
					<i className="fas fa-book-reader"></i>
					STORYBOOK
				</h3>

				<div className="section">
					<p className="lead">
						Share you beautiful story with your friends engage in conversation,
						comments read new articles, news and let the world know your story.
					</p>
				</div>
			</div>
			<AuthWrapper custom="row" {...configAuthwrapper}>
				{userError.length > 0 && (
					<>
						{userError.map((err, index) => (
							<Alert severity="error" key={index}>
								<AlertTitle>{err.title}</AlertTitle>
								{err.message}
							</Alert>
						))}
					</>
				)}
				{success && <li>{success}</li>}
				<form onSubmit={handleRecovery}>
					Email Address:
					<InputForm
						type="email"
						className="input-field"
						placeholder="Enter your email"
						name="email"
						required
						handleChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
					<div className="section" style={{ display: "flex" }}>
						<Button custom="blue" type="submit" disabled={loading}>
							Recover
						</Button>
						{loading && <IsLoading />}
					</div>
				</form>
				<div className="section">
					<span>
						<Link to="/users/login">Login Instead</Link>
					</span>
				</div>
			</AuthWrapper>
		</div>
	);
};

export default Recovery;
