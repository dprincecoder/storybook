import React from "react";
import "./isLoading.scss";

const IsLoadingSkeleton = () => {
	return (
		<div className="roe">
			<div className="col s12 m12">
				<div className="cardtop">
					<div className="topcard">
						<div className="chipimg"></div>
						<div className="top">
							<div className="name"></div>
							<div className="time"></div>
						</div>
					</div>
				</div>
				<div className="card-content">
					<div className="longest"></div>
					<div className="longer"></div>
					<div className="long"></div>
					<div className="short"></div>
					<div className="image"></div>
				</div>
			</div>
		</div>
	);
};

export default IsLoadingSkeleton;
