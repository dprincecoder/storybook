import { Avatar } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import usrA from "./PhotoGrid_Plus_1605606730565.png";
import storyImg from "./wal42.jpeg";
import "./userstory.scss";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { shortenText } from "../../helpers/Helpers";

const Home = () => {
	const liked = true;
	return (
		<div className="row">
            <div className="col s12 m12">
                <h5>
                    All Your Stories.
                </h5>
				<div className="card">
					<div className="usrChip">
						<Avatar src={usrA} alt="" />
						<div className="userChipOptions">
							<ul>
								<li>
									<Link to="/stories/user/">prince</Link>
								</li>
								<li className="late">2 min ago</li>
							</ul>
						</div>
					</div>
					<div className="divider"></div>
					<div className="card-content">
						<Link to="/stories/story/123">
							<h4>story Title</h4>
							<div className="divider"></div>
							{shortenText(
								"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo possimus maxime quasi quas reprehenderit officiis, fugit natus magni doloremque error at nulla nihil perferendis placeat vel! Similique dignissimos laboriosam incidunt soluta in rem ab quaerat obcaecati non impedit, molestias fuga velit animi aspernatur nobis suscipit temporibus consequuntur laudantium nemo illo.",
								200
							)}
							<div className="divider"></div>
							<div className="card-image">
								<img src={storyImg} alt="story " />
							</div>
						</Link>
						<div className="divider"></div>
						<div className="optionsCount">
							<div className="btn blue">0 Likes</div>
							<div className="btn blue">0 Comments</div>
						</div>
						<div className="divider"></div>
						<div className="options">
							<div className="like">
								{liked ? (
									<ThumbUpIcon className="liked" />
								) : (
									<ThumbUpAltOutlinedIcon />
								)}
							</div>
							<div className="snapIcon">Snap Share</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
