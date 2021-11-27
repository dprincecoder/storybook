import { motion } from "framer-motion";
import React from "react";
import {
	pageStyle,
	pageTransition,
	pageVariants,
} from "../components/animation/PageAnimations";
import Dashboard from "../components/dashboard/Dashboard";

const DashboardPage = () => {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}>
			<Dashboard />
		</motion.div>
	);
};

export default DashboardPage;
