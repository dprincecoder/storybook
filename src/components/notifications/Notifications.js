import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DB from "../../firebase/functions";
import { formatDate } from "../../helpers/Helpers";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import "./notification.scss";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userData: user.userData,
});

const Notifications = () => {
	const [notifications, setNotifications] = useState([]);
	const [welcomeNotes, setWelcomeNotes] = useState([]);
	const [loading, setLoading] = React.useState(true);
	const { userData, currentUser } = useSelector(mapState);
	const { uid } = currentUser;
	const { userId } = userData;

	const d = userId || uid;

	useEffect(() => {
		DB.collection("Notifications")
			.where("userThatOwnNotificationId", "==", d)
			.orderBy("createdDate", "desc")
			.onSnapshot((snapshot) => {
				setNotifications(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						notificationID: doc.id,
					}))
				);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		DB.collection("welcome")
			.where("userThatOwnNotificationId", "==", d)
			.orderBy("createdDate", "desc")
			.onSnapshot((snapshot) => {
				setWelcomeNotes(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						welcomeID: doc.id,
					}))
				);
				setLoading(false);
			});
	}, []);

	const readNotification = (id) => {
		DB.collection("Notifications").doc(id).update({ read: true });
	};

	const readWelcomeNote = (id) => {
		DB.collection("welcome").doc(id).update({ read: true });
	};

	if (!loading && notifications.length < 1 && welcomeNotes.length < 1) {
		return (
			<div>
				<h4>Notifications</h4>
				<div className="divider"></div>
				<p>You are cleared no notifications this time</p>
			</div>
		);
	}
	if (loading) {
		return <IsLoadingSkeleton />;
	}

	return (
		<div className="row">
			<h4>Notifications</h4>
			<div className="divider"></div>
			<div className="col s12 m12">
				{notifications.map((not, i) => (
					<Link to={`/stories/story/${not.storyId}`} key={i}>
						<div
							className={`card-b ${!not.read ? "unread" : "read"}`}
							onClick={() => readNotification(not.notificationID)}>
							<div className="avatar">
								<Avatar src={not.userThatSentNotificationPic} />
							</div>
							<div className="not-content">
								<b>{not.userThatSentNotificationName}</b>
								<p>
									{not.type}&nbsp;{not.method} &nbsp; "{not.notificationMsg}"
								</p>
								<span>{formatDate(not.createdDate)}</span>
							</div>
						</div>
					</Link>
				))}
				{welcomeNotes.map((not, i) => (
					<Link to={`/users/user/welcome`} key={i}>
						<div
							className={`card-b ${!not.read ? "unread" : "read"}`}
							onClick={() => readWelcomeNote(not.welcomeID)}>
							<div className="avatar">
								<Avatar src={not?.logo} />
							</div>
							<div className="not-content">
								<b>{not?.userThatSentNote}</b>
								<p>{not?.note}</p>
								<span>{formatDate(not?.createdDate)}</span>
								{!not?.read && <div className="dot"></div>}
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Notifications;
