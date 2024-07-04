import { Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";

function HeadingPrimary({ text, styleBody }) {
	return (
		<div data-aos={"flip-up"} data-aos-once={false}>
			<Typography style={styleBody && styleBody} className="paddingLeft">
				{text}
			</Typography>
		</div>
	);
}

export default HeadingPrimary;
