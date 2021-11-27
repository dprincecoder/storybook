import { motion } from "framer-motion";
import React from "react";
import {
	pageStyle,
	pageTransition,
	pageVariants,
} from "../components/animation/PageAnimations";
import Login from "../components/login/Login";
const LoginPage = () => {
	return (
		<motion.div
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}>
			<Login />
		</motion.div>
	);
};

export default LoginPage;
