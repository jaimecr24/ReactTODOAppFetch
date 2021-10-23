import React, { useState } from "react";
import PropTypes from "prop-types";

const Task = props => {
	const [bVisible, setVisible] = useState(false);

	return (
		<div
			className="row"
			onMouseOver={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}>
			<div className="col-auto me-auto">{props.strItem}</div>
			<div
				className={`col-auto ${bVisible ? "visible" : "invisible"}`}
				onClick={() => props.fDelete()}>
				<a href="#">X</a>
			</div>
		</div>
	);
};

Task.propTypes = {
	strItem: PropTypes.string,
	fDelete: PropTypes.func
};

export default Task;
