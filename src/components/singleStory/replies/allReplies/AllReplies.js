import React from "react";
import { Avatar } from "@material-ui/core";
import "./allreplies.scss";
import { formatDate } from "../../../../helpers/Helpers";

const MainReply = ({
	profilePic,
	displayName,
	createdDate,
	repliesMsg,
	color,
}) => {
	return (
		<div className="show-main">
			<div className="main-header">
				<Avatar src={profilePic} className="main-header-avatar" />
				<div className="main-header-name">
					<ul>
						<li className="name" style={{ color: color }}>
							{displayName}
						</li>
						<li>{formatDate(createdDate)}</li>
					</ul>
				</div>
			</div>
			<div className="main-content">
				<p>{repliesMsg} </p>
			</div>
		</div>
	);
};

export default MainReply;
