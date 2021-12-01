import React from "react";
import InputEmoji from "react-input-emoji";
import { Avatar, Button } from "@material-ui/core";
import { useState } from "react";
import "./input.scss";

import firebase from "firebase";
import TelegramIcon from "@material-ui/icons/Telegram";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import DB from "../../../firebase/functions";

const mapState = ({ user }) => ({
	userData: user.userData,
});

const ReplyInput = ({
	storyId,
	commentId,
	userThatCommentId,
	storyUserUID,
}) => {
	const [replyMsg, setCommentMsg] = useState("");
	const [text, setText] = useState("");
	const { userData } = useSelector(mapState);
	const { profilePic, displayName, userId } = userData;
	const dispatch = useDispatch();
	const inputRef = React.useRef();
	const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
	let today = new Date();
	let timestamp = today.toISOString();

	const sendReply = (e) => {
		e.preventDefault();
		DB.collection("comments")
			.doc(commentId)
			.collection("replies")
			.add({
				storyId: storyId,
				commentId: commentId,
				replyMessage: replyMsg,
				userThatReplyName: displayName,
				userThatReplyImage: profilePic,
				userThatReplyId: userId,
				userThatCommentId: userThatCommentId || "",
				createdAt: timestamp,
				color: randomColor,
			})
			.then(() => {
				if (userId === userThatCommentId || userId === storyUserUID) {
					return;
				} else {
					DB.collection("replyCommentNotifications")
						.doc(`${userId}~${commentId}`)
						.set({
							storyId: storyId,
							commentId: commentId,
							notifyMsg: replyMsg,
							userThatNotifyName: displayName,
							userThatNotifyPic: profilePic,
							userThatNotifyId: userId,
							createdAt: timestamp,
							type: "replied to your",
							method: "comment",
							userThatCommentId: userThatCommentId || "",
							storyUserUID,
							read: false,
							seen: false,
						});
				}
			});

		const comment = DB.collection("comments").doc(commentId);
		const increment = firebase.firestore.FieldValue.increment(+1);

		comment.update({ replyCount: increment });

		inputRef.current.value = "";
	};

	return (
		<div className="container-o">
			<div className="reply-details-header">
				<form className="reply-form">
					<Avatar src={profilePic} className="reply-details-header-avatar" />
					<div className="reply-details-header-details">
						<input
							type="text"
							onChange={(e) => setCommentMsg(e.target.value)}
							placeholder={`Join the conversation ${displayName || ""}`}
							className="reply-input-field"
							ref={inputRef}
						/>
						<Button
							className="submit-reply-button"
							type="submit"
							onClick={sendReply}
							disabled={!replyMsg}>
							<TelegramIcon />
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ReplyInput;
