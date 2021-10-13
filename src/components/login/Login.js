import React, { useEffect, useState } from "react";
import AuthWrapper from "../authwrapper/Authwraper";
import InputForm from "../forms/inputs/InputForm";
import Button from "../forms/button/Button";
// import "./register.scss";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { emailSignInStart, googleSignInStart } from "../../redux/user/user.action"
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IsLoading from "../loading/IsLoading";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userError: user.userError
});

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);

	const { currentUser } = useSelector(mapState);
	const history = useHistory();
	const dispatch = useDispatch();

	useEffect(() => {
		if (currentUser) {
			reset()
			history.push("/");
		}
	}, [currentUser]);

	//reset form input
	const reset = () => {
		setEmail("");
		setPassword("");
	};

	const handleEmailLogin = async e => {
		e.preventDefault()
		setLoading2(true);
		setTimeout(() => {
			dispatch(emailSignInStart({ email, password }))
			setLoading2(false)
		}, 5000);
	}
	
	const handleGoogleLogin = () => {
		setLoading(true);
		setTimeout(() => {
			dispatch(googleSignInStart());
			setLoading(false);
		}, 5000);
	};

	const configAuthwrapper = {
		headline: "Login",
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
						<Button custom="blue" type="submit" disabled={loading}>
							Login
						</Button>
						{loading2 && <IsLoading />}
					</div>
					OR
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
				<span>
					Don't Have an Account? &nbsp;
					<Link to="/users/register">Register</Link>
				</span>
			</AuthWrapper>
		</div>
	);
};

export default Login;
