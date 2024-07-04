import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";

import cx from "clsx";
import { InputBase } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	inputPaper: {
		padding: "2px 4px",
		display: "flex",
		alignItems: "center",
		// width: '17.5rem',
		margin: "0rem 1rem 1rem 1rem",
		borderRadius: 5,
		padding: "0.45rem 0.30rem",
		[theme.breakpoints.down("sm")]: {
			width: "14rem",
		},
		[theme.breakpoints.down("xs")]: {
			width: "11rem",
			padding: 0,
		},
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
}));

export default function SearchBar(props) {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();

	const { text, setText, placeholder } = props;

	const { root, row, col } = classes;

	const onKeyDown = (event) => {
		if (event.key === "Enter") {
			// onSearchClose();
		}
	};

	return (
		<Paper className={classes.inputPaper}>
			<InputBase
				className={classes.input}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
				value={text}
				onChange={(event) => setText(event.target.value)}
			/>
		</Paper>
	);
}
