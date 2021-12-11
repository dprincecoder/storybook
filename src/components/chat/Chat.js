import React, { useEffect, useState, useRef } from "react";
import "./chat.scss";
import Avatar from "@material-ui/core/Avatar";
import InputForm from "../../components/forms/inputs/InputForm";
import Button from "../../components/forms/button/Button";
import { Link, useHistory, useParams } from "react-router-dom";
import DB from "../../firebase/functions";
import { useSelector } from "react-redux";
import IsLoading from "../../components/loading/IsLoading";
import { formatDate } from "../../helpers/Helpers";

const mapState = ({ user }) => ({
	userData: user.userData,
	currentUser: user.currentUser,
});

const Chat = () => {
	const history = useHistory();
	const [chats, setChats] = useState([]);
	const [usrData, setUsrData] = useState({});
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const divRef = useRef();
	const { userData, currentUser } = useSelector(mapState);
	const { userId, displayName, profilePic } = userData;
	const { uid } = currentUser;
	const d = userId || uid;
	const { userChatId } = useParams();

	const scrollInToView = () =>
		divRef.current?.scrollIntoView({ behavior: "smooth" });

	useEffect(() => {
		DB.collection("messages")
			.doc(userChatId)
			.collection("chat")
			.orderBy("createdDate", "asc")
			.onSnapshot((snapshot) => {
				setChats(
					snapshot.docs.map((doc) => ({
						chatID: doc.id,
						...doc.data(),
					}))
				);
				setLoading(false);
			});

		scrollInToView();
		return () => scrollInToView();
	}, [userChatId]);

	useEffect(() => {
		DB.collection("users")
			.doc(userChatId)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) {
					setUsrData(snapshot.data());
				}
			})
			.catch((err) => console.error(err));
	}, []);
	return (
		<div className="chat-container">
			<div className="col s12 m12">
				<div className="chat-header">
					<div className="chat-header-left">
						<div className="back-arrow" onClick={() => history.goBack()}>
							<i className="material-icons">arrow_back</i>
						</div>
						<div className="user-info">
							<div className="user-info-img">
								<Avatar src={usrData?.profilePic} alt="" />
							</div>
							<div className="user-info-details">
								<Link to={`/users/user/${usrData?.userId}/profile`}>
									{usrData?.displayName}
								</Link>
								<p>{usrData?.activeStatus}</p>
							</div>
						</div>
					</div>
					<div className="chat-header-right">
						<div className="right-gear">
							<i className="material-icons">more_vert</i>
						</div>
					</div>
				</div>
				<div className="divider"></div>
				<div className="chat-body">
					<div className={`chat-body-center`}>
						{chats.length > 0 && !loading ? (
							chats.map((i) => (
								<div className="chat-hod">
									{i.userThatSentChatPic !== profilePic && (
										<div className="chat-img">
											<Avatar src={i.userThatSentChatPic} />
										</div>
									)}
									<div
										className={`${
											displayName === i.userThatSentChat
												? "my-chat"
												: "other-chat"
										}`}>
										{<p>{i.message}</p>}
									</div>
									<div className="time-date">{formatDate(i.createdDate)}</div>
								</div>
							))
						) : (
							<>
								{loading ? (
									<div className="lo">
										<IsLoading />
									</div>
								) : (
									<p className="no-msg">No Messages</p>
								)}{" "}
							</>
						)}
					</div>
					<form className="chat-body-bottom">
						<textarea
							type="text"
							placeholder="Chat..."
							className="chat-body-text"></textarea>
						<Button disabled={!message} type="submit" className="submit-btn">
							<i className="material-icons">send</i>
							<b style={{ dislay: "none" }} ref={divRef} />
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Chat;
