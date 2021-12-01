import React, { useEffect, useState } from "react";
import AuthWrapper from "../authwrapper/Authwraper";
import InputForm from "../forms/inputs/InputForm";
import Button from "../forms/button/Button";
import "./login.scss";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
	emailSignInStart,
	googleSignInStart,
	userErrorStart,
} from "../../redux/user/user.action";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IsLoading from "../loading/IsLoading";
import { Alert, AlertTitle } from "@mui/material";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userError: user.userError,
});

const Login = () => {
	const { userError, currentUser } = useSelector(mapState);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);
	const [errors, setErrors] = useState([userError]);

	const history = useHistory();
	const dispatch = useDispatch();

	useEffect(() => {
		if (currentUser) {
			reset();
			history.push("/");
		}
	}, [currentUser]);

	useEffect(() => {
		if (Array.isArray(userError) && userError.length > 0) {
			setErrors(userError);
		}
	}, [userError]);

	useEffect(() => {
		return () => dispatch(userErrorStart({}));
	}, []);

	//reset form input
	const reset = () => {
		setEmail("");
		setPassword("");
	};

	const handleEmailLogin = async (e) => {
		e.preventDefault();
		setErrors([]);
		dispatch(userErrorStart({}));
		setLoading2(true);
		setTimeout(() => {
			dispatch(emailSignInStart({ email, password }));
			setLoading2(false);
		}, 5000);
	};

	const handleGoogleLogin = () => {
		dispatch(userErrorStart({}));
		setLoading(true);
		setTimeout(() => {
			dispatch(googleSignInStart());
			setLoading(false);
		}, 5000);
	};
	// console.log(errors);
	const configAuthwrapper = {
		headline: "Login",
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
				<form onSubmit={handleEmailLogin}>
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
					Password:
					<InputForm
						type="password"
						className="input-field"
						placeholder="Enter your password"
						name="password"
						required
						handleChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
					<div className="section" style={{ display: "flex" }}>
						<Button
							custom="blue"
							type="submit"
							disabled={loading || !email || !password}>
							Login
						</Button>
						{loading2 && <IsLoading />}
					</div>
					or
				</form>

				<div style={{ display: "flex" }}>
					<Button
						custom="red darken-1"
						onClick={handleGoogleLogin}
						disabled={loading}>
						<i className="fab fa-google left"></i>
						Login with Google
					</Button>
					{loading && <IsLoading />}
				</div>
				<div className="section">
					<span>
						Don't Have an Account? &nbsp;
						<Link to="/users/register">Register</Link>
					</span>
					<br />
					<span>
						<Link to="/users/recovery">Forgot Password?</Link>
					</span>
				</div>
			</AuthWrapper>
		</div>
	);
};

export default Login;
