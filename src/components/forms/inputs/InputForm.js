import React from "react";
import "./inputForm.scss";
const InputForm = ({ handleChange, label, ...otherProps }) => {
	return (
		<div className="formRow">
			{label && <label> {label} </label>}

			<input className="formInput" onChange={handleChange} {...otherProps} />
		</div>
	);
};

export default InputForm;
