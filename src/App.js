import { Alert, AlertTitle } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import "./App.scss";
import { NetworkDetector } from "./components/network/NetworkDetector";
import Topbar from "./components/topbar/Topbar";
import DB from "./firebase/functions";
import WithAuth from "./hoc/withAuth";
import CenteredLayout from "./layouts/CenteredLayout";
import {
	AddStoryPage,
	ChatPage,
	ChatsPage,
	DashboardPage,
	HomePage,
	LoginPage,
	NotificationsPage,
	RecoveryPage,
	RegisterPage,
	SingleStoryPage,
	UserProfilePage,
	VideoPage,
} from "./pages";
import { checkUserSession } from "./redux/user/user.action";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
});

const App = () => {
	const { currentUser } = useSelector(mapState);
	const location = useLocation();
	const [Notifications, setNotifications] = useState([]);
	const [stories, setStories] = useState([]);

	const dispatch = useDispatch();
	const isDisconnected = NetworkDetector();

	useEffect(() => {
		dispatch(checkUserSession());
		DB.collection("Notifications").onSnapshot((snapshot) => {
			setNotifications(
				snapshot.docs.map((doc) => ({
					...doc.data(),
					notificationID: doc.id,
				}))
			);
		});
		DB.collection("stories").onSnapshot((snapshot) => {
			setStories(
				snapshot.docs.map((doc) => ({
					...doc.data(),
					storyID: doc.id,
				}))
			);
		});
	}, []);
	const allNotifications = Notifications;

	return (
		<div className="App">
			<div className="main-left" />
			<CenteredLayout>
				<AnimatePresence>
					<>
						{isDisconnected === "offline" && (
							<Alert
								style={{
									position: "absolute",
									top: 0,
									zIndex: 3,
									width: "100%",
									maxWidth: "100%",
								}}
								severity="error">
								<AlertTitle>You are offline</AlertTitle>
								Try:{" "}
								<ul>
									<li>Checking the network cables, modem and router</li>
									<li>Reconnecting to Wi-Fi</li>
								</ul>
								DNS_PROBE_FINISHED_NO_INTERNET
							</Alert>
						)}
						<div className="topbar">
							{currentUser && (
								<Topbar allNotifications={allNotifications} stories={stories} />
							)}
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
								<Route exact path="/users/chats">
									<WithAuth>
										<ChatsPage />
									</WithAuth>
								</Route>
								<Route exact path="/users/chats/:userChatId">
									<WithAuth>
										<ChatPage />
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
								<Route exact path="/users/user/:userProfileId/profile">
									<WithAuth>
										<UserProfilePage />
									</WithAuth>
								</Route>
							</Switch>
						</div>
					</>
				</AnimatePresence>
			</CenteredLayout>
			<div className="main-right" />
		</div>
	);
};

export default App;
