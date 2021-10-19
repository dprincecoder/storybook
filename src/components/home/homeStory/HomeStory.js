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
	handleUnLikeStory,
} from "../../../redux/story/story.helpers";
import { fetchStoriesStart } from "../../../redux/story/story.action";

const mapState = ({ storiesData }) => ({
	stories: storiesData.stories,
});

const HomeStory = (story) => {
	const dispatch = useDispatch();
	const { stories } = useSelector(mapState);
	const { data, isLastPage, queryDoc } = stories;
	const {
		storyTitle,
		createdDate,
		storyPhotos,
		storyDetails,
		userThatPublished,
		userthatPublishedProfilePic,
		documentID,
		liked,
		likeCount,
	} = story;
	// if (
	// 	!userThatPublished ||
	// 	!storyTitle ||
	// 	!createdDate ||
	// 	!storyPhotos ||
	// 	!storyDetails ||
	// 	!userThatPublished ||
	// 	!userthatPublishedProfilePic ||
	// 	!liked ||
	// 	!likeCount
	// )return;

	useEffect(() => {
		Aos.init({ duration: 2000 });
	}, []);
	const likeStory = () => {
		handleLikeStory(userThatPublished, documentID);
		// dispatch(
		// 	fetchStoriesStart({ startAfterDoc: queryDoc, persistStories: data })
		// );
		setTimeout(() => {
			window.location.reload();
		}, 2000);
	};

	const unlikeStory = () => {
		handleUnLikeStory(documentID);
		// dispatch(
		// 	fetchStoriesStart({ startAfterDoc: queryDoc, persistStories: data })
		// );
		setTimeout(() => {
			window.location.reload();
		}, 2000);
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
						{likeCount > 0 && <div className="btn blue">{likeCount} Likes</div>}
						{/* <div className="btn blue">0 Comments</div> */}
					</div>
					<div className="divider"></div>
					<div className="options">
						<div className="like">
							{liked ? (
								<ThumbUpIcon className="liked" onClick={unlikeStory} />
							) : (
								<ThumbUpAltOutlinedIcon onClick={likeStory} />
							)}
						</div>
						<div className="snapIcon">Snap Share</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeStory;
