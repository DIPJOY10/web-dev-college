import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles({
	root: {
		flex: 1,
		marginTop: "1rem",
	},

	textStyle: {
		wordWrap: "break-word",
		fontWeight: "600",
	},
});

export default function TextView(props) {
	const classes = useStyles();
	const { text, minChar, style } = props;

	return (
		<Typography
			variant="h4"
			align={"center"}
			gutterBottom
			style={style}
			className={classes.textStyle}
		>
			{text}
		</Typography>
	);
}
