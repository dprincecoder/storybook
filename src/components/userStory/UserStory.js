import React, { useEffect } from "react";
import "./userstory.scss";
import { useDispatch, useSelector } from "react-redux";
import DB from "../../firebase/functions";
import {
	fetchUserStoriesStart,
	setStory,
} from "../../redux/story/story.action";
import Story from "./story/Story";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import { useParams } from "react-router-dom";
import LoadMore from "../forms/button/LoadMore";

const mapState = ({ user, storiesData }) => ({
	currentUser: user.currentUser,
});
const UserStory = ({ userId }) => {
	const { stories, currentUser } = useSelector(mapState);
	// const { data, isLastPage, queryDoc } = stories;
	const [data, setData] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		// dispatch(
		// 	fetchUserStoriesStart({
		// 		userId,
		// 	})
		// );
		const fetchData = async () => {
			setLoading(true);
			DB.collection("stories")
				.where("storyUserUID", "==", userId)
				.orderBy("createdDate", "desc")
				.onSnapshot((snapshot) => {
					setData(
						snapshot.docs.map((doc) => ({
							...doc.data(),
							documentID: doc.id,
						}))
					);
					setLoading(false);
				});
		};

		fetchData();
		return () => {
			setData([]);
		};
	}, []);

	// const handleLoadMore = () => {
	// 	dispatch(
	// 		fetchUserStoriesStart({
	// 			userId,
	// 			startAfterDoc: queryDoc,
	// 			persistStories: data,
	// 		})
	// 	);
	// };
	// if (!Array.isArray(data)) return null;
	if (!loading && data.length < 1) {
		return (
			<h6>
				oh no :) <br /> Yours stories not found or slow internet connection, why
				not share your beautiful story this won't take long, to be published.{" "}
			</h6>
		);
	}
	if (loading) {
		return <IsLoadingSkeleton />;
	}

	// const configLoadMore = {
	// 	onLoadMoreEvt: handleLoadMore,
	// };
	return (
		<div className="row">
			<h5 style={{ textAlign: "center" }}>All Your Stories</h5>
			{data.map((story, index) => {
				const configStory = {
					...story,
				};
				return <Story key={index} {...configStory} />;
			})}
			{/* {!isLastPage && <LoadMore {...configLoadMore} />} */}
		</div>
	);
};

export default UserStory;
