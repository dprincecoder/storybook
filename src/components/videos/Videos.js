import React from "react";
import DB from "../../firebase/functions";
import Video from "./video/Video";

const Videos = () => {
	const [videos, setVideos] = React.useState([]);

	React.useEffect(() => {
		DB.collection("videos")
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				setVideos(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						videoID: doc.id,
					}))
				);
			});
	}, []);
	return (
		<div className="row">
			{videos.map((video, videoID) => {
				const configVideo = {
					...video,
				};
				return <Video key={videoID} {...configVideo} />;
			})}
		</div>
	);
};

export default Videos;
