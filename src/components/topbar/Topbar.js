import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./topbar.scss";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import AddBoxIcon from "@mui/icons-material/AddBox";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar } from "@material-ui/core";
import usrA from "./PhotoGrid_Plus_1605606730565.png";
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
	const [loading, setLoading] = useState(true);
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
									<AutoStoriesIcon />
								</Link>
							</li>
							{/* <li className="tab icon">
								<Link to={`/stories/notification`}>
									<CircleNotificationsIcon />
								</Link>
							</li> */}
							<li className="tab icon">
								<Link to={`/users/story/post`}>
									<AddBoxIcon />
								</Link>
							</li>
							{!userId ? (
								<IsLoading />
							) : (
								<>
									<li className="tab">
										<Link to={`/users/${userId}/dashboard`}>{displayName}</Link>
									</li>
									<li className="tab usr">
										<Link to={`/users/${userId}/dashboard`}>
											<Avatar src={profilePic} />
										</Link>
									</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</nav>
			<div className="divider"></div>
		</div>
	);
};

export default Topbar;
