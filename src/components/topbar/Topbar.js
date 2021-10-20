import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./topbar.scss";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

import AddBoxIcon from "@mui/icons-material/AddBox";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { fetchUserDataStart, setUserData } from "../../redux/user/user.action";
import IsLoading from "../loading/IsLoading";
const { useSelector } = require("react-redux");

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userData: user.userData,
});
const Topbar = () => {
	const dispatch = useDispatch();
	const { currentUser, userData } = useSelector(mapState);
	const { uid, userId } = currentUser;
	const { profilePic, displayName } = userData;

	useEffect(() => {
		dispatch(fetchUserDataStart(uid));

		return () => {
			dispatch(setUserData({}));
		};
	}, []);
	return (
		<div>
			<div className="app-name">
				<ul className="app-info">
					<li className="name">
						<Link to="/">storybook</Link>
					</li>
					<div className="user-info">
						{!userId ? (
							<IsLoading />
						) : (
							<>
								<li className="tab usr-name">
									<Link to={`/users/${userId}/dashboard`}>{displayName}</Link>
								</li>
								<li className="tab">
									<Link to={`/users/${userId}/dashboard`}>
										<Avatar src={profilePic} />
									</Link>
								</li>
							</>
						)}
					</div>
				</ul>
			</div>
			<nav className={`blue nav-extended`}>
				<div className="nav-wrapper">
					<div className="nav-content">
						<ul className="tabs tabs-transparent">
							<li className="tab icon">
								<Link to="/">
									<HomeIcon />
								</Link>
							</li>
							<li className="tab icon">
								<Link to={`/users/${userId}/stories`}>
									<AutoStoriesIcon />{" "}
								</Link>
							</li>
							<li className="tab icon">
								<Link to={`/notifications`}>
									<CircleNotificationsIcon />
								</Link>
							</li>
							<li className="tab icon">
								<Link to={`/users/story/post`}>
									<AddBoxIcon />
								</Link>
							</li>
							<li className="tab icon">
								<Link to={`/videos`}>
									<VideoLibraryIcon />
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Topbar;
