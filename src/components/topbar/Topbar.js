import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./topbar.scss";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { NetworkDetector } from "../network/NetworkDetector";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

import AddBoxIcon from "@mui/icons-material/AddBox";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar } from "@material-ui/core";
import Badge from "@mui/material/Badge";
import { useDispatch } from "react-redux";
import { fetchUserDataStart, setUserData } from "../../redux/user/user.action";
import IsLoading from "../loading/IsLoading";
import Wrapper from "../notificationwrap/Wrapper";
import DB from "../../firebase/functions";
const { useSelector } = require("react-redux");

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userData: user.userData,
});
const Topbar = ({ allNotifications, notificationCount }) => {
	const dispatch = useDispatch();
	const { currentUser, userData } = useSelector(mapState);
	const { uid, userId } = currentUser;
	const { profilePic, displayName } = userData;
	const d = userId || uid;
	const isDisconnected = NetworkDetector();
	console.log(allNotifications);

	const unseenNotifications = allNotifications.filter(
		(not) => not.seen === false
	).length;

	useEffect(() => {
		dispatch(fetchUserDataStart(d));

		if (isDisconnected === "offline") alert("offline");

		return () => {
			dispatch(setUserData({}));
		};
	}, []);

	const seenNotifications = () => {
		let batch = DB.batch();
		allNotifications.forEach((not) => {
			const notification = DB.collection("storyLikesNotifications").doc(
				not.notificationID
			);
			batch.update(notification, { seen: true });
		});
		batch.commit();
	};
	return (
		<div className="fixed">
			<div className="app-name">
				<ul className="app-info">
					<li className="name">
						<Link to="/">STORYBOOK</Link>
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
							<li className="tab icon i">
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
								<Wrapper badgeContent={Number(unseenNotifications)}>
									<Link to={`/notifications`}>
										<CircleNotificationsIcon
											onClick={() => seenNotifications()}
										/>
									</Link>
								</Wrapper>
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
