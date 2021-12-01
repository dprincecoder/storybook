import React from "react";
import "./wrapper.scss";
const Wrapper = ({ children, badgeContent }) => {
	let badgeValue;
	if (badgeContent > 9) {
		badgeValue = `${9}+`;
	} else if (badgeContent < 10) {
		badgeValue = badgeContent;
	}
	return (
		<div>
			{badgeContent > 0 && <div className="badge-count">{badgeValue}</div>}
			{children}
		</div>
	);
};

export default Wrapper;
