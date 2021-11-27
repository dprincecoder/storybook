import React from "react";
import Home from "../components/home/Home";
import { motion } from "framer-motion";
import {
	pageStyle,
	pageTransition,
	pageVariants,
} from "../components/animation/PageAnimations";

const HomePage = () => {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}>
			<Home />
		</motion.div>
	);
};

export default HomePage;
