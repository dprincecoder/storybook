import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../forms/button/Button";
const searchTags = [
	{
		name: "Action Movies",
		id: "UClVbhSLxwws-KSsPKz135bw",
	},
	{
		name: "80's Greatest Music",
		id: "UCjVf2FirkZsEW8LN6nZcnog",
	},
	{
		name: "Tom and Jerry Movies",
		id: "UC9trsD1jCTXXtN3xIOIU8gg",
	},
	{
		name: "Nollywood Movies",
		id: "UCFcywd_mLGYXxNyz0VcGTzw",
	},
	{
		name: "Bollywood Movies",
		id: "UC0PKLLmL8pIJLjOI1gBH_pA",
	},
	{
		name: "Hollywood Movies",
		id: "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
	},
	{
		name: "Star Wars Movies",
		id: "UCZGYJFUizSax-yElQaFDp5Q",
	},
	{
		name: "Marvel Movies",
		id: "UCvC4D8onUfXzvjTOM-dBfEA",
	},
	{
		name: "DC Movies",
		id: "UCiifkYAs_bq1pt_zbNAzYGg",
	},

	{
		name: "Horror Movies",
		id: "UCpJ6Dn01AqjvFVN2EiK72Ag",
	},
];
const Videos = () => {
	const [videos, setVideos] = useState([]);
	const [selectedTag, setSelectedTag] = useState(searchTags[0]);
	const [selectedVideo, setSelectedVideo] = useState(
		"UClVbhSLxwws-KSsPKz135bw"
	);
	const fetchYTCHannelVideos = async () => {
		const res = await axios.get(`
			https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_YOUTUBE_API_KEY}&channelId=${selectedVideo}&part=snippet,id&order=date&maxResults=50`);
		return res;
	};

	useEffect(() => {
		fetchYTCHannelVideos().then((res) => {
			setVideos(res.data.items);
		});
	}, [selectedVideo]);

	const selectMovie = (tag) => {
		setSelectedTag(tag);
		setSelectedVideo(tag.id);
		fetchYTCHannelVideos();
		console.log(tag);
	};

	return (
		<div>
			<h4>Videos</h4>
			<div className="row">
				<div className="tags">
					{searchTags.map((tag) => (
						<Button
							style={{ margin: "5px" }}
							key={tag.id}
							custom={selectedTag.id === tag.id ? "selected" : "blue"}
							onClick={() => selectMovie(tag)}>
							{" "}
							{tag.name}
						</Button>
					))}
				</div>
				<div className="divider"></div>
				<div className="videos">
					{videos.map((video) => (
						<div key={video.id.videoId}>
							<div className="video-title">
								<p>{video.snippet.title}</p>
							</div>
							<div className="col-md-4" key={video.id.videoId}>
								<iframe
									title=""
									width="100%"
									height="400px"
									src={`https://www.youtube.com/embed/${video.id.videoId}`}
									frameBorder="0"
									allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen></iframe>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Videos;
