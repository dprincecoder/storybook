import React, { useEffect } from "react";
import "./userstory.scss";
import { useDispatch, useSelector } from "react-redux";
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
	stories: storiesData.stories,
});
const UserStory = () => {
	const { stories, currentUser } = useSelector(mapState);
	const { data, isLastPage, queryDoc } = stories;
	const dispatch = useDispatch();
	const { userId } = currentUser;
	useEffect(() => {
		dispatch(
			fetchUserStoriesStart({
				userId,
			})
		);

		return () => {
			dispatch(setStory({}));
		};
	}, []);

	const handleLoadMore = () => {
		dispatch(
			fetchUserStoriesStart({
				userId,
				startAfterDoc: queryDoc,
				persistStories: data,
			})
		);
	};
	if (!Array.isArray(data)) return null;
	if (data.length < 1) {
		return (
			<h6>
				oh no :) <br /> Yours stories not found or slow internet connection, why
				not share your beautiful story this won't take long, to be published.{" "}
			</h6>
		);
	}

	const configLoadMore = {
		onLoadMoreEvt: handleLoadMore,
	};
	return (
		<div className="row">
			<h5 style={{ textAlign: "center" }}>All Your Stories</h5>
			{data.map((story, index) => {
				const configStory = {
					...story,
				};
				return <Story key={index} {...configStory} />;
			})}
			{!isLastPage && <LoadMore {...configLoadMore} />}
		</div>
	);
};

export default UserStory;
