import React, { useEffect } from "react";
import "./home.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoriesStart } from "../../redux/story/story.action";
import HomeStory from "./homeStory/HomeStory";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";

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

	return (
		<div className="row">
			{!data || data.length < 1 ? (
				<IsLoadingSkeleton />
			) : (
				data.map((story, index) => {
					const configStory = {
						...story,
					};
					return <HomeStory key={index} {...configStory} />;
				})
			)}
		</div>
	);
};

export default Home;
