import React from "react";
import AddStory from "../components/addStory/AddStory";
import { motion } from "framer-motion";
import {
	pageStyle,
	pageTransition,
	pageVariants,
} from "../components/animation/PageAnimations";

const AddStoryPage = () => {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}>
			<AddStory />
		</motion.div>
	);
};

export default AddStoryPage;
