import { Avatar } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import usrA from "./PhotoGrid_Plus_1605606730565.png";
import storyImg from "./wal42.jpeg";
import "./home.scss";
import { shortenText } from "../../helpers/Helpers";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoriesStart } from "../../redux/story/story.action";
import HomeStory from "./homeStory/HomeStory";
import IsLoadingSkeleton from "../loading/IsLoadingSkeleton";
import { fetchUserDataStart, setUserData } from "../../redux/user/user.action";

const mapState = ({ storiesData }) => ({
	stories: storiesData.stories,
});
const Home = () => {
	const { stories } = useSelector(mapState);
	const { data, isLastPage, queryDoc } = stories;

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchStoriesStart());
	}, []);

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
