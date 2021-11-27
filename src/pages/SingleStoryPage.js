import { motion } from "framer-motion";
import React from "react";
import {
	pageStyle,
	pageTransition,
	pageVariants,
} from "../components/animation/PageAnimations";
import SingleStory from "../components/singleStory/SingleStory";

const SingleStoryPage = () => {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}>
			<SingleStory />
		</motion.div>
	);
};

export default SingleStoryPage;
