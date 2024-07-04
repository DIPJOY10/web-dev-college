import React from "react";
import Editor from "./quill/editor";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, InputBase, Paper, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	row: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		// border: '1px solid red',
		// alignItems: "center",
		// justifyContent: "space-between",
	},
	col: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		margin: "0rem 1rem",
	},
	titleInput: {
		// maxWidth: "34rem",
		// width: "100%",
		// borderWidth: "1px",
		// border: "1px solid grey",
		// backgroundColor: "white",
		// color: "#424242",
		// borderRadius: "0",
		// padding: "0.7 rem",
		fontSize: 19,
	},

	paper: {
		backgroundColor: "#fafafa",
		boxShadow: "none",
		margin: "1rem",
		// width: '70%',
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			// border: '1px solid red'
		},
		borderRadius: "2vw",
	},
}));

function CustomTitleInput(props) {
	const classes = useStyles();

	const { title, setTitle, placeholder, type, isMobile, text } = props;

	return (
		<div className={isMobile ? classes.col : classes.row}>
			<Typography className={classes.text}>{text}</Typography>

			{/* {type === "Job" || "Investment" ? (
				<Paper className={classes.paper}>
					<InputBase
						multiline={true}
						rowsMax={6}
						value={title}
						placeholder={placeholder}
						onChange={(event) => setTitle(event.target.value)}
						variant="outlined"
						style={{ padding: "1rem" }}
						fullWidth
						className={classes.titleInput}
					/>
				</Paper>
			) : null} */}
              <TextField
                id="fullName"
                // label="Name "
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                margin="dense"
                variant="outlined"
                fullWidth
                style={{ padding: "1rem" }}
                className={classes.titleInput}
                placeholder={placeholder}
				type={type}
              />

		</div>
	);
}

export default CustomTitleInput;
