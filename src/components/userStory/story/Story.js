import React, { useState, useEffect } from "react";
import {
	formatDate,
	shortenText,
	stripHtmlTags,
} from "../../../helpers/Helpers";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import { Delete } from "@material-ui/icons";
import Button from "../../forms/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteStoryStart } from "../../../redux/story/story.action";
import Aos from "aos";
import "aos/dist/aos.css";
import { handleLikeStory } from "../../../redux/story/story.helpers";
import { fetchStoriesStart } from "../../../redux/story/story.action";

const mapState = ({ user, storiesData }) => ({
	userData: user.userData,
	stories: storiesData.stories,
});

const Story = (story) => {
	const dispatch = useDispatch();
	const { userData, stories } = useSelector(mapState);
	const { profilePic, displayName, userId } = userData;
	const { data, queryDoc } = stories;

	const [del, setDel] = useState(false);
	const [delSuccess, setDelSuccess] = useState(false);
	const {
		storyTitle,
		createdDate,
		storyPhotos,
		storyDetails,
		userThatPublished,
		userthatPublishedProfilePic,
		documentID,
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
	const handleDeleteStory = () => {
		dispatch(deleteStoryStart(documentID));
		setDelSuccess(true);
		setDel(!del);
		setTimeout(() => {
			setDelSuccess(false);
			window.location.reload();
		}, 3000);
	};

	const likeStory = () => {
		handleLikeStory(userId, displayName, documentID);
		dispatch(
			fetchStoriesStart({ startAfterDoc: queryDoc, persistStories: data })
		);
	};

	return (
		<div data-aos="fade-up" className="col s12 m12">
			{delSuccess && (
				<p style={{ color: "green" }}>Story Deleted Successfully</p>
			)}
			<div className="card">
				<div className={`usrChip ${del ? "open" : ""}`}>
					<Avatar src={userthatPublishedProfilePic} alt={userThatPublished} />
					<div className="userChipOptions">
						<ul>
							<li>
								<Link to="/stories/user/">{userThatPublished}</Link>
							</li>
							<li className="late">{formatDate(createdDate)}</li>
						</ul>
					</div>
					<div className="delete">
						<Delete
							onClick={() => setDel(!del)}
							style={{ color: "red", textAlign: "center", paddingTop: "3px" }}
						/>
					</div>
					<div className="confirm">
						<p>
							Are you sure you want to delete this story? this action is
							destructive and non reversible once confirmed.
						</p>
						<div className="btns">
							<Button custom="btn red" onClick={handleDeleteStory}>
								Confirm
							</Button>
							<Button
								custom="btn green"
								style={{
									marginLeft: "1rem",
								}}
								onClick={() => setDel(!del)}>
								Cancel
							</Button>
						</div>
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
						{/* <div className="btn blue">0 Comments</div> */}
					</div>
					<div className="divider"></div>
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
							className="snapchat-creative-kit-share snapchat-share-button share-button share-button-grid"
							data-theme="dark"
							data-size="small"
							data-share-url="https://express-the-moment.web.app"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Story;
