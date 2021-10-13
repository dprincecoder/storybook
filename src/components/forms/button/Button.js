import React from "react";
import "./button.scss";
const Button = ({ children, custom, ...otherProps }) => {
    const classes = `btn ${custom}`
	return (
		<button className={classes} {...otherProps}>
			{children}
		</button>
	);
};

export default Button;
