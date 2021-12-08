import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "./single.scss";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoryStart, setStory } from "../../redux/story/story.action";
import AddComment from "../comments/AddComment";
import {
	handleLikeComment,
	handleLikeStory,
} from "../../redux/story/story.helpers";
import Showcomment from "../comments/showcomments/Showcoment";
import CancelIcon from "@mui/icons-material/Cancel";

import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import { formatDate } from "../../helpers/Helpers";
import DB from "../../firebase/functions";
import MainReply from "../commentsReplies/other/MainReply";
import AllReplies from "../commentsReplies/allReplies/AllReplies";
import ReplyInput from "../commentsReplies/input/ReplyInput";
import firebase from "firebase";

const mapState = ({ user }) => ({
	userData: user.userData,
	currentUser: user.currentUser,
});
const SingleStory = () => {
	const { storyId } = useParams();
	const { userData, currentUser } = useSelector(mapState);
	const { uid } = currentUser;
	const { profilePic, displayName, userId } = userData;
	const [story, setStory] = useState({});
	const [comments, setComments] = useState([]);
	const [toggleReplyBox, setToggleReplyBox] = useState(false);
	const [localCommentId, setLocalCommentId] = useState("");
	const [userThatCommentId, setUserThatCommentId] = useState("");
	const [userThatCommentName, setUserThatCommentName] = useState("");
	const [replies, setReplies] = useState([]);
	const id = userId || uid;
	const {
		storyTitle,
		createdDate,
		storyPhotos,
		storyDetails,
		storyUserUID,
		likeCount,
		userthatPublishedProfilePic,
		userThatPublished,
		commentCount,
	} = story;
	const dispatch = useDispatch();

	useEffect(() => {
		// dispatch(fetchStoryStart(storyId));
		// return () => {
		// 	dispatch(setStory({}));
		// };
		DB.collection("stories")
			.doc(storyId)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) {
					setStory(snapshot.data());
				}
			})
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		DB.collection("comments")
			.where("storyId", "==", storyId)
			.orderBy("createdDate", "desc")
			.onSnapshot((snapshot) => {
				setComments(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						commentID: doc.id,
					}))
				);
			});
	}, []);
	// console.log(comments);

	const toggle = (commentID, userThatCommentId, userThatCommentName) => {
		setToggleReplyBox(!toggleReplyBox);
		setLocalCommentId(commentID);
		setUserThatCommentId(userThatCommentId);
		setUserThatCommentName(userThatCommentName);
	};

	//useEffect to get replies from commentId
	useEffect(() => {
		if (localCommentId) {
			DB.collection("comments")
				.doc(localCommentId)
				.collection("replies")
				.orderBy("createdAt", "asc")
				.onSnapshot((snapshot) => {
					setReplies(
						snapshot.docs.map((doc) => ({
							...doc.data(),
							replyId: doc.id,
						}))
					);
				});
		}
		//clean up function
		return () => {
			setReplies([]);
		};
	}, [localCommentId]);

	const likeStory = () => {
		handleLikeStory(
			id,
			displayName,
			profilePic,
			storyTitle,
			storyId,
			storyUserUID
		);
	};

	const likeComment = async (
		commentID,
		commentMsg,
		userThatCommentName,
		commentOwnerId
	) => {
		let likeDocument = DB.collection("commentLikes");
		let inc = firebase.firestore.FieldValue.increment(+1);
		let likeDocu = DB.collection("commentLikes")
			.where("commentID", "==", commentID)
			.where("userId", "==", userId)
			.limit(1);
		let decr = firebase.firestore.FieldValue.increment(-1);
		let comment = DB.collection("comments").doc(commentID);
		let likeDoc = await likeDocu.get();
		if (likeDoc.empty) {
			likeDocument.doc(`${userId}~${commentID}`).set({
				userId,
				displayName,
				commentID,
			});
			comment.update({
				likeCount: inc,
			});
			if (userId === commentOwnerId) {
				return;
			} else {
				DB.collection("Notifications").doc(`${userId}~${commentID}`).set({
					userThatSentNotificationId: userId,
					userThatSentNotificationName: displayName,
					userThatSentNotificationPic: profilePic,
					commentID,
					storyId,
					userThatOwnNotificationName: userThatCommentName,
					userThatOwnNotificationId: commentOwnerId,
					type: "likes your",
					method: "comment",
					read: false,
					seen: false,
					notificationMsg: commentMsg,
					createdDate: new Date().toISOString(),
				});
			}
		} else {
			likeDocument.doc(`${userId}~${commentID}`).delete();
			comment.update({
				likeCount: decr,
			});
			DB.collection("Notifications").doc(`${userId}~${commentID}`).delete();
		}

		return likeDocument;
	};
	if (!story || !storyUserUID || !userId) {
		return <IsLoadingSkeleton />;
	}
	return (
		<div className={`container ${toggleReplyBox ? "animate-in" : ""}`}>
			<div className="col s12 m12">
				<div className="card">
					<div className="usrChip">
						<Avatar src={userthatPublishedProfilePic} alt={userThatPublished} />
						<div className="userChipOptions">
							<ul>
								<li>
									<Link to="">{userThatPublished}</Link>
								</li>
								<li className="late">{formatDate(createdDate)}</li>
							</ul>
						</div>
					</div>
					<div className="divider"></div>
					<div className="card-content">
						<h4>{storyTitle}</h4>
						<div className="divider"></div>
						<span dangerouslySetInnerHTML={{ __html: storyDetails }} />
						<div className="divider"></div>
						{/* {[1, 2].map((a) => (
						))} */}
						<div className="single-image-container">
							<img
								src={storyPhotos}
								alt={storyTitle}
								className="single-image"
							/>
						</div>
						<div className="optionsCount">
							{likeCount > 0 && (
								<>
									{likeCount === 1 ? (
										<div className="like-count">{likeCount} reacted</div>
									) : (
										<div className="like-count">{likeCount} reaction's</div>
									)}
								</>
							)}
							{commentCount > 0 && (
								<>
									{commentCount === 1 ? (
										<div className="comment-count">{commentCount} comment</div>
									) : (
										<div className="comment-count">{commentCount} comments</div>
									)}
								</>
							)}
						</div>
						<div className="divider"></div>
						<div className="options">
							<div className="like" onClick={likeStory}>
								{likeCount > 0 ? (
									<ThumbUpIcon className="liked" />
								) : (
									<ThumbUpAltOutlinedIcon />
								)}
							</div>
							<div className="comment">comment</div>
						</div>
					</div>

					<div className="divider"></div>

					<div
						className={`replies-main-window ${
							toggleReplyBox ? "show" : "hide"
						}`}>
						<div className="col s12 m12">
							<div className="card-content">
								<div className="body">
									<div className="head">
										<span>Replies</span>
										<div
											className="close-btn"
											onClick={() => setToggleReplyBox(!toggleReplyBox)}>
											<i className="material-icons">close</i>
										</div>
									</div>
									<div className="divider"></div>
									<div className="replies">
										<div className="main-replies">
											{comments
												.filter((c) => c.commentID === localCommentId)
												.map((e, i) => (
													<MainReply
														key={i}
														profilePic={e.userThatCommentImage}
														displayName={e.userThatCommentName}
														createdDate={e.createdDate}
														repliesMsg={e.commentMessage}
														color={e.color}
													/>
												))}
										</div>
										<div className="divider"></div>
										<div className="replies-list">
											{replies.map((reply, index) => (
												<AllReplies
													key={index}
													profilePic={reply.userThatReplyImage}
													displayName={reply.userThatReplyName}
													createdDate={reply.createdAt}
													repliesMsg={reply.replyMessage}
													color={reply.color}
												/>
											))}
										</div>
									</div>
									<div className="replies-input">
										{" "}
										<ReplyInput
											storyId={storyId}
											commentId={localCommentId}
											userThatCommentId={userThatCommentId}
											storyUserUID={storyUserUID}
											userThatCommentName={userThatCommentName}
										/>{" "}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="comments">
						{comments.length > 0 ? (
							<div className="show-comments">
								<span>Discussion Started</span>
								<div className="divider space"></div>
								{comments.map((c, i) => (
									<div key={i}>
										<Showcomment
											profilePic={c.userThatCommentImage}
											displayName={c.userThatCommentName}
											createdDate={c.createdDate}
											commentMsg={c.commentMessage}
											userThatCommentId={c.userThatCommentId}
											color={c.color}
										/>
										<div className="more">
											<div className="action">
												<span
													onClick={() =>
														likeComment(
															c.commentID,
															c.commentMessage,
															c.userThatCommentName,
															c.userThatCommentId
														)
													}>
													like
												</span>
												<p
													onClick={() =>
														toggle(
															c.commentID,
															c.userThatCommentId,
															c.userThatCommentName
														)
													}>
													reply
												</p>
											</div>
											<div className="count">
												{c.likeCount > 0 && (
													<>
														{c.likeCount === 1 ? (
															<span>{c.likeCount} like</span>
														) : (
															<span>{c.likeCount} likes</span>
														)}
													</>
												)}
												{c.replyCount > 0 && (
													<div
														onClick={() =>
															toggle(
																c.commentID,
																c.userThatCommentId,
																c.userThatCommentName
															)
														}>
														{c.replyCount === 1 ? (
															<span>{c.replyCount} reply</span>
														) : (
															<span>{c.replyCount} replies</span>
														)}
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="empty">Be the first to start the conversation.</p>
						)}
						<div className="comment-input">
							<AddComment
								storyId={storyId}
								userId={id}
								displayName={displayName}
								profilePic={profilePic}
								storyTitle={storyTitle}
								storyId={storyId}
								storyUserUID={storyUserUID}
								userThatPublished={userThatPublished}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SingleStory;
