import React from "react";
import Editor from "./quill/editor";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, InputBase, Paper, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	row: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
	},
	col: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
	text: {
		fontSize: "20px",
		fontWeight: "500",
	},
	titleInput: {
		border: `1px solid gray`,
		backgroundColor: "white",
		color: "#424242",
		borderRadius: ".3rem",
		fontSize: 15,
		'&:focus': {
			border: `1.2px solid ${theme.palette.primary.main}`,
		}
	},
	paper: {
		backgroundColor: "#fafafa",
		boxShadow: "none",
		[theme.breakpoints.down("xs")]: {
			width: "100%",
		},
		borderRadius: "15px",
	},
}));

function TitleInput(props) {
	const classes = useStyles();

	const { title, setTitle, placeholder, type, isMobile } = props;

	return (
		<div className={isMobile ? classes.col : classes.row}>
			<Typography className={classes.text}>Title</Typography>

			{type === "Job" || "Investment" ? (
				<Paper className={classes.paper}>
					<InputBase
						multiline={true}
						rowsMax={5}
						value={title}
						placeholder={placeholder}
						onChange={(event) => setTitle(event.target.value)}
						variant="outlined"
						style={{ padding: ".7rem" }}
						fullWidth
						className={classes.titleInput}
					/>
				</Paper>
			) : null}
		</div>
	);
}

export default TitleInput;
