import React, { useState } from "react";
import FormInput from "../../components/forms/inputs/InputForm";
import Button from "../../components/forms/button/Button";
import "./userProfile.scss";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DB from "../../firebase/functions";

const mapState = ({ user }) => ({
	userData: user.userData,
	currentUser: user.currentUser,
});
const UserProfile = () => {
	const [showInput, setShowInput] = useState(false);
	const [message, setMessage] = useState("");
	const history = useHistory();
	const { userData, currentUser } = useSelector(mapState);
	const { userId, displayName, profilePic } = userData;
	const { uid } = currentUser;
	const d = userId || uid;
	const { userProfileId } = useParams();

	const submit = (e) => {
		e.preventDefault();
		// setShowInput(!showInput);
		DB.collection("messages")
			.doc(`${userProfileId}~${d}`)
			.set({
				message,
				userThatOwnMessageId: userProfileId,
				userThatSentMessageId: d,
				createdDate: new Date().toISOString(),
				seen: false,
				read: false,
				userThatSentMessageName: displayName,
				userThatSentMessagePic: profilePic,
			})
			.then(() => {
				DB.collection("messages")
					.doc(`${userProfileId}~${d}`)
					.collection("chat")
					.doc()
					.set({
						message,
						userThatOwnChatId: userProfileId,
						userThatSentChatId: d,
						createdDate: new Date().toISOString(),
						seen: false,
						read: false,
						userThatSentChatName: displayName,
						userThatSentChatPic: profilePic,
					});
			})
			.then(() => {
				setMessage("");
				history.push(`/users/chats/${userProfileId}`);
			});
	};

	return (
		<div className="">
			<div className="profile-bg-container">
				<div
					className="profile-bg"
					style={{
						backgroundImage: 'url("/assets/fashionwomen.jpg")',
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						height: "100%",
					}}></div>
			</div>
			<div className="col s12 m12">
				<div className="profile-full">
					<div className="profile-details">
						<h3>Jessica cunningham</h3>
						<div className="profile-location">
							<i className="material-icons">location_on</i>
							<p className="location-detials">San Francisco</p>
						</div>
						<div className="profile-bio">
							Lorem ipsum dolor, sit amet consectetur adipisicing elit.
							Provident alias saepe enim rerum voluptate quaerat explicabo ea
							fugit dolorum vel.
						</div>
					</div>
					<div className="profile-actions">
						<div className="actions-btn">
							<p className="active">Follow</p>
							<p onClick={() => setShowInput(!showInput)}>Message</p>
						</div>
						{showInput && (
							<>
								<form className="message-input" onSubmit={submit}>
									<textarea
										placeholder="Type your message here..."
										className="message-input-textarea"
										value={message}
										name="message"
										onChange={(e) => setMessage(e.target.value)}></textarea>
									<Button
										disabled={!message}
										type="submit"
										className="send-button">
										<i className="material-icons">send</i>
									</Button>
								</form>
							</>
						)}
						<div className="actions-activity">
							<p>
								<span>20</span>
								<span className="pre">stories</span>
							</p>
							<p>
								{" "}
								<span>100</span>
								<span className="pre">followers</span>
							</p>
							<p>
								{" "}
								<span>10</span>
								<span className="pre">following</span>
							</p>
						</div>
					</div>
					<div className="profile-stories"></div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
