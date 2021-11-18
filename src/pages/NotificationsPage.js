import { motion } from "framer-motion";
import React from "react";
import {
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
		</motion.div>
	);
};

export default VideoPage;
