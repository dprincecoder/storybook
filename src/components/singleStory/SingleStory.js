import { Avatar } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import usrA from "./PhotoGrid_Plus_1605606730565.png";
import storyImg from "./wal42.jpeg";
import "./single.scss";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const SingleStory = () => {
	const liked = true;
	return (
		<div className="row">
			<div className="col s12 m12">
				<div className="card">
					<div className="usrChip">
						<Avatar src={usrA} alt="" />
						<div className="userChipOptions">
							<ul>
								<li>
									<Link to="/user/233">prince</Link>
								</li>
								<li className="late">2 min ago</li>
							</ul>
						</div>
					</div>
					<div className="divider"></div>
					<div className="card-content">
							<h4>story Title</h4>
							<div className="divider"></div>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi veniam eligendi mollitia rem, laborum quam ab odio sequi temporibus earum a id illo harum explicabo nobis cum corrupti quod consequuntur maiores quae possimus consequatur. Expedita, nemo repudiandae rem excepturi voluptas sint quisquam facere deserunt cumque adipisci velit itaque quia temporibus modi recusandae perspiciatis quae provident dignissimos reiciendis? Distinctio commodi debitis adipisci error molestiae eum veritatis blanditiis itaque animi esse, maxime aut excepturi officiis, quam corrupti ea quaerat porro amet provident laboriosam quae, dolorum perferendis! Numquam illum, eaque dolores, ipsam eum fugiat, impedit quis molestiae explicabo doloribus architecto fugit? Asperiores, sunt!
							<div className="divider"></div>
                            {[1, 2,].map((a) => (
                                
							<div className="card-image" key={a}>
								<img src={storyImg} alt="story " />
							</div>
                            ))}
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

export default SingleStory;
