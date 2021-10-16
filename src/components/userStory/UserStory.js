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

const mapState = ({ storiesData }) => ({
	stories: storiesData.stories,
});
const UserStory = () => {
	const { stories } = useSelector(mapState);
	const { data, isLastPage, queryDoc, filterType } = stories;
	const dispatch = useDispatch();
	const { userId } = useParams();
	useEffect(() => {
		dispatch(fetchUserStoriesStart(userId));

		return () => {
			dispatch(setStory({}));
		};
	}, []);

	const handleLoadMore = () => {
		dispatch(
			fetchUserStoriesStart({
				userId,
				filterType,
				startAfterDoc: queryDoc,
				persistStories: data,
			})
		);
	};
	return (
		<div className="row">
			<h5 style={{ textAlign: "center" }}>All Your Stories</h5>
			{!data || data.length < 1 ? (
				<IsLoadingSkeleton />
			) : (
				data.map((story, index) => {
					const configStory = {
						...story,
					};
					return <Story key={index} {...configStory} />;
				})
			)}
			{!isLastPage && (
				<h7
					className="load-more"
					onClick={() => handleLoadMore()}
					style={{
						borderRadius: "20px",
						padding: "2px 0 10px 10px",
						marginBottom: "10px",
						width: "150px",
						height: "2rem",
						cursor: "pointer",
						textAlign: "center",
					}}>
					Get More stories
				</h7>
			)}
		</div>
	);
};

export default UserStory;
