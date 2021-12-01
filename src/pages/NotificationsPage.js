import { motion } from "framer-motion";
import React from "react";
import {
	pageStyle,
	pageTransition,
	pageVariants,
} from "../components/animation/PageAnimations";
import Notifications from "../components/notifications/Notifications";

const VideoPage = () => {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}>
			<Notifications />
			{/* page under construction */}
		</motion.div>
	);
};

export default VideoPage;
