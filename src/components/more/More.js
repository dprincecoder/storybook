import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DB from "../../firebase/functions";
import { signOutUserStart } from "../../redux/user/user.action";
import Button from "../forms/button/Button";
import { Link } from "react-router-dom";
import InputForm from "../forms/inputs/InputForm";
import "./more.scss";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userData: user.userData,
});

const More = () => {
	const dispatch = useDispatch();
	const { currentUser, userData } = useSelector(mapState);
	const [message, setMessage] = React.useState("");
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [success, setSuccess] = React.useState(false);
	const { uid } = currentUser;
	const { userId } = userData;
	const d = userId || uid;
	const handleLogout = () => {
		dispatch(signOutUserStart());
		DB.collection("users").doc(d).update({
			activeStatus: "offline",
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (name && email && message) {
			DB.collection("feedback").doc(d).set({
				name,
				email,
				message,
			});
			setSuccess(true);
		}
	};

	return (
		<div className="wrp">
			<div className="wrp-content">
				<ul>
					<li>
						{" "}
						<Link to="/users/user/welcome">About Us</Link>
					</li>
					<li>
						{" "}
						<Link to="/users/user/welcome">Contact Us</Link>
					</li>
					<li>
						{" "}
						<Link to="/users/user/welcome">Privacy Policy</Link>
					</li>
					<li>
						<a
							href="https://www.dprincecoder.codes"
							target="_blank"
							rel="noopener noreferrer">
							Hire the developer
						</a>
					</li>
				</ul>
			</div>
			<div className="divider"></div>
			<div className=" feedback">
				<h5>Leave a Feedback</h5>
				{success ? (
					<div className="success">
						<p>Thank you for your feedback!</p>
						<i className="material-icons">check</i>
					</div>
				) : (
					<form className="form" onSubmit={handleSubmit}>
						<InputForm
							label="Name"
							placeholder="Enter your name..."
							handleChange={(e) => setName(e.target.value)}
						/>
						<InputForm
							label="Email"
							placeholder="Enter your email..."
							handleChange={(e) => setEmail(e.target.value)}
						/>
						<div className="textarea-msg">
							<label>Message</label>
							<textarea
								className="textarea"
								placeholder="Enter your message..."
								onChange={(e) => setMessage(e.target.value)}></textarea>
						</div>
						<Button type="submit">Send</Button>
					</form>
				)}
			</div>
			<Button onClick={handleLogout} custom="log red">
				LOG Out
			</Button>
		</div>
	);
};

export default More;
