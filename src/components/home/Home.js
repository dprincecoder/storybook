import React, { useEffect } from "react";
import "./home.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoriesStart } from "../../redux/story/story.action";
import HomeStory from "./homeStory/HomeStory";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import LoadMore from "../forms/button/LoadMore";

const mapState = ({ storiesData }) => ({
	stories: storiesData.stories,
});
const Home = () => {
	const { stories } = useSelector(mapState);
	const { data, isLastPage, queryDoc } = stories;
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(
			fetchStoriesStart({
				startAfterDoc: queryDoc,
				persistStories: data,
			})
		);
	}, []);

	if (!data || data.length < 1) {
		return <IsLoadingSkeleton />;
	}
	const handleLoadMore = () => {
		dispatch(
			fetchStoriesStart({
				// filterType,
				startAfterDoc: queryDoc,
				persistStories: data,
			})
		);
	};
	const configLoadMore = {
		onLoadMoreEvt: handleLoadMore,
	};
	return (
		<div className="row">
			{data.map((story, index) => {
				const configStory = {
					...story,
				};
				return <HomeStory key={index} {...configStory} />;
			})}
			{!isLastPage && <LoadMore {...configLoadMore} />}
		</div>
	);
};

export default Home;
