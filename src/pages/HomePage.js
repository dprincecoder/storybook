import React from "react";
import Home from "../components/home/Home";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoriesStart } from "../redux/story/story.action";

const mapState = ({ storiesData }) => ({
	stories: storiesData.stories,
});

const HomePage = () => {
	const { stories } = useSelector(mapState);
	const dispatch = useDispatch();
	const { data, isLastPage, queryDoc } = stories;

	const handleLoadMore = () => {
		dispatch(
			fetchStoriesStart({
				// filterType,
				startAfterDoc: queryDoc,
				persistStories: data,
			})
		);
	};
	return (
		<>
			<Home />
			{!isLastPage && (
				<div
					className="load-more"
					onClick={() => handleLoadMore()}
					style={{
						borderRadius: "20px",
						border: "1px solid gray",
						padding: "2px 0 2px 10px",
						marginBottom: "5px",
						width: "150px",
						cursor: "pointer",
					}}>
					Get new stories
				</div>
			)}
		</>
	);
};

export default HomePage;
