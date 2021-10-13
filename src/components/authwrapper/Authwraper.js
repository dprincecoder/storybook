import React from "react";
import "./authWrapper.scss";

const AuthWrapper = ({ headline, children, custom }) => {
    const classes = `${custom}`
	return (
		<div className={classes}>
			<div className="wrap">
				{headline && <h2>{headline}</h2>}
				<div className="divider"></div>
				<div className="children">{children && children}</div>
			</div>
		</div>
	);
};

export default AuthWrapper;
