import React from "react";
import { Avatar } from "@material-ui/core";
import "./showcomment.scss";
import { formatDate } from "../../../helpers/Helpers";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

const Showcoment = ({
	profilePic,
	displayName,
	createdDate,
	commentMsg,
	color,
}) => {
	return (
		<div className="show-a-comment">
			<div className="comment-header">
				<Avatar src={profilePic} className="comment-header-avatar" />
				<div className="comment-header-name">
					<ul>
						<li className="name" style={{ color: color }}>
							{displayName}
						</li>
						<li>{formatDate(createdDate)}</li>
					</ul>
				</div>
				<div className="more-btn">{/* <MoreVertIcon /> */}</div>
			</div>
			<div className="comment-content">
				<p>{commentMsg} </p>
			</div>
		</div>
	);
};

export default Showcoment;
