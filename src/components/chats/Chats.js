import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./chats.scss";
import { formatDate, shortenMsgText } from "../../helpers/Helpers";
import { Link } from "react-router-dom";
import DB from "../../firebase/functions";
import { useSelector } from "react-redux";
import IsLoading from "../../components/loading/IsLoading";
import InputForm from "../forms/inputs/InputForm";

const mapState = ({ user }) => ({
	userData: user.userData,
	currentUser: user.currentUser,
});

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const { userData, currentUser } = useSelector(mapState);
	const [searchField, setSearchField] = useState("");
	const [loading, setLoading] = useState(true);
	const { userId, displayName, profilePic } = userData;
	const { uid } = currentUser;
	const d = userId || uid;

	useEffect(() => {
		if (d) {
			DB.collection("messages")
				.where("betweenUsers", "array-contains", d)
				.orderBy("createdDate", "desc")
				.onSnapshot((snapshot) => {
					setMessages(
						snapshot.docs.map((doc) => ({
							messageID: doc.id,
							...doc.data(),
						}))
					);
					setLoading(false);
				});
		} else {
			return;
		}
	}, [d]);

	const markAsRead = (messageID) => {
		DB.collection("messages").doc(messageID).update({
			read: true,
		});
	};

	const getSearchMessages = (msgs, input) => {
		return msgs.filter((msg) =>
			JSON.stringify(msg).toLowerCase().includes(input.toLowerCase())
		);
	};

	return (
		<div className="row">
			<div className="s12 m12">
				<div className="msg-main">
					<div className="msg-main-header">
						<h4>Messages</h4>
					</div>
					<div className="msg-search">
						<InputForm
							type="text"
							value={searchField}
							className="search"
							placeholder="Search Messages"
							handleChange={(e) => setSearchField(e.target.value)}
						/>
						<i className="material-icons">search</i>
					</div>
				</div>
				<div className="divider"></div>
				<div className="msg-body">
					{messages.length > 0 && !loading ? (
						getSearchMessages(messages, searchField).map((m) => (
							<Link
								to={`/users/chats/${
									m?.userThatSentMessageId === d
										? m?.userThatOwnMessageId
										: m?.userThatSentMessageId
								}`}
								className="col s12 m12"
								key={m.messageID}>
								<div
									className="card-body"
									onClick={() => markAsRead(m.messageID)}>
									<div className="msg-left">
										<Avatar
											src={
												m?.userThatSentMessagePic === profilePic
													? m?.userThatOwnMessagePic
													: m?.userThatSentMessagePic
											}
											alt="avater"
										/>
									</div>
									<div className="msg-right">
										<div className="msg-center-top">
											<h4 className={`title ${m?.read ? "read" : ""}`}>
												{m?.userThatSentMessageName === displayName
													? m?.userThatOwnMessageName
													: m?.userThatSentMessageName}
											</h4>
											<div
												className={`msg-center-content ${m?.read && "read"}`}>
												{m?.userThatSentMessageName === displayName ? (
													<p style={{ opacity: "0.5" }}>
														You: {shortenMsgText(m?.message, 50)}
													</p>
												) : (
													shortenMsgText(m?.message, 50)
												)}
											</div>
										</div>
										<div className="msg-right-end">
											<div className="msg-right-time">
												{formatDate(m?.createdDate)}
											</div>
											{m?.read && (
												<p className="status">
													<i className="material-icons circle">done</i>
												</p>
											)}
										</div>
									</div>
								</div>
							</Link>
						))
					) : (
						<>
							{loading ? (
								<div className="lo">
									<IsLoading />
								</div>
							) : (
								<p className="center">No Messages</p>
							)}{" "}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Chat;
