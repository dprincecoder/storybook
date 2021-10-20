import { motion } from "framer-motion";
import React from "react";
import {
	pageTransition,
	pageVariants,
} from "../components/animation/PageAnimations";

const VideoPage = () => {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}>
			<h4>Page under Construction...</h4>
		</motion.div>
	);
};

export default VideoPage;
