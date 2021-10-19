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

const mapState = ({ user, storiesData }) => ({
	currentUser: user.currentUser,
	stories: storiesData.stories,
});
const UserStory = () => {
	const { stories, currentUser } = useSelector(mapState);
	const { data, isLastPage, queryDoc, filterType } = stories;
	const dispatch = useDispatch();
	const { userId } = currentUser;
	useEffect(() => {
		dispatch(
			// fetchUserStoriesStart({
			// 	userId,
			// 	filterType,
			// 	startAfterDoc: queryDoc,
			// 	persistStories: data,
			// })
			fetchUserStoriesStart(userId)
		);

		return () => {
			dispatch(setStory({}));
		};
	}, []);

	const handleLoadMore = () => {
		dispatch(
			fetchUserStoriesStart({
				userId,
				// filterType,
				startAfterDoc: queryDoc,
				persistStories: data,
			})
		);
	};
	return (
		<div className="row">
			<h5 style={{ textAlign: "center" }}>All Your Stories</h5>
			{!data || data.length < 1 ? (
				<h6>
					oh no :) <br /> Yours stories not found or slow internet connection,
					why not share your beautiful story this won't take long, to be
					published.
				</h6>
			) : (
				<>
					{data.map((story, index) => {
						const configStory = {
							...story,
						};
						return <Story key={index} {...configStory} />;
					})}
					<div>
						{!isLastPage && (
							<h6
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
							</h6>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default UserStory;
