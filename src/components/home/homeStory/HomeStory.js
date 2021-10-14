import React from "react";
import {
	formatDate,
	shortenText,
	stripHtmlTags,
} from "../../../helpers/Helpers";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

const HomeStory = (story) => {
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
						<br />
						<b>Read More</b>

						<div className="divider"></div>
						<div className="card-image">
							<img src={storyPhotos} alt={storyTitle} />
						</div>
					</Link>
					<div className="divider"></div>
					<div className="optionsCount">
						{likeCount > 0 && <div className="btn blue">{likeCount}</div>}
						{/* <div className="btn blue">0 Comments</div> */}
					</div>
					<div className="divider"></div>
					<div className="options">
						<div className="like">
							{liked ? (
								<ThumbUpIcon className="liked" />
							) : (
								<ThumbUpAltOutlinedIcon />
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
