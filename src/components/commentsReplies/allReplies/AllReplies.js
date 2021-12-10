import React from "react";
import { Avatar } from "@material-ui/core";
import "./allreplies.scss";
import { formatDate, detectLinks } from "../../../helpers/Helpers";
import _ from "lodash";

const MainReply = ({
	profilePic,
	displayName,
	createdDate,
	repliesMsg,
	color,
}) => {
	const divRef = React.useRef();
	React.useEffect(() => {
		divRef.current.innerHTML = detectLinks(repliesMsg);
		return () => {
			divRef.current.innerHTML = "";
		};
	}, []);
	return (
		<div className="he">
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
			<div className="main-content" ref={divRef}></div>
		</div>
	);
};

export default MainReply;
