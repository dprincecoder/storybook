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
import MainReply from "./replies/main/MainReply";
import ReplyInput from "./replies/input/ReplyInput";
import AllReplies from "./replies/allReplies/AllReplies";

const mapState = ({ user }) => ({
	userData: user.userData,
});
const SingleStory = () => {
	const { storyId } = useParams();
	const { userData } = useSelector(mapState);
	const { profilePic, displayName, userId } = userData;
	const [story, setStory] = useState({});
	const [comments, setComments] = useState([]);
	const [toggleReplyBox, setToggleReplyBox] = useState(false);
	const [localCommentId, setLocalCommentId] = useState("");
	const [replies, setReplies] = useState([]);
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

	const toggle = (commentID, commentN) => {
		setToggleReplyBox(!toggleReplyBox);
		setLocalCommentId(commentID);
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
		handleLikeStory(userId, displayName, storyId);
	};

	const likeComment = (commentID) => {
		handleLikeComment(userId, displayName, commentID);
	};
	if (!story || !storyUserUID) {
		return <IsLoadingSkeleton />;
	}
	return (
		<div className="row">
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
						<div className="card-image">
							<img src={storyPhotos} alt={storyTitle} />
						</div>
						<div className="optionsCount">
							{likeCount > 0 && (
								<>
									{likeCount === 1 ? (
										<div className="comment-count">{likeCount} reacted</div>
									) : (
										<div className="comment-count">{likeCount} reaction's</div>
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

					<div className={`row ${toggleReplyBox ? "show" : "hide"}`}>
						<div className="col s12 m12">
							<div className="card-content">
								<div className="window">
									<div
										className="window-header"
										onClick={() => setToggleReplyBox(!toggleReplyBox)}>
										<CancelIcon style={{ color: "red" }} />
									</div>
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
										/>{" "}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="comments">
						{comments.length > 0 ? (
							<div className="show-comments">
								{comments.map((c, i) => (
									<div key={i}>
										<Showcomment
											profilePic={c.userThatCommentImage}
											displayName={c.userThatCommentName}
											createdDate={c.createdDate}
											commentMsg={c.commentMessage}
											color={c.color}
										/>
										<div className="more">
											<div className="action">
												<span onClick={() => likeComment(c.commentID)}>
													like
												</span>
												<p
													onClick={() =>
														toggle(c.commentID, c.userThatCommentName)
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
													<div onClick={() => toggle(c.commentID)}>
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
							<AddComment storyId={storyId} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SingleStory;
