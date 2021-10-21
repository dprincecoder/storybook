import React, { useEffect } from "react";
import { Avatar } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "./single.scss";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoryStart, setStory } from "../../redux/story/story.action";
import { handleLikeStory } from "../../redux/story/story.helpers";

import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import { formatDate } from "../../helpers/Helpers";

const mapState = ({ user, storiesData }) => ({
	userData: user.userData,
	story: storiesData.story,
});
const SingleStory = () => {
	const { storyId } = useParams();
	const { userData, story } = useSelector(mapState);
	const { profilePic, displayName, userId } = userData;
	const {
		storyTitle,
		createdDate,
		storyPhotos,
		storyDetails,
		storyUserUID,
		likeCount,
		userthatPublishedProfilePic,
		userThatPublished,
	} = story;
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchStoryStart(storyId));
		return () => {
			dispatch(setStory({}));
		};
	}, []);

	if (!story || !storyUserUID) {
		return <IsLoadingSkeleton />;
	}

	const likeStory = () => {
		handleLikeStory(userId, displayName, storyId);
		dispatch(fetchStoryStart(storyId));
	};
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
						<div className="divider"></div>
						<div className="optionsCount">
							{/* <div className="btn blue">0 Comments</div> */}
						</div>
						<div className="options">
							<div className="like" onClick={likeStory}>
								{likeCount > 0 ? (
									<React.Fragment>
										<ThumbUpIcon className="liked" /> &nbsp; &nbsp;
										{likeCount}
									</React.Fragment>
								) : (
									<ThumbUpAltOutlinedIcon />
								)}
							</div>
							<div
								class="snapchat-creative-kit-share snapchat-share-button share-button share-button-grid"
								data-theme="dark"
								data-size="large"
								data-share-url="https://express-the-moment.web.app"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SingleStory;
