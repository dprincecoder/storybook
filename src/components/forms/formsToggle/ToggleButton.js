import React from 'react';
import "./toggle.css"

const ToggleButton = ({ handleChange, ...otherProps}) => {
    return (
			<label className="toggle">
				<input type="checkbox" onChange={handleChange} {...otherProps} />
                <span className="slider"/>
			</label>
		);
}

export default ToggleButton
