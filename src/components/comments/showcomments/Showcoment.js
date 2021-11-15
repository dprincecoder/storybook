import React from "react";
import { Avatar } from "@material-ui/core";
import "./showcomment.scss";
import { formatDate } from "../../../helpers/Helpers";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Showcoment = ({
	profilePic,
	displayName,
	createdDate,
	commentMsg,
	color,
}) => {
	const [hide, setHide] = React.useState(false);
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
				<div className="more-btn" onClick={() => setHide(!hide)}>
					<MoreVertIcon />
				</div>
				{hide && (
					<div className="more-options">
						<ul className="collection">
							<li className="collection-item">Edit</li>
							<li className="collection-item">Delete</li>
							<li className="collection-item">Report</li>
						</ul>
					</div>
				)}
			</div>
			<div className="comment-content">
				<p>{commentMsg} </p>
			</div>
		</div>
	);
};

export default Showcoment;
