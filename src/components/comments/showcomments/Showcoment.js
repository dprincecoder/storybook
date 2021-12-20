import React from "react";
import { Avatar } from "@material-ui/core";
import "./showcomment.scss";
import { formatDate } from "../../../helpers/Helpers";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DB from "../../../firebase/functions";
const mapState = ({ user }) => ({
	userData: user.userData,
});

const Showcoment = ({
	profilePic,
	displayName,
	createdDate,
	commentMsg,
	userThatCommentId,
	color,
	commentId,
}) => {
	const [hide, setHide] = React.useState(false);
	const { userData } = useSelector(mapState);
	const { userId } = userData;
	const deleteComment = () => {
		DB.collection("comments").doc(commentId).delete();
	};

	return (
		<div className="show-a-comment">
			<div className="comment-header">
				<Link to={`/users/user/${userThatCommentId}/profile`}>
					<Avatar src={profilePic} className="comment-header-avatar" />
				</Link>
				<div className="comment-header-name">
					<ul>
						<Link
							to={`/users/user/${userThatCommentId}/profile`}
							className="name"
							style={{ color: color }}>
							{displayName}
						</Link>
						<li>{formatDate(createdDate)}</li>
					</ul>
				</div>
				<div className="more-btn" onClick={() => setHide(!hide)}>
					<MoreVertIcon />
				</div>
				{hide && (
					<div className="more-options">
						<ul className="collection">
							{userId === userThatCommentId && (
								<li className="collection-item">Edit</li>
							)}
							{userId === userThatCommentId && (
								<li className="collection-item" onClick={deleteComment}>
									Delete
								</li>
							)}
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
