import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import Button from "../../components/forms/button/Button";
import IsLoading from "../../components/loading/IsLoading";
import DB from "../../firebase/functions";
import "./userProfile.scss";
import { formatDate } from "../../helpers/Helpers";
import Avatar from "@material-ui/core/Avatar";

const mapState = ({ user }) => ({
	userData: user.userData,
	currentUser: user.currentUser,
});
const UserProfile = () => {
	const [showInput, setShowInput] = useState(false);
	const [usrStories, setUsrStories] = useState([]);
	const [message, setMessage] = useState("");
	const [userProfile, setUserProfile] = useState({});
	const [current, setCurrent] = useState(0);
	const history = useHistory();
	const { userData, currentUser } = useSelector(mapState);
	const { userId, displayName, profilePic } = userData;
	const { uid } = currentUser;
	const d = userId || uid;
	const { userProfileId } = useParams();

	const uniqId =
		d > userProfileId ? `${d}${userProfileId}` : `${userProfileId}${d}`;

	const fetchUserProfile = () => {
		DB.collection("users")
			.doc(userProfileId)
			.get()
			.then((doc) => {
				setUserProfile(doc.data());
			});
	};

	const submit = (e) => {
		e.preventDefault();
		DB.collection("messages")
			.doc(uniqId)
			.set({
				message,
				userThatOwnMessageId: userProfileId,
				userThatSentMessageId: d,
				createdDate: new Date().toISOString(),
				seen: false,
				read: false,
				userThatSentMessageName: displayName,
				userThatSentMessagePic: profilePic,
				userThatOwnMessageName: userProfile?.displayName,
				userThatOwnMessagePic: userProfile?.profilePic,
				betweenUsers: [userProfileId, d],
			})
			.then(() => {
				DB.collection("messages")
					.doc(uniqId)
					.collection("chat")
					.doc()
					.set({
						message,
						userThatOwnChatId: userProfileId,
						userThatOwnChatName: userProfile?.displayName,
						userThatSentChatId: d,
						createdDate: new Date().toISOString(),
						seen: false,
						read: false,
						userThatSentChatName: displayName,
						userThatSentChatPic: profilePic,
						userThatOwnChatPic: userProfile?.profilePic,
						betweenUsers: [userProfileId, d],
					});
			})
			.then(() => {
				setMessage("");
				history.push(`/users/chats/${userProfileId}`);
			});
	};

	useEffect(() => {
		fetchUserProfile();
	}, [userProfileId]);

	const followUser = () => {
		DB.collection("users")
			.doc(userProfileId)
			.update({
				followers: [...userProfile.followers, d],
			})
			.then(() => {
				DB.collection("users")
					.doc(d)
					.update({
						following: [...userProfile.following, userProfileId],
					})
					.then(() => {
						fetchUserProfile();
					});
			});
	};

	const unfollowUser = () => {
		DB.collection("users")
			.doc(userProfileId)
			.update({
				followers: userProfile?.followers.filter((follower) => follower !== d),
			})
			.then(() => {
				DB.collection("users")
					.doc(d)
					.update({
						following: userProfile.following.filter(
							(following) => following !== userProfileId
						),
					})
					.then(() => {
						fetchUserProfile();
					});
			});
	};

	useEffect(() => {
		DB.collection("stories")
			.where("storyUserUID", "==", userProfileId)
			.onSnapshot((snapshot) => {
				setUsrStories(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
				);
			});
	}, [userProfileId]);

	return (
		<div className="">
			{!userProfile.userId ? (
				<div className="loading">
					<IsLoading />
				</div>
			) : (
				<>
					<div className="profile-bg-container">
						<div
							className="profile-bg"
							style={{
								backgroundImage: `url(${userProfile?.profilePic})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								backgroundRepeat: "no-repeat",
								height: "100%",
							}}></div>
					</div>
					<div className="col s12 m12">
						<div className="profile-full">
							<div className="profile-details">
								<div className="avater-n-name">
									<div className="main-photo">
										<Avatar src={userProfile?.profilePic} />
										<div
											className={`active-status ${
												userProfile?.activeStatus === "online"
													? "active"
													: "offline"
											}`}
										/>
									</div>
									<div className="profile">
										<h3>{userProfile?.displayName}</h3>
										<div className="active-now">
											{userProfile?.activeStatus} &nbsp;now
										</div>
									</div>
									<div className="divider"></div>
								</div>
								{userProfile?.city && (
									<div className="profile-location">
										<i className="material-icons">location_on</i>
										<p className="location-detials">{userProfile?.city}</p>
									</div>
								)}
								{/* <div className="joined">
									Joined: {userProfile?.createdDate.split("T")[0]}
								</div> */}
								{userProfile?.web && (
									<div className="profile-info">
										<i className="material-icons">web</i>
										<p>
											<a
												href={`${userProfile?.web}`}
												target="_blank"
												rel="noreferal noopener">
												{userProfile?.web}
											</a>
										</p>
									</div>
								)}
								<div className="profile-bio">{userProfile?.bio}</div>
							</div>
							<div className="profile-actions">
								{d !== userProfile?.userId && (
									<div className="actions-btn">
										{userProfile?.followers?.includes(d) ? (
											<p className="follow-btn" onClick={unfollowUser}>
												Unfollow
											</p>
										) : (
											<p className="follow-btn" onClick={followUser}>
												Follow
											</p>
										)}

										<p onClick={() => setShowInput(!showInput)}>Message</p>
									</div>
								)}
								{showInput && (
									<>
										<form className="message-input" onSubmit={submit}>
											<textarea
												placeholder="Type your message here..."
												className="message-input-textarea"
												value={message}
												name="message"
												onChange={(e) => setMessage(e.target.value)}></textarea>
											<Button
												disabled={!message}
												type="submit"
												className="send-button">
												<i className="material-icons">send</i>
											</Button>
										</form>
									</>
								)}
								<div className="actions-activity">
									<p>
										<span>
											{usrStories?.length < 1 ? 0 : usrStories?.length}
										</span>
										<span className="pre">stories</span>
									</p>
									<p>
										{" "}
										<span>{userProfile?.followers?.length}</span>
										<span className="pre">followers</span>
									</p>
									<p>
										{" "}
										<span>{userProfile?.following?.length}</span>
										<span className="pre">following</span>
									</p>
								</div>
							</div>
							<div className="divider"></div>
							<div className="profile-stories">
								<h6>Stories</h6>

								<div
									className={`profile-container ${
										usrStories.length === 1 ? "one-img" : "many"
									}`}>
									{usrStories.map((story, index) => (
										<div key={index}>
											<Link
												to={`/stories/story/${story.id}`}
												className="story-holder">
												<div className="story-title">
													<p>{story.storyTitle}</p>
												</div>
												<div className="story-img">
													<img
														src={story.storyPhotos}
														alt="story"
														className="storyImg"
													/>
												</div>
											</Link>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default UserProfile;
