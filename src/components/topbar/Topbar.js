import { Avatar } from "@material-ui/core";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ChatIcon from "@mui/icons-material/Chat";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HomeIcon from "@mui/icons-material/Home";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import DB from "../../firebase/functions";
import { fetchUserDataStart, setUserData } from "../../redux/user/user.action";
import IsLoading from "../loading/IsLoading";
import BadgeWrapper from "../notificationwrap/Wrapper";
import "./topbar.scss";

const { useSelector } = require("react-redux");

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userData: user.userData,
});
const Topbar = ({ allNotifications, stories, allMessages }) => {
	const dispatch = useDispatch();
	const { currentUser, userData } = useSelector(mapState);
	const { uid, userId } = currentUser;
	const { profilePic, displayName, activeStatus } = userData;
	const d = userId || uid;

	const unseenNotifications = allNotifications
		.filter((id) => id.userThatOwnNotificationId === userId)
		.filter((not) => not.seen === false).length;
	const unseenStories = stories.filter((id) => id.seen === false).length;
	const unseenMsgs = allMessages.filter((id) => id.seen === false).length;
	useEffect(() => {
		dispatch(fetchUserDataStart(d));

		return () => {
			dispatch(setUserData({}));
		};
	}, []);

	const markNotificationsSeen = () => {
		let batch = DB.batch();
		allNotifications
			.filter((not) => not.userThatOwnNotificationId === userId)
			.forEach((not) => {
				const notificationIDS = not.notificationID;
				const notification =
					DB.collection("Notifications").doc(notificationIDS);

				batch.update(notification, { seen: true });
			});
		batch.commit();
	};

	const markStoriesSeen = () => {
		let batch = DB.batch();
		stories.forEach((story) => {
			const storyID = story.storyID;
			const storyDoc = DB.collection("stories").doc(storyID);
			batch.update(storyDoc, { seen: true });
		});
		batch.commit();
	};

	const markMsgsSeen = () => {
		let batch = DB.batch();
		allMessages.forEach((msg) => {
			const msgID = msg.messageID;
			const msgDoc = DB.collection("messages").doc(msgID);
			batch.update(msgDoc, { seen: true });
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
								<li className="tab badge">
									<Link to={`/users/${userId}/dashboard`}>
										<Avatar src={profilePic} />
									</Link>
									{activeStatus && <div className="activeBadge"></div>}
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
								<BadgeWrapper badgeContent={Number(unseenStories)}>
									<Link to="/">
										<HomeIcon onClick={markStoriesSeen} />
									</Link>
								</BadgeWrapper>
							</li>
							<li className="tab icon">
								<BadgeWrapper badgeContent={Number(unseenMsgs)}>
									<Link to={`/users/chats`}>
										<ChatIcon onClick={markMsgsSeen} />{" "}
									</Link>
								</BadgeWrapper>
							</li>
							<li className="tab icon">
								<BadgeWrapper badgeContent={Number(unseenNotifications)}>
									<Link to={`/notifications`}>
										<CircleNotificationsIcon
											onClick={() => markNotificationsSeen()}
										/>
									</Link>
								</BadgeWrapper>
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
							<div className="tab icon">
								<Link to="/users/user/more">
									<FormatListBulletedIcon />
								</Link>
							</div>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Topbar;
