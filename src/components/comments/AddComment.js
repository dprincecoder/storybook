import React from "react";
import { Avatar, Button } from "@material-ui/core";
import { useState } from "react";
import "./addcomment.scss";

import firebase from "firebase";
import TelegramIcon from "@material-ui/icons/Telegram";
import { useSelector } from "react-redux";
import DB from "../../firebase/functions";
import { useDispatch } from "react-redux";
import { addCommentStart } from "../../redux/story/story.action";

const mapState = ({ user }) => ({
	userData: user.userData,
});

const Comments = ({ storyId }) => {
	const [commentMsg, setCommentMsg] = useState("");
	const { userData } = useSelector(mapState);
	const { profilePic, displayName, userId } = userData;
	const dispatch = useDispatch();
	const inputRef = React.useRef();
	const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

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
		const story = DB.collection("stories").doc(storyId);
		const increment = firebase.firestore.FieldValue.increment(+1);

		story.update({ commentCount: increment });

		inputRef.current.value = "";
	};

	return (
		<div className="">
			<div className="post-details-header">
				<form className="post-form">
					<Avatar src={profilePic} className="post-details-header-avatar" />
					<div className="post-details-header-details">
						<input
							type="text"
							onChange={(e) => setCommentMsg(e.target.value)}
							placeholder={`Join the conversation ${displayName || ""}`}
							className="comment-input-field"
							ref={inputRef}
						/>
						<Button
							className="submit-comment-button"
							type="submit"
							onClick={sendComment}
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
