import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.scss";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import CenteredLayout from "./layouts/CenteredLayout";
import LoginPage from "./pages/LoginPage";
import SingleStoryPage from "./pages/SingleStoryPage";
import DashboardPage from "./pages/DashboardPage";

import { useDispatch, useSelector } from "react-redux";
import { checkUserSession } from "./redux/user/user.action";
import WithAuth from "./hoc/withAuth";
import Topbar from "./components/topbar/Topbar";
import AddStoryPage from "./pages/AddStoryPage";
import { useLocation } from "react-router-dom";

import { NetworkDetector } from "./components/network/NetworkDetector";
import UserStoryPage from "./pages/UserStoryPage";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
});

const App = () => {
	const { currentUser } = useSelector(mapState);
	const location = useLocation();

	const dispatch = useDispatch();
	NetworkDetector();
	useEffect(() => {
		dispatch(checkUserSession());
	}, []);
	return (
		<div className="App">
			<CenteredLayout>
				<AnimatePresence>
					<React.Fragment key="1">
						{currentUser && <Topbar />}
						<Switch>
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
						</Switch>
					</React.Fragment>
				</AnimatePresence>
			</CenteredLayout>
		</div>
	);
};

export default App;
