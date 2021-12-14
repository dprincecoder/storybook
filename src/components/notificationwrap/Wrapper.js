import React from "react";
import "./wrapper.scss";
const BadgeWrapper = ({ children, badgeContent }) => {
	let badgeValue;
	if (badgeContent > 9) {
		badgeValue = `${9}+`;
	} else if (badgeContent < 10) {
		badgeValue = badgeContent;
	}
	return (
		<>
			{badgeContent > 0 && <div className="badge-count">{badgeValue}</div>}
			{children}
		</>
	);
};

export default BadgeWrapper;
