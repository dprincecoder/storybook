import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.scss";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import CenteredLayout from "./layouts/CenteredLayout";
import LoginPage from "./pages/LoginPage";
import SingleStoryPage from "./pages/SingleStoryPage";
import DashboardPage from "./pages/DashboardPage";
import { dd } from "./Dd";
import RecoveryPage from "./pages/RecoveryPage";

import { useDispatch, useSelector } from "react-redux";
import { checkUserSession } from "./redux/user/user.action";
import WithAuth from "./hoc/withAuth";
import Topbar from "./components/topbar/Topbar";
import AddStoryPage from "./pages/AddStoryPage";

import { NetworkDetector } from "./components/network/NetworkDetector";
import UserStoryPage from "./pages/UserStoryPage";
import VideoPage from "./pages/VideoPage";
import NotificationsPage from "./pages/NotificationsPage";
import { useLocation } from "react-router-dom";
import DB from "./firebase/functions";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userData: user.userData,
});

const App = () => {
	const { currentUser, userData } = useSelector(mapState);
	const uid = !currentUser.uid ? null : currentUser.uid;
	const { userId } = userData;
	const location = useLocation();
	const d = userId || uid;
	// const [notificationCount, setNotificationCount] = useState(0);
	const [storyLikesNotifications, setStoryLikesNotifications] = useState([]);
	const [commentsLikesNotifications, setCommentsLikesNotifications] = useState(
		[]
	);
	const [storyCommentsNotifications, setStoryCommentsNotifications] = useState(
		[]
	);
	const [replyCommentNotifications, setReplyCommentNotifications] = useState(
		[]
	);

	const dispatch = useDispatch();
	NetworkDetector();
	useEffect(() => {
		dispatch(checkUserSession());
		DB.collection("storyLikesNotifications")
			.where("storyUserUID", "==", d)
			.onSnapshot((snapshot) => {
				setStoryLikesNotifications(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						notificationID: doc.id,
					}))
				);
			});

		DB.collection("commentsLikesNotifications")
			.where("storyUserUID", "==", d)
			.onSnapshot((snapshot) => {
				setCommentsLikesNotifications(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						notificationID: doc.id,
					}))
				);
			});

		DB.collection("storyCommentsNotifications")
			.where("storyUserUID", "==", d)
			.onSnapshot((snapshot) => {
				setStoryCommentsNotifications(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						notificationID: doc.id,
					}))
				);
			});

		DB.collection("replyCommentNotifications")
			.where("storyUserUID", "==", d)
			.onSnapshot((snapshot) => {
				setReplyCommentNotifications(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						notificationID: doc.id,
					}))
				);
			});
	}, []);
	const allNotifications = storyLikesNotifications
		.concat(commentsLikesNotifications)
		.concat(replyCommentNotifications)
		.concat(storyCommentsNotifications);

	return (
		<div className="App">
			<CenteredLayout>
				<AnimatePresence>
					<>
						<div className="topbar">
							{currentUser && <Topbar allNotifications={allNotifications} />}
						</div>
						<div className="main">
							<Switch location={location} key={location.pathname}>
								<Route exact path="/">
									<WithAuth>
										<HomePage />
									</WithAuth>
								</Route>
								<Route exact path="/users/register">
									<RegisterPage />
								</Route>
								<Route exact path="/users/login">
									<LoginPage />
								</Route>
								<Route exact path="/users/recovery">
									<RecoveryPage />
								</Route>
								<Route exact path="/stories/story/:storyId">
									<WithAuth>
										<SingleStoryPage />
									</WithAuth>
								</Route>
								<Route exact path="/users/:userId/dashboard">
									<WithAuth>
										<DashboardPage />
									</WithAuth>
								</Route>
								<Route exact path="/users/story/post">
									<WithAuth>
										<AddStoryPage />
									</WithAuth>
								</Route>
								<Route exact path="/users/:userId/stories">
									<WithAuth>
										<UserStoryPage />
									</WithAuth>
								</Route>
								<Route exact path="/videos">
									<WithAuth>
										<VideoPage />
									</WithAuth>
								</Route>
								<Route exact path="/notifications">
									<WithAuth>
										<NotificationsPage />
									</WithAuth>
								</Route>
							</Switch>
						</div>
					</>
				</AnimatePresence>
			</CenteredLayout>
		</div>
	);
};

export default App;
