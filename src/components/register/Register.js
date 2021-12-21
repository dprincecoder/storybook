import { Alert, AlertTitle } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, withRouter } from "react-router-dom";
import {
	googleSignInStart,
	signUpUserStart,
	userErrorStart,
	userSuccessStart,
} from "../../redux/user/user.action";
import AuthWrapper from "../authwrapper/Authwraper";
import Button from "../forms/button/Button";
import InputForm from "../forms/inputs/InputForm";
import IsLoading from "../loading/IsLoading";
import "./register.scss";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userError: user.userError,
	userSuccess: user.userSuccess,
});
const Register = () => {
	const dispatch = useDispatch();
	const { userError, currentUser, userSuccess } = useSelector(mapState);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	// const [errors, setErrors] = useState([]);
	const [displayName, setDisplayName] = useState("");
	// const [country, setCountry] = useState("");
	// const [city, setCity] = useState("");
	// const [firstName, setFirstName] = useState("");
	// const [lastName, setLastName] = useState("");
	const [loading, setLoading] = useState();
	const [loading2, setLoading2] = useState();
	const [suggestedChar, setSuggestedChar] = useState("");
	const [modal, setModal] = useState(false);
	const [focus, setFocus] = useState(false);

	const history = useHistory();

	const includeUpperRef = useRef();
	const includeNumbersRef = useRef();
	const includeSymbolsRef = useRef();
	// const inputRef = useRef();

	useEffect(() => {
		if (currentUser) {
			reset();
			history.push("/");
		}
	}, [currentUser]);

	//reset form input
	const reset = () => {
		setEmail("");
		setConfirmPassword("");
		setDisplayName("");
		setPassword("");
	};

	useEffect(() => {
		return () => dispatch(userErrorStart({}));
	}, []);

	const handleEmailRegister = async (e) => {
		e.preventDefault();
		dispatch(userErrorStart({}));
		dispatch(userSuccessStart({}));

		setLoading2(true);
		setTimeout(() => {
			dispatch(
				signUpUserStart({
					displayName,
					email,
					password,
					confirmPassword,
				})
			);
			setLoading2(false);
		}, 5000);
	};

	const handleGoogleRegister = () => {
		setLoading(true);
		dispatch(userErrorStart({}));
		dispatch(userSuccessStart({}));

		setTimeout(() => {
			dispatch(googleSignInStart());
			setLoading(false);
		}, 5000);
	};

	//to get a character at a specific position
	const stringAt = (low, high) => {
		const array = [];
		for (let i = low; i <= high; i++) {
			array.push(i);
		}
		return array;
	};

	//all posible of suggested values from characters in ASCII
	const UPPERCASE_CHAR_CODES = stringAt(65, 90);
	const LOWERCASE_CHAR_CODES = stringAt(97, 122);
	const NUMBER_CHAR_CODES = stringAt(48, 57);
	const SYMBOL_CHAR_CODES = stringAt(33, 47)
		.concat(stringAt(58, 64))
		.concat(stringAt(91, 96))
		.concat(stringAt(123, 126));

	//to always get value
	// const syncCharAmount = (e) => {
	// 	const { value } = e.target;
	// 	charAmountNumber.value = value;
	// 	charAmountRange.value = value;
	// };

	const generate = (e) => {
		e.preventDefault();
		const characterLength = 10;
		const includeUppercase = includeUpperRef.current.checked;
		const includeNumbers = includeNumbersRef.current.checked;
		const includeSymbols = includeSymbolsRef.current.checked;

		let charCodes = LOWERCASE_CHAR_CODES;
		if (includeUppercase) charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
		if (includeSymbols) charCodes = charCodes.concat(SYMBOL_CHAR_CODES);
		if (includeNumbers) charCodes = charCodes.concat(NUMBER_CHAR_CODES);
		const passwordChar = [];
		for (let i = 0; i < characterLength; i++) {
			const charCode = charCodes[Math.floor(Math.random() * charCodes.length)];
			passwordChar.push(String.fromCharCode(charCode));
		}
		setSuggestedChar(passwordChar.join(""));
	};

	const suggest = () => {
		setModal(!modal);
	};

	const configAuthwrapper = {
		headline: "Register",
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
				{userSuccess.length > 0 && (
					<>
						{userSuccess.map((success, index) => (
							<Alert severity="success" key={index}>
								<AlertTitle>{success.title}</AlertTitle>
								{success.message}
							</Alert>
						))}
					</>
				)}
				<form onSubmit={handleEmailRegister}>
					<InputForm
						label="Display Name"
						type="text"
						name="displayName"
						placeholder="Enter your display name"
						value={displayName}
						required
						handleChange={(e) => setDisplayName(e.target.value)}
					/>
					<InputForm
						label="Email Address"
						type="email"
						name="email"
						placeholder="Enter your email"
						value={email}
						required
						handleChange={(e) => setEmail(e.target.value)}
					/>{" "}
					{focus && (
						<div className="suggest" onClick={suggest}>
							Suggest Password
						</div>
					)}
					{modal && (
						<div className="modal">
							<div className="val">{suggestedChar}</div>
							<div className="options">
								<label htmlFor="includeUpper">Include Uppercase</label>
								<input
									ref={includeUpperRef}
									className="input-checkbox"
									type="checkbox"
									id="includeUpper"
								/>

								<label htmlFor="includeNumber">Include Numbers</label>
								<input
									ref={includeNumbersRef}
									className="input-checkbox"
									type="checkbox"
									id="includeNumber"
								/>

								<label htmlFor="incSymbols">Include Symbols</label>
								<input
									ref={includeSymbolsRef}
									className="input-checkbox"
									type="checkbox"
									id="includeSymbols"
								/>
							</div>
							<div className="btn-opt">
								<Button custom="blue" onClick={generate}>
									Generate
								</Button>
								<Button
									onClick={() => {
										setPassword(suggestedChar);
										setConfirmPassword(suggestedChar);
										setModal(!modal);
									}}
									custom="green">
									use
								</Button>
								<Button
									onClick={() => {
										setModal(!modal);
									}}
									custom="red">
									Cancel
								</Button>
							</div>
						</div>
					)}
					<InputForm
						label="Password"
						type="password"
						name="password"
						placeholder="Enter your password"
						value={password}
						required
						handleChange={(e) => {
							setPassword(e.target.value);
							// setFocus(!focus);
						}}
						onFocus={() => setFocus(!focus)}
					/>
					<InputForm
						label="Confirm Password"
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
					or
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
