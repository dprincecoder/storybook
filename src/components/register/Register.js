import React, { useEffect, useState } from "react";
import AuthWrapper from "../authwrapper/Authwraper";
import InputForm from "../forms/inputs/InputForm";
import Button from "../forms/button/Button";
import {
	googleSignInStart,
	signUpUserStart,
} from "../../redux/user/user.action";
import IsLoading from "../loading/IsLoading";
import "./register.scss";
import { Link, withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userError: user.userError,
});
const Register = () => {
	const dispatch = useDispatch();
	const { userError, currentUser } = useSelector(mapState);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const [displayName, setDisplayName] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [loading, setLoading] = useState();
	const [loading2, setLoading2] = useState();

	const history = useHistory();

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

	//reset form input
	const reset = () => {
		setEmail("");
		setConfirmPassword("");
		setDisplayName("");
		setErrors([]);
		setPassword("");
		setFirstName("");
		setLastName("");
		setCountry("");
		setCity("");
	};

	const handleEmailRegister = async (e) => {
		e.preventDefault();
		setLoading2(true);
		setTimeout(() => {
			dispatch(
				signUpUserStart({
					email,
					password,
					displayName,
					confirmPassword,
					firstName,
					lastName,
					country,
					city,
				})
			);
			setLoading2(false);
		}, 5000);
	};

	const handleGoogleRegister = () => {
		setLoading(true);
		setTimeout(() => {
			dispatch(googleSignInStart());
			setLoading(false);
		}, 5000);
	};

	const configAuthwrapper = {
		headline: "Register",
	};
	return (
		<div className="container">
			<div className="welcome">
				<h3>
					<i className="fas fa-book-reader"></i>
					Storybook
				</h3>

				<div className="section">
					<p className="lead">
						Share you beautiful moment with your friends and family at that good
						sunrise.
					</p>
				</div>
			</div>
			<div className="divider"></div>
			<AuthWrapper custom="row" {...configAuthwrapper}>
				{errors.length > 0 && (
					<ul>
						{errors.map((err, index) => (
							<li key={index}> {err}</li>
						))}
					</ul>
				)}
				<form onSubmit={handleEmailRegister}>
					Display Name:
					<InputForm
						type="text"
						name="displayName"
						placeholder="Enter your display name"
						value={displayName}
						required
						handleChange={(e) => setDisplayName(e.target.value)}
					/>
					Email Address:
					<InputForm
						type="email"
						name="email"
						placeholder="Enter your email"
						value={email}
						required
						handleChange={(e) => setEmail(e.target.value)}
					/>
					First Name:
					<InputForm
						type="text"
						name="firstName"
						placeholder="Enter your first name"
						value={firstName}
						required
						handleChange={(e) => setFirstName(e.target.value)}
					/>
					Last Name:
					<InputForm
						type="text"
						name="lastName"
						placeholder="Enter your last name"
						value={lastName}
						required
						handleChange={(e) => setLastName(e.target.value)}
					/>
					Country:
					<InputForm
						type="text"
						name="country"
						value={country}
						placeholder="Enter your Country"
						required
						handleChange={(e) => setCountry(e.target.value)}
					/>
					City:
					<InputForm
						type="text"
						name="city"
						placeholder="Enter the City you are in now"
						value={city}
						required
						handleChange={(e) => setCity(e.target.value)}
					/>
					Password:
					<InputForm
						type="password"
						name="password"
						placeholder="Enter your password"
						value={password}
						required
						handleChange={(e) => setPassword(e.target.value)}
					/>
					Confirm Password:
					<InputForm
						type="password"
						name="confirmPassword"
						placeholder="Confirm your password"
						value={confirmPassword}
						required
						handleChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<div className="section" style={{ display: "flex" }}>
						<Button custom="blue" type="submit" disabled={loading}>
							Register
						</Button>
						{loading2 && <IsLoading />}
					</div>
					OR
				</form>
				<div style={{ display: "flex" }}>
					<Button
						custom="red darken-1"
						onClick={handleGoogleRegister}
						disabled={loading}>
						<i className="fab fa-google left"></i>
						Register with Google
					</Button>
					{loading && <IsLoading />}
				</div>
				<span>
					Have an Account? &nbsp;
					<Link to="/users/login">Login</Link>
				</span>
			</AuthWrapper>
		</div>
	);
};

export default withRouter(Register);
