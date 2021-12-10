import React from "react";
import Avatar from "@material-ui/core/Avatar";
import "./chats.scss";
import { formatDate, shortenMsgText } from "../../helpers/Helpers";
import { Link } from "react-router-dom";
const Chat = () => {
	let tt =
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ipsam ipsa ipsum quos asperiores velit ea cumque eum, aperiam minus eveniet. Nisi, temporibus qui. Aperiam veniam animi cum magnam modi. Maiores eveniet sapiente iste commodi, impedit eum error soluta debitis at ea aspernatur, fugit hic quidem ipsum perspiciatis excepturi sed";
	return (
		<div className="row">
			<div className="s12 m12">
				<div className="msg-main">
					<div className="msg-main-header">
						<h4>Messages</h4>
					</div>
					<div className="msg-search">
						<input
							type="text"
							className="search"
							placeholder="Search Messages"
						/>
						<i className="material-icons">search</i>
					</div>
				</div>
				<div className="divider"></div>
				<div className="msg-body">
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
						<Link to="/users/chats/123" className="col s12 m12" key={item}>
							<div className="card-body">
								<div className="msg-left">
									<Avatar />
								</div>
								<div className="msg-right">
									<div className="msg-center-top">
										<h4>Dprincecoder</h4>
										<div className="msg-center-content">
											{shortenMsgText(tt, 50)}
										</div>
									</div>
									<div className="msg-right-end">
										<div className="msg-right-time">2 hours ago</div>
										<p className="status">
											<i className="material-icons circle">done</i>
										</p>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Chat;
