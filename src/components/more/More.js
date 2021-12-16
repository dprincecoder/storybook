import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DB from "../../firebase/functions";
import { signOutUserStart } from "../../redux/user/user.action";
import Button from "../forms/button/Button";
import { Link } from "react-router-dom";

const mapState = ({ user }) => ({
	currentUser: user.currentUser,
	userData: user.userData,
});
const More = () => {
	const dispatch = useDispatch();
	const { currentUser, userData } = useSelector(mapState);
	const { uid } = currentUser;
	const { userId } = userData;
	const d = userId || uid;
	const handleLogout = () => {
		dispatch(signOutUserStart());
		DB.collection("users").doc(d).update({
			activeStatus: "offline",
		});
	};
	return (
		<div>
			<div className="more-options">
				<ul className="list">
					<li className="item">
						<Link to="/users/user/welcome">About Us</Link>
					</li>
					<li className="item">
						<Link to="/users/user/welcome">Contact Us</Link>
					</li>
					<li className="item">
						<Link to="/users/user/welcome">Privacy Policy</Link>
					</li>
					<div className="signout">
						<Button onClick={handleLogout} custom=" red">
							LOG Out
						</Button>
					</div>
				</ul>
				<div className="arrown-open-and-close">
					<div className="arrow-open">
						<i className="material-icons">keyboard_arrow_down</i>
					</div>
					<div className="arrow-close">
						<i className="material-icons">keyboard_arrow_up</i>
					</div>
				</div>
			</div>
		</div>
	);
};

export default More;
