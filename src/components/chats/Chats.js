import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./chats.scss";
import { formatDate, shortenMsgText } from "../../helpers/Helpers";
import { Link } from "react-router-dom";
import DB from "../../firebase/functions";
import { useSelector } from "react-redux";
import IsLoading from "../../components/loading/IsLoading";

const mapState = ({ user }) => ({
	userData: user.userData,
	currentUser: user.currentUser,
});

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const { userData, currentUser } = useSelector(mapState);
	const [loading, setLoading] = useState(true);
	const { userId } = userData;
	const { uid } = currentUser;
	const d = userId || uid;

	useEffect(() => {
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
	}, [d]);
	return (
		<div className="row">
			<div className="s12 m12">
				<div className="msg-main">
					<div className="msg-main-header">
						<h4>Messages</h4>
					</div>
					<div className="msg-search">
						<input
							type="text"
							className="search"
							placeholder="Search Messages"
						/>
						<i className="material-icons">search</i>
					</div>
				</div>
				<div className="divider"></div>
				<div className="msg-body">
					{messages.length > 0 && !loading ? (
						messages.map((m) => (
							<Link
								to={`/users/chats/${m?.userThatSentMessageId}`}
								className="col s12 m12"
								key={m.messageID}>
								<div className="card-body">
									<div className="msg-left">
										<Avatar
											src={m?.userThatSentMessagePic}
											alt={m?.userThatSentMessageName}
										/>
									</div>
									<div className="msg-right">
										<div className="msg-center-top">
											<h4>{m?.userThatSentMessageName}</h4>
											<div className="msg-center-content">
												{shortenMsgText(m?.message, 50)}
											</div>
										</div>
										<div className="msg-right-end">
											<div className="msg-right-time">
												{formatDate(m?.createdDate)}
											</div>
											{m?.seen && (
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
