import React from "react";
import { Avatar } from "@material-ui/core";
import "./replies.scss";
import { formatDate } from "../../../helpers/Helpers";

const MainReply = ({
	profilePic,
	displayName,
	createdDate,
	repliesMsg,
	color,
}) => {
	return (
		<div className="main-reply-container">
			<Avatar src={profilePic} className="main-reply-header-avatar" />
			<div className="main-reply-header">
				<div className="main-reply-header-name">
					<ul className="main-reply-header-list">
						<li className="name" style={{ color: color }}>
							{displayName}
						</li>
						<li>{formatDate(createdDate)}</li>
					</ul>
				</div>
				<div className="main-reply-content">
					<p>{repliesMsg} </p>
				</div>
			</div>
		</div>
	);
};

export default MainReply;
