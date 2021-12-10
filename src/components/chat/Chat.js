import React from "react";
import "./chat.scss";
import Avatar from "@material-ui/core/Avatar";
import { useHistory } from "react-router-dom";
import InputForm from "../../components/forms/inputs/InputForm";
import Button from "../../components/forms/button/Button";

const Chat = () => {
	const history = useHistory();
	const divRef = React.useRef();
	let isUser = "jaya";
	const messages = [
		{ name: "jaya", message: "yoo" },
		{ name: "john", message: "sup babe" },
		{ name: "jaya", message: "yoo" },
		{ name: "john", message: "alright" },
		{ name: "jaya", message: "fine oh" },
		{ name: "john", message: "lorem jatjakgiankmlkvijrykkjhushrui" },
		{ name: "jaya", message: "yoo" },
		{ name: "john", message: "sup babe" },
		{ name: "jaya", message: "yoo" },
		{ name: "john", message: "alright" },
		{ name: "jaya", message: "fine oh" },
		{ name: "john", message: "lorem jatjakgiankmlkvijrykkjhushrui" },
	];
	const scrollInToView = () =>
		divRef.current?.scrollIntoView({ behavior: "smooth" });
	React.useEffect(() => {
		scrollInToView();
		return () => scrollInToView();
	}, []);
	return (
		<div className="chat-container">
			<div className="col s12 m12">
				<div className="chat-header">
					<div className="chat-header-left">
						<div className="back-arrow" onClick={() => history.goBack()}>
							<i className="material-icons">arrow_back</i>
						</div>
						<div className="user-info">
							<div className="user-info-img">
								<Avatar
									src="https://www.w3schools.com/howto/img_avatar.png"
									alt=""
								/>
							</div>
							<div className="user-info-details">
								<h5>Dprincecoder</h5>
								<p>Online</p>
							</div>
						</div>
					</div>
					<div className="chat-header-right">
						<div className="right-gear">
							<i className="material-icons">more_vert</i>
						</div>
					</div>
				</div>
				<div className="divider"></div>
				<div className="chat-body">
					<div className={`chat-body-center`}>
						{messages.map((i) => (
							<>
								<div
									className={`${isUser === i.name ? "my-chat" : "other-chat"}`}>
									{<p>{i.message}</p>}
								</div>
								<div className="time-date">2 hours ago</div>
							</>
						))}
					</div>
					<div className="chat-body-bottom">
						<InputForm type="text" placeholder="Type..." />
						<Button type="submit" className="submit-btn">
							<i className="material-icons">send</i>
							<b style={{ dislay: "none" }} ref={divRef} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chat;
