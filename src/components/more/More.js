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

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		marginTop: "2rem",
		width: "100%",
	},
	list: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		margin: "10px",
		width: "100%",
		border: "1px solid #ccc",
	},
	item: {
		margin: "10px",
		textDecoration: "none",
		backgroundColor: "#f4f4f4",
		padding: "10px",
		width: "fit-content",
	},
};
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
			<div style={styles.container}>
				<ul style={styles.list}>
					<li style={styles.item}>
						{" "}
						<Link to="/users/user/welcome">About Us</Link>
					</li>
					<li style={styles.item}>
						{" "}
						<Link to="/users/user/welcome">Contact Us</Link>
					</li>
					<li style={styles.item}>
						{" "}
						<Link to="/users/user/welcome">Privacy Policy</Link>
					</li>
					<div style={styles.item}>
						<Button onClick={handleLogout} custom=" red">
							LOG Out
						</Button>
					</div>
				</ul>
			</div>
		</div>
	);
};

export default More;
