import React from "react";
import Button from "./Button";
const LoadMore = ({ onLoadMoreEvt = () => {} }) => {
	return (
		<Button custom="blue" onClick={() => onLoadMoreEvt()}>
			Get More Stories...
		</Button>
	);
};

export default LoadMore;
