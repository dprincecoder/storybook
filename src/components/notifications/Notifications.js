import { Avatar } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { dd } from "../../Dd";
import { formatDate } from "../../helpers/Helpers";
import "./notification.scss";

const Notifications = () => {
	return (
		<div className="row">
			<h4>Notifications</h4>
			<div className="col s12 m12">
				{dd.map((d, i) => (
					<Link to={`/stories/story/${d.documentID}`} key={i}>
						<div
							className={`${
								!d.readNotification
									? "card horizontal blue lighten-4"
									: "card horizontal grey lighten-2"
							}`}>
							<div className="card-image">
								<Avatar src={d.notifyPhoto} alt={d.userThatNotifyName} />
							</div>
							{!d.readNotification && (
								<div id="container">
									<div className="dot"></div>
									<div className="pulse"></div>
								</div>
							)}
							<div>
								<div className="card-stacked">
									<div className="card-content">
										<h6 className={`${d.readNotification ? "read" : ""}`}>
											{d.userThatNotifyName}
										</h6>
										<p className={`${d.readNotification ? "read" : ""}`}>
											<b>{d.notifyAction}</b>
											<span>your</span>
											<b>{d.notifyMethod}</b>
											<b>
												"<i>{d.notifyDetails}</i>"
											</b>
										</p>
									</div>
									<div className={`${d.readNotification ? " read" : ""}`}>
										{formatDate(d.notifyDate)}
									</div>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Notifications;
