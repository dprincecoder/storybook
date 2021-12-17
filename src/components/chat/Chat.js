import React, { useEffect, useState, useRef } from "react";
import "./chat.scss";
import Avatar from "@material-ui/core/Avatar";
// import InputForm from "../../components/forms/inputs/InputForm";
import Button from "../../components/forms/button/Button";
import { Link, useHistory, useParams } from "react-router-dom";
import DB from "../../firebase/functions";
import { useSelector } from "react-redux";
import IsLoading from "../../components/loading/IsLoading";
import { formatDate } from "../../helpers/Helpers";
import { storage } from "../../firebase/functions";
import InputForm from "../forms/inputs/InputForm";

const mapState = ({ user }) => ({
	userData: user.userData,
	currentUser: user.currentUser,
});

const Chat = () => {
	const history = useHistory();
	const [chats, setChats] = useState([]);
	const [usrData, setUsrData] = useState({});
	const [image, setImage] = useState(null);
	const [voice, setVoice] = useState(null);
	const [startRec, setStartRec] = useState(false);
	const [started, setStarted] = useState(false);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [searchField, setSearchField] = useState("");
	const [startSearch, setStartSearch] = useState(false);
	const divRef = useRef();
	const stopBtnRef = useRef();
	const sendNoteRef = useRef();
	const { userData, currentUser } = useSelector(mapState);
	const { userId, displayName, profilePic } = userData;
	const { uid } = currentUser;
	const d = userId || uid;
	const { userChatId } = useParams();

	const scrollInToView = () =>
		divRef.current?.scrollIntoView({ behavior: "smooth" });

	const uniqId = d > userChatId ? `${d}${userChatId}` : `${userChatId}${d}`;

	useEffect(() => {
		DB.collection("messages")
			.doc(uniqId)
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

		return () => divRef.current?.removeEventListener("scroll", scrollInToView);
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

	const sendChat = (e) => {
		e.preventDefault();
		if (message) {
			DB.collection("messages")
				.doc(uniqId)
				.update({
					message: message,
				})
				.collection("chat")
				.add({
					message,
					userThatOwnChatId: userChatId,
					userThatOwnChatName: usrData?.displayName,
					userThatSentChatId: d,
					createdDate: new Date().toISOString(),
					seen: false,
					read: false,
					userThatSentChatName: displayName,
					userThatSentChatPic: profilePic,
					userThatOwnChatPic: usrData?.profilePic,
					betweenUsers: [userChatId, d],
				})
				.then(() => {
					setMessage("");
					scrollInToView();
				})
				.catch((err) => console.error(err));
		}
	};
	const sendImage = (e) => {
		const uploadTask = storage.ref(`chatImages/${image.name}`).put(image);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				// progress function ...
			},
			(err) => {
				// error function ...
			},
			() => {
				// complete function ...
				storage
					.ref("storyImages")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						DB.collection("messages")
							.doc(uniqId)
							.collection("chat")

							.add({
								message: "",
								imageUrl: url,
								userThatOwnChatId: userChatId,
								userThatOwnChatName: usrData?.displayName,
								userThatSentChatId: d,
								createdDate: new Date().toISOString(),
								seen: false,
								read: false,
								userThatSentChatName: displayName,
								userThatSentChatPic: profilePic,
								userThatOwnChatPic: usrData?.profilePic,
								betweenUsers: [userChatId, d],
							})
							.then(() => {
								setImage(null);
								scrollInToView();
							})
							.catch((err) => console.error(err));
					});
			}
		);
	};

	const startRecording = async () => {
		setStartRec(!startRec);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			});
			const mimeType = "audio/webm";
			const mediaRecorder = new MediaRecorder(stream, { type: mimeType });
			const audioChunks = [];

			mediaRecorder.addEventListener("dataavailable", (event) => {
				if (typeof event.data === "undefined") return;
				if (event.data.size === 0) return;
				audioChunks.push(event.data);
			});

			mediaRecorder.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunks);
				setVoice(audioBlob);
				const metadata = {
					contentType: "audio/webm",
				};
				sendNoteRef.current.addEventListener("click", () => {
					const date = Math.floor(Date.now() / 1000);
					const uploadTask = storage
						.ref(`chatAudio/${date + ".mp3"}`)
						.put(audioBlob, metadata);

					uploadTask.on(
						"state_changed",
						(snapshot) => {
							// progress function ...
						},
						(err) => {
							// error function ...
						},
						() => {
							// complete function ...
							storage
								.ref("chatAudio")
								.child(date + ".mp3")
								.getDownloadURL()
								.then((url) => {
									DB.collection("messages")
										.doc(uniqId)
										.collection("chat")

										.add({
											message: "",
											imageUrl: "",
											audioUrl: url,
											userThatOwnChatId: userChatId,
											userThatOwnChatName: usrData?.displayName,
											userThatSentChatId: d,
											createdDate: new Date().toISOString(),
											seen: false,
											read: false,
											userThatSentChatName: displayName,
											userThatSentChatPic: profilePic,
											userThatOwnChatPic: usrData?.profilePic,
											betweenUsers: [userChatId, d],
										})
										.then(() => {
											setVoice(null);
											scrollInToView();
										})
										.catch((err) => console.error(err));
								});
						}
					);
				});
			});
			if (mediaRecorder.state === "inactive") {
				mediaRecorder.start();
				setStarted(!started);
			}
			stopBtnRef.current.addEventListener("click", () => {
				mediaRecorder.stop();
				setStarted(false);
			});
		} catch (err) {
			console.error(err);
		}
	};

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
								<div
									className={`activeBadge ${
										usrData?.activeStatus === "online" ? "active" : "offline"
									}`}></div>
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
						{startSearch ? (
							<div className="search-wrapper">
								<InputForm
									type="text"
									className="search"
									placeholder="Search chats"
									onChange={(e) => setSearchField(e.target.value)}
								/>
								<i
									className="material-icons"
									onClick={() => setStartSearch(!startSearch)}>
									close
								</i>
							</div>
						) : (
							<i
								className="material-icons"
								style={{ cursor: "pointer" }}
								onClick={() => setStartSearch(!startSearch)}>
								search
							</i>
						)}
					</div>
				</div>
				<div className="divider"></div>
				<div className="chat-body">
					<div className={`chat-body-center`}>
						{chats.length > 0 && !loading ? (
							chats.map((i) => (
								<div key={i.chatID}>
									<div className="time-date">{formatDate(i.createdDate)}</div>
									<div className="chat-hod">
										{i.userThatSentChatPic !== profilePic && (
											<div className="chat-img">
												<Avatar src={i.userThatSentChatPic} />
											</div>
										)}
										<div
											className={`${
												displayName === i.userThatSentChatName
													? "my-chat"
													: "other-chat"
											}`}>
											{i.message && <p>{i.message}</p>}

											{i.imageUrl && (
												<div className="chatcon">
													<img src={i.imageUrl} alt="" className="chat-img" />
												</div>
											)}

											{i.audioUrl && (
												<div className="audio-container">
													<audio src={i.audioUrl} controls />
												</div>
											)}
										</div>
									</div>
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
					{image && (
						<div className="image-preview">
							<img src={URL.createObjectURL(image)} alt="upload image" />
							<div className="send">
								<div className="modal-close" onClick={() => setImage(null)}>
									<i className="material-icons">close</i>
								</div>
								<Button custom="blue" onClick={sendImage}>
									Send
								</Button>
							</div>
						</div>
					)}

					{voice && (
						<div className="voice-preview">
							<audio src={URL.createObjectURL(voice)} controls />
							<div className="send">
								<div className="modal-close" onClick={() => setVoice(null)}>
									<i className="material-icons">close</i>
								</div>
								<button className="send-note" ref={sendNoteRef}>
									Send
								</button>
							</div>
						</div>
					)}
					{startRec && (
						<div className="start">
							<Button custom="blue" onClick={startRecording}>
								start
							</Button>
							<Button custom="blue" onClick={() => setStartRec(!startRec)}>
								Cancel
							</Button>
						</div>
					)}
					{started && (
						<div className="recording">
							<span className="stop" ref={stopBtnRef}>
								Stop
							</span>
						</div>
					)}
					<form
						className={`chat-body-bottom form ${
							message.length > 0 ? "typing" : ""
						}`}
						onSubmit={sendChat}>
						<div className="chat-more">
							<input
								type="file"
								name="imageUpload"
								disabled={loading}
								style={{ display: "none" }}
								id="imageUpload"
								onChange={(e) => setImage(e.target.files[0])}
							/>
							<label htmlFor="imageUpload">
								<i className="material-icons">image</i>
							</label>

							<div
								className={`voiceUpload ${started ? "animate" : ""}`}
								onClick={() => setStartRec(!startRec)}>
								<i className="material-icons">mic</i>
							</div>
						</div>
						<div className="chat-input">
							<textarea
								type="text"
								placeholder="Chat..."
								disabled={loading || image}
								value={message}
								onEnter={sendChat}
								onChange={(e) => setMessage(e.target.value)}
								className="chat-body-text"></textarea>
							<Button disabled={!message} type="submit" className="submit-btn">
								<i className="material-icons">send</i>
								<b style={{ dislay: "none" }} ref={divRef} />
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Chat;
