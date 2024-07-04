import React from "react";
import Editor from "./quill/editor";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, InputBase, Paper } from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import MentionInput from "./mention.input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./reactquill.css";
import CustomToolbar from "./CustomToolbar";

const useStyles = makeStyles((theme) => ({

	row: {
		display: "flex",
		width: "100%",
		flexDirection: "column"
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
	descriptionInput: {
		width: "50%",
		minHeight: "7rem",
		borderWidth: "1px",
		backgroundColor: "white",
		color: "#424242",
		borderRadius: "0",
		padding: "0.7rem",
		fontSize: 16,
	},

	paper: {
		backgroundColor: "#BFEAF5",
		boxShadow: "none",
		margin: "1rem",
		toolbar: {
			color: 'white'
		}
	},

}));

function DescriptionInput(props) {
	const classes = useStyles();

	const {
		description,
		setDescription,
		placeholder,
		isMobile,
		NoTitle = false, // if you dont want description title and just the quill box then send this true.
		...other
	} = props;
	const modules = {
		toolbar: [
			[{ header: "1" }, { header: "2" }, { font: [] }],
			// [{ size: [] }],
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			["bold", "italic", "underline", "strike", "blockquote"],
			[
				{ list: "ordered" },
				{ list: "bullet" },
				{ indent: "-1" },
				{ indent: "+1" },
			],
			["link"],

			// custom button values
			[{ script: "sub" }, { script: "super" }], // superscript/subscript

			[{ color: [] }, { background: [] }], // dropdown with defaults from theme
			["clean"],
		],
		clipboard: {
			// toggle to add extra line breaks when pasting HTML:
			matchVisual: false,
		},
	};
	/*
	 * Quill editor formats
	 * See https://quilljs.com/docs/formats/
	 */
	const formats = [
		"header",
		"font",
		"size",
		"bold",
		"italic",
		"underline",
		"strike",
		"blockquote",
		"list",
		"bullet",
		"indent",
		"link",
		"script",
		"color",
		"background",
	];

	return (
		<div className={classes.root}>
			<div className={isMobile ? classes.col : classes.row}>
				{NoTitle ? null : (
					<Typography className={classes.text}>
						Description
					</Typography>
				)}
				{/* <InputBase
					multiline={true}
					rowsMax={6}
					value={description}
					placeholder={placeholder || "Description"}
					onChange={(event) => setDescription(event.target.value)}
					className={classes.descriptionInput}
				/> */}
				{/* <MentionInput
					value={description}
					placeholder={placeholder || "Description"}
					multiline
					onChange={(event) => setDescription(event.target.value)}
					setValue={setDescription}
					styleBody={{
						root: {
							// padding: "20px",
							maxWidth: "100%",
							width: "95vw",
							backgroundColor: "white",
							height: "40vh",
						},
						control: {
							maxWidth: "100%",
							width: "95vw",
							minHeight: "7rem",
							borderWidth: "1px",
							color: "#424242",
							borderRadius: "0",
							fontSize: 16,
						},
						input: {
							padding: "10px",
						},
					}}
				/> */}
				{/* <CustomToolbar/> */}
				<ReactQuill
					{...other}
					className='style'
					value={description}
					placeholder={placeholder || "Description"}
					onChange={setDescription}
					modules={modules}
					formats={formats}
					theme='snow'
				>
				</ReactQuill>
			</div>
		</div>
	);
}

export default DescriptionInput;
