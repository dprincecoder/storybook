import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { dd } from "../../Dd";
import { formatDate } from "../../helpers/Helpers";
import { useSelector } from "react-redux";
import "./notification.scss";
import DB from "../../firebase/functions";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userData: user.userData,
});

const Notifications = () => {
	// const [notifications, setNotifications] = useState([]);
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

	const [loading, setLoading] = React.useState(false);
	const { userData, currentUser } = useSelector(mapState);
	const { uid } = currentUser;
	const { userId } = userData;

	const d = userId || uid;

	useEffect(() => {
		setLoading(true);

		DB.collection("storyLikesNotifications")
			.where("storyUserUID", "==", d)
			.onSnapshot((snapshot) => {
				setStoryLikesNotifications(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						notificationID: doc.id,
					}))
				);
				setLoading(false);
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
				setLoading(false);
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
				setLoading(false);
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
				setLoading(false);
			});

		return () => {
			setStoryLikesNotifications([]);
			setCommentsLikesNotifications([]);
			setStoryCommentsNotifications([]);
			setReplyCommentNotifications([]);
			setLoading(false);
		};
	}, []);

	const readNotification = (id) => {
		DB.collection("notifications").doc(id).update({ read: true });
	};
	const readNotification1 = (id) => {
		DB.collection("notifications").doc(id).update({ read: true });
	};
	const readNotification2 = (id) => {
		DB.collection("notifications").doc(id).update({ read: true });
	};
	const readNotification3 = (id) => {
		DB.collection("notifications").doc(id).update({ read: true });
	};

	if (!loading && storyLikesNotifications.length < 1) {
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
				{storyLikesNotifications.map((notify, i) => (
					<Link to={`/stories/story/${notify.storyId}`} key={i}>
						<div
							className={`card-body ${!notify.read ? "unread" : "read"}`}
							onClick={() => readNotification(notify.notificationID)}>
							<div className="avatar">
								<Avatar src={notify.userThatNotifyPic} />
							</div>
							<div className="notify-content">
								<b>{notify.userThatNotifyName}</b>
								<p>
									{notify.type}&nbsp;{notify.method} &nbsp; "{notify.notifyMsg}"
								</p>
								<span>{formatDate(notify.createDate)}</span>
								{!notify.read && <div className="dot"></div>}
							</div>
						</div>
					</Link>
				))}
				{commentsLikesNotifications.map((notify, i) => (
					<Link to={`/stories/story/${notify.storyId}`} key={i}>
						<div
							className={`card-body ${!notify.read ? "unread" : "read"}`}
							onClick={() => readNotification1(notify.notificationID)}>
							<div className="avatar">
								<Avatar src={notify.userThatNotifyPic} />
							</div>
							<div className="notify-content">
								<b>{notify.userThatNotifyName}</b>
								<p>
									{notify.type}&nbsp;{notify.method} &nbsp; "{notify.notifyMsg}"
								</p>
								<span>{formatDate(notify.createDate)}</span>
								{!notify.read && <div className="dot"></div>}
							</div>
						</div>
					</Link>
				))}
				{storyCommentsNotifications.map((notify, i) => (
					<Link to={`/stories/story/${notify.storyId}`} key={i}>
						<div
							className={`card-body ${!notify.read ? "unread" : "read"}`}
							onClick={() => readNotification2(notify.notificationID)}>
							<div className="avatar">
								<Avatar src={notify.userThatNotifyPic} />
							</div>
							<div className="notify-content">
								<b>{notify.userThatNotifyName}</b>
								<p>
									{notify.type}&nbsp;{notify.method} &nbsp; "{notify.notifyMsg}"
								</p>
								<span>{formatDate(notify.createDate)}</span>
								{!notify.read && <div className="dot"></div>}
							</div>
						</div>
					</Link>
				))}
				{replyCommentNotifications.map((notify, i) => (
					<Link to={`/stories/story/${notify.storyId}`} key={i}>
						<div
							className={`card-body ${!notify.read ? "unread" : "read"}`}
							onClick={() => readNotification3(notify.notificationID)}>
							<div className="avatar">
								<Avatar src={notify.userThatNotifyPic} />
							</div>
							<div className="notify-content">
								<b>{notify.userThatNotifyName}</b>
								<p>
									{notify.type}&nbsp;{notify.method} &nbsp; "{notify.notifyMsg}"
								</p>
								<span>{formatDate(notify.createDate)}</span>
								{!notify.read && <div className="dot"></div>}
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Notifications;
