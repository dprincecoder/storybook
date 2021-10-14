import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import usrA from "./PhotoGrid_Plus_1605606730565.png";
import storyImg from "./wal42.jpeg";
import "./single.scss";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoryStart, setStory } from "../../redux/story/story.action";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import { formatDate } from "../../helpers/Helpers";

const mapState = ({ user, storiesData }) => ({
	currentUser: user.currentUser,
	story: storiesData.story,
});
const SingleStory = () => {
	const { storyId } = useParams();
	const { currentUser, story } = useSelector(mapState);
	const {
		storyTitle,
		createdDate,
		storyPhotos,
		storyDetails,
		userThatPublished,
		userthatPublishedProfilePic,
		storyUserUID,
		liked,
		likeCount,
	} = story;
	const dispatch = useDispatch();
	// const {userId} = useParams();

	useEffect(() => {
		dispatch(fetchStoryStart(storyId));
		return () => {
			dispatch(setStory({}));
		};
	}, []);
	return (
		<div className="row">
			{!story || !storyUserUID ? (
				<IsLoadingSkeleton />
			) : (
				<div className="col s12 m12">
					<div className="card">
						<div className="usrChip">
							<Avatar
								src={userthatPublishedProfilePic}
								alt={userThatPublished}
							/>
							<div className="userChipOptions">
								<ul>
									<li>
										<Link to="/user/233">{userThatPublished}</Link>
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
							<div className="divider"></div>
							<div className="optionsCount">
								{likeCount > 0 && <div className="btn blue">0 Likes</div>}
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
			)}
		</div>
	);
};

export default SingleStory;
