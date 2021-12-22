import React from "react";
import { useSelector } from "react-redux";
import DB from "../../firebase/functions";
import Button from "../forms/button/Button";
import { Link } from "react-router-dom";
import InputForm from "../forms/inputs/InputForm";
import "./more.scss";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userData: user.userData,
});

const More = () => {
	const { currentUser, userData } = useSelector(mapState);
	const [message, setMessage] = React.useState("");
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [success, setSuccess] = React.useState(false);
	const { uid } = currentUser;
	const { userId } = userData;
	const d = userId || uid;

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
							required
							placeholder="Enter your name..."
							handleChange={(e) => setName(e.target.value)}
						/>
						<InputForm
							label="Email"
							required
							placeholder="Enter your email..."
							handleChange={(e) => setEmail(e.target.value)}
						/>
						<div className="textarea-msg">
							<label>Message</label>
							<textarea
								name="message"
								required
								className="textarea"
								placeholder="Enter your message..."
								onChange={(e) => setMessage(e.target.value)}></textarea>
						</div>
						<Button disabled={!email && !name && !message} type="submit">
							Send
						</Button>
					</form>
				)}
			</div>
		</div>
	);
};

export default More;
