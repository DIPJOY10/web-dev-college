import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		display: "flex",
		"& > *": {
			// margin: theme.spacing(1),
		},
	},
	contentStyle: {
		[theme.breakpoints.only("xs")]: {
			marginLeft: "0.5rem",
			marginRight: "0.5rem",
		},
	},
}));

export default function Basic(props) {
	const classes = useStyles();
	const matches = useMediaQuery("(max-width:1300px)");

	return (
		<div className={classes.root}>
			<Grid container>
				<Grid item xs={false} sm={1} md={1}></Grid>
				<Grid
					item
					xs={12}
					sm={10}
					md={10}
					className={classes.contentStyle + " page-content"}
				>
					{props.children}
				</Grid>
				<Grid item xs={false} sm={1} md={1}></Grid>
			</Grid>
		</div>
	);
}
