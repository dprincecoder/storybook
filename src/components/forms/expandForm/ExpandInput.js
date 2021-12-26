import React from "react";
import "./expand.scss";

const ExpandInput = React.forwardRef((props, ref) => {
	const expandTextareaInput = ({ target: e }) => {
		// make sure the input event originated from a textarea and it's desired to be auto-expandable
		if (!e.classList.contains("text-expand") || !e.nodeName == "TEXTAREA")
			return;

		let minRows = e.getAttribute("data-min-rows") | 0,
			rows;
		!e._baseScrollHeight && getScrollHeight(e);

		e.rows = minRows;
		rows = Math.ceil((e.scrollHeight - e._baseScrollHeight) / 16);
		e.rows = minRows + rows;
	};
	const getScrollHeight = (e) => {
		let savedValue = e.value;
		e.value = "";
		e._baseScrollHeight = e.scrollHeight;
		e.value = savedValue;
	};
	return (
		<textarea
			ref={ref}
			className="text-expand"
			data-min-rows="3"
			onChange={expandTextareaInput}
			{...props}></textarea>
	);
});

export default ExpandInput;
