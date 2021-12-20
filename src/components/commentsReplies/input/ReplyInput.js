import React, { useRef, useState } from "react";
import InputEmoji from "react-input-emoji";
import { Avatar, Button } from "@material-ui/core";
import "./input.scss";

import firebase from "firebase";
import TelegramIcon from "@material-ui/icons/Telegram";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ExpandInput from "../../forms/expandForm/ExpandInput";
import DB from "../../../firebase/functions";

const mapState = ({ user }) => ({
	userData: user.userData,
});

const ReplyInput = ({
	storyId,
	commentId,
	userThatCommentId,
	storyUserUID,
	userThatCommentName,
}) => {
	const [replyMsg, setReplyMsg] = useState("");
	const [text, setText] = useState("");
	const { userData } = useSelector(mapState);
	const { profilePic, displayName, userId } = userData;
	const dispatch = useDispatch();
	const inputRef = useRef();
	const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
	let today = new Date().toISOString();

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
				createdDate: today,
				color: randomColor,
			})
			.then(() => {
				if (userId === userThatCommentId) {
					return;
				} else {
					DB.collection("Notifications")
						.doc(`${userId}~${commentId}`)
						.set({
							storyId: storyId,
							commentId: commentId,
							notificationMsg: replyMsg,
							userThatSentNotificationName: displayName,
							userThatSentNotificationPic: profilePic,
							userThatSentNotificationId: userId,
							createdDate: today,
							type: "replied to your",
							method: "comment",
							userThatOwnNotificationId: userThatCommentId || "",
							userThatOwnNotificationName: userThatCommentName || "",
							storyUserUID,
							read: false,
							seen: false,
						});
				}
			})
			.then(() => {
				const comment = DB.collection("comments").doc(commentId);
				const increment = firebase.firestore.FieldValue.increment(+1);

				comment.update({ replyCount: increment });

				setReplyMsg("");
			});
	};

	return (
		<div className="container-o">
			<div className="reply-details-header">
				<form className="reply-form" onSubmit={sendReply}>
					<Avatar src={profilePic} className="reply-details-header-avatar" />
					<div className="reply-details-header-details">
						<textarea
							type="text"
							name="replyMsg"
							className="text-expand"
							onChange={(e) => setReplyMsg(e.target.value)}
							placeholder="Write a public reply"
							value={replyMsg}
							ref={inputRef}></textarea>
						<Button
							className="submit-reply-button"
							type="submit"
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
