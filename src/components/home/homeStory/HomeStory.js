import React, { useEffect } from "react";
import {
	formatDate,
	shortenText,
	stripHtmlTags,
} from "../../../helpers/Helpers";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import Aos from "aos";
import "aos/dist/aos.css";
import { useDispatch, useSelector } from "react-redux";
import {
	handleLikeStory,
	// handleUnLikeStory,
} from "../../../redux/story/story.helpers";
import { fetchStoriesStart } from "../../../redux/story/story.action";

const mapState = ({ user, storiesData }) => ({
	userData: user.userData,
	stories: storiesData.stories,
});

const HomeStory = (story) => {
	const dispatch = useDispatch();
	const { stories, userData } = useSelector(mapState);
	const { userId, displayName } = userData;
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
	} = story;

	useEffect(() => {
		Aos.init({ duration: 2000 });
	}, []);

	const likeStory = () => {
		handleLikeStory(userId, displayName, documentID);
		// dispatch(
		// 	fetchStoriesStart({ startAfterDoc: queryDoc, persistStories: data })
		// );
	};

	return (
		<div className="col s12 m12" data-aos="fade-up">
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
						<br />
						<b>Read More</b>

						<div className="divider"></div>
						<div className="card-image">
							<img src={storyPhotos} alt={storyTitle} />
						</div>
					</Link>
					<div className="divider"></div>
					<div className="optionsCount">
						<div>
							{likeCount > 0 && (
								<>
									{likeCount === 1 ? (
										<div className="comment-count">{likeCount} reacted</div>
									) : (
										<div className="comment-count">{likeCount} reaction's</div>
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
