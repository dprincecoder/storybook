import { motion } from "framer-motion";
import React from "react";
import {
	pageStyle,
	pageTransition,
	pageVariants,
} from "../components/animation/PageAnimations";
import UserStory from "../components/userStory/UserStory";

const UserStoryPage = () => {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}>
			<UserStory />
		</motion.div>
	);
};

export default UserStoryPage;
