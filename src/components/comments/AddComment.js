import { Avatar, Button } from "@material-ui/core";
import TelegramIcon from "@material-ui/icons/Telegram";
import firebase from "firebase";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DB from "../../firebase/functions";
import { addCommentStart } from "../../redux/story/story.action";
import "./addcomment.scss";

const mapState = ({ user }) => ({
	userData: user.userData,
});

const Comments = ({
	storyId,
	// displayName,
	// profilePic,
	storyTitle,
	userthatPublished,
	storyUserUID,
}) => {
	const [commentMsg, setCommentMsg] = useState("");
	const { userData } = useSelector(mapState);
	const { profilePic, displayName, userId } = userData;
	const dispatch = useDispatch();
	const inputRef = React.createRef();
	const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
	let date = new Date().toISOString();

	const sendComment = (e) => {
		e.preventDefault();
		dispatch(
			addCommentStart({
				storyId: storyId,
				commentMessage: commentMsg,
				userThatCommentName: displayName,
				userThatCommentImage: profilePic,
				userThatCommentId: userId,
				color: randomColor,
			})
		);
		if (userId === storyUserUID) {
			return;
		} else {
			DB.collection("Notifications")
				.doc(`${userId}~${storyUserUID}`)
				.set({
					userThatSentNotificationName: displayName,
					storyId,
					userThatSentNotificationId: userId,
					type: "commented on your",
					method: "story",
					createdDate: date,
					read: false,
					seen: false,
					userThatSentNotificationPic: profilePic,
					notificationMsg: commentMsg,
					userThatOwnNotificationId: storyUserUID || "",
					userThatOwnNotificationName: userthatPublished || "",
				});
		}
		const story = DB.collection("stories").doc(storyId);
		const increment = firebase.firestore.FieldValue.increment(+1);

		story.update({ commentCount: increment });

		setCommentMsg("");
	};

	return (
		<div className="">
			<div className="post-details-header">
				<form className="post-form" onSubmit={sendComment}>
					<Avatar src={profilePic} className="post-details-header-avatar" />
					<div className="post-details-header-details">
						<textarea
							type="text"
							className="text-expand"
							value={commentMsg}
							onChange={(e) => setCommentMsg(e.target.value)}
							placeholder={`Join the conversation ${displayName || ""}`}
							ref={inputRef}></textarea>
						<Button
							className="submit-comment-button"
							type="submit"
							disabled={!commentMsg}>
							<TelegramIcon />
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Comments;
