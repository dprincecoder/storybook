import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { Avatar } from "@mui/material";
import "aos/dist/aos.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	formatDate,
	shortenText,
	stripHtmlTags,
} from "../../../helpers/Helpers";
import { handleLikeStory } from "../../../redux/story/story.helpers";

const mapState = ({ user, storiesData }) => ({
	userData: user.userData,
	stories: storiesData.stories,
});

const HomeStory = (story) => {
	const dispatch = useDispatch();
	const { stories, userData } = useSelector(mapState);
	const { userId, displayName, profilePic } = userData;
	const { data, queryDoc } = stories;

	const {
		storyTitle,
		createdDate,
		storyPhotos,
		storyDetails,
		userThatPublished,
		userthatPublishedProfilePic,
		likeCount,
		commentCount,
		documentID,
		storyUserUID,
	} = story;

	const likeStory = () => {
		handleLikeStory(
			userId,
			displayName,
			profilePic,
			storyTitle,
			documentID,
			storyUserUID
		);
		// dispatch(
		// 	fetchStoriesStart({ startAfterDoc: queryDoc, persistStories: data })
		// );
	};

	// console.log(storyUserUID);

	return (
		<div className="col s12 m12">
			<div className="card">
				<div className="usrChip">
					<Avatar src={userthatPublishedProfilePic} alt="" />
					<div className="userChipOptions">
						<ul>
							<li>
								<Link to="/stories/user/">{userThatPublished}</Link>
							</li>
							<li className="late">{formatDate(createdDate)}</li>
						</ul>
					</div>
				</div>
				<div className="divider"></div>
				<div className="card-content">
					<Link to={`/stories/story/${documentID}`}>
						<h4>{storyTitle}</h4>
						<div className="divider"></div>
						<span>{stripHtmlTags(shortenText(storyDetails, 150))}</span>

						<div className="divider"></div>
						<div className="home-image-container">
							<img src={storyPhotos} alt={storyTitle} className="home-image" />
						</div>
					</Link>
					<div className="optionsCount">
						<div>
							{likeCount > 0 && (
								<>
									{likeCount === 1 ? (
										<div className="like-count">{likeCount} reacted</div>
									) : (
										<div className="like-count">{likeCount} reaction's</div>
									)}
								</>
							)}
						</div>
						<div>
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
					</div>
					{/* <hr /> */}
					<div className="divider"></div>
					<div className="options">
						<div className="like" onClick={likeStory}>
							{likeCount > 0 ? (
								<ThumbUpIcon className="liked" />
							) : (
								<ThumbUpAltOutlinedIcon />
							)}
						</div>
						<Link to={`/stories/story/${documentID}`}>Comments</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeStory;
