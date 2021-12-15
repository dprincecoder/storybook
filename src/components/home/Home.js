import React, { useEffect, useState } from "react";
import "./home.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoriesStart } from "../../redux/story/story.action";
import HomeStory from "./homeStory/HomeStory";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import LoadMore from "../forms/button/LoadMore";
import DB from "../../firebase/functions";
import { dd } from "../../Dd";
import { NetworkDetector } from "../network/NetworkDetector";

const mapState = ({ storiesData, user }) => ({
	stories: storiesData.stories,
	userData: user.userData,
	currentUser: user.currentUser,
});
const Home = () => {
	const { stories, userData, currentUser } = useSelector(mapState);
	const [data, setData] = useState([]);
	const { userId } = userData;
	const d = userId || currentUser?.uid;

	const isDisconnected = NetworkDetector();

	useEffect(() => {
		// dispatch(
		// 	fetchStoriesStart({
		// 		startAfterDoc: queryDoc,
		// 		persistStories: data,
		// 	})
		// );
		DB.collection("stories")
			.orderBy("createdDate", "desc")
			.onSnapshot((snapshot) => {
				setData(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						documentID: doc.id,
					}))
				);
			});
	}, []);

	useEffect(() => {
		if (d && currentUser?.uid) {
			if (isDisconnected === "online") {
				DB.collection("users").doc(d).update({
					activeStatus: "online",
				});
			} else {
				DB.collection("users").doc(d).update({
					activeStatus: "offline",
				});
			}
		} else {
			return;
		}
	}, [isDisconnected]);

	if (!data || data.length < 1) {
		return <IsLoadingSkeleton />;
	}
	// const handleLoadMore = () => {
	// 	dispatch(
	// 		fetchStoriesStart({
	// 			// filterType,
	// 			startAfterDoc: queryDoc,
	// 			persistStories: data,
	// 		})
	// 	);
	// };
	const configLoadMore = {
		// onLoadMoreEvt: handleLoadMore,
	};
	return (
		<div className="container">
			{data.map((story, index) => {
				const configStory = {
					...story,
				};
				return <HomeStory key={index} {...configStory} />;
			})}
			{/* {!isLastPage && <LoadMore {...configLoadMore} />} */}
		</div>
	);
};

export default Home;
