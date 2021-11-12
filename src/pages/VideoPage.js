import { motion } from "framer-motion";
import React from "react";
import {
	pageTransition,
	pageVariants,
} from "../components/animation/PageAnimations";
import Videos from "../components/videos/Videos";

const VideoPage = () => {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}>
			{/* <Videos /> */}
			<h4>Page under construction</h4>
		</motion.div>
	);
};

export default VideoPage;
