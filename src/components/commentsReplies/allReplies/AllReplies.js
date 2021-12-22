import { Avatar } from "@material-ui/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DB from "../../../firebase/functions";
import { formatDate } from "../../../helpers/Helpers";
import "./allreplies.scss";
const mapState = ({ user }) => ({
	userData: user.userData,
});

const MainReply = ({
	profilePic,
	displayName,
	userThatReplyId,
	createdDate,
	repliesMsg,
	color,
	replyId,
}) => {
	const [hide, setHide] = React.useState(false);
	const { userData } = useSelector(mapState);
	const { userId } = userData;

	const deleteReply = () => {
		DB.collection("replies").doc(replyId).delete();
	};
	return (
		<div className="he">
			<Link to={`/users/user/${userThatReplyId}/profile`}>
				<Avatar src={profilePic} className="main-header-avatar" />
			</Link>
			<div className="main-header">
				<div className="main-header-name">
					<ul className="main-header-list">
						<Link
							to={`/users/user/${userThatReplyId}/profile`}
							className="name"
							style={{ color: color }}>
							{displayName}
						</Link>
						<li>{formatDate(createdDate)}</li>
					</ul>
					<div className="more-btn" onClick={() => setHide(!hide)}>
						<MoreVertIcon />
					</div>
				</div>
				{hide && (
					<div className="more-options">
						<ul className="collection">
							{userId === userThatReplyId ? (
								<>
									<li className="collection-item">Edit</li>
									<li className="collection-item" onClick={deleteReply}>
										Delete
									</li>
								</>
							) : (
								<li className="collection-item">Report</li>
							)}
						</ul>
					</div>
				)}
				<div className="all-main-content">{repliesMsg}</div>
			</div>
		</div>
	);
};

export default MainReply;
