import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { useHistory } from "react-router-dom";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import InputBase from "@material-ui/core/InputBase";
import { ButtonBase } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import CreateBtn from "../styled/actionBtns/create.btn";
import { addCommentInParent } from "./comment.utils";
import Api from "../../helpers/Api";

import MentionInput from "../styled/mention.input";
import mentionTextProcessor from "../styled/mentionTextProcessor";
import GuestDialogueBox from "../guestDialogueBox/guestDialogueBox";

const useStyles = makeStyles({
	root: {
		padding: "10px",
		paddingBottom: "3px",
		width: "100%",
	},

	rowRev: {
		flex: 1,
		display: "flex",
		flexDirection: "row-reverse",
	},

	colDiv: {
		width: "100%",
		display: "flex",
		borderRadius: "13px",
		flexDirection: "column",
		border: "1.5px solid #ededed",
		padding: "5px 0",
	},

	rowDiv: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		gap: "3px",
	},

	title: {
		fontSize: 14,
	},

	titleInput: {
		flex: 1,
	},

	cancelBtn: {
		borderRadius: "0.4rem",
		paddingLeft: "1rem",
		paddingRight: "1rem",
	},
	avatar: {
		width: "2.5rem",
		height: "2.5rem",
	},
	name: {
		height: "auto",
		fontSize: "15px",
		fontWeight: "500",
		paddingLeft: "10px",
	},
});

export default function CommentCreate(props) {
	const [text, setText] = useState("");
	const { parent, parentModelName, guestView, setCommentIds, setCommentDictionary } =
		props;
	const { user, userProfile } = useSelector((state) => state.auth);
	const profile = user?.profile;
	const state = useSelector((state) => state);
	const { createdFileIds } = useSelector((state) => state.file);
	const dispatch = useDispatch();
	const classes = useStyles();
	const { colDiv, rowDiv, rowRev, cancelBtn } = classes;
	const userId = user?._id;
	const [open, setOpen] = useState(false);



	const _createComment = async () => {
		const processedTextArray = mentionTextProcessor(text);
		const notifyArr = [];
		processedTextArray.forEach((el) => {
			if (el.type === "mention") notifyArr.push(el.id);
		});
		// console.log(notifyArr);
		// console.log({ createdFileIds });
		const commentObject = {
			text,
			user: user?._id,
			profile,
			parent,
			parentModelName,
			notify: notifyArr,
			files: createdFileIds,
		};
		try {
			const newComment = await Api.post("comment/create", commentObject);
			setCommentIds((prev) => [newComment?.comment?._id, ...prev]);
			setCommentDictionary((prev) => {
				const newDict = { ...prev };
				newDict[newComment?.comment?._id] = newComment?.comment;
				return newDict;
			});
			setText("");
			dispatch({ type: "FileUploadReset" });
		} catch (error) {
			console.log(error);
			if (error.response) {
				console.log(error.response);
				// Request made and server responded
				// console.log(error.response.data);
				// console.log(error.response.status);
				// console.log(error.response.headers);
			} else if (error.request) {
				// The request was made but no response was received
				console.log("response not recieved from server");
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				// alert("Error", error.message);
				console.log(error.message);
			}
		}
	};

	function handleChange(event) {
		setText(event.target.value);
	}

	function showWarning() {
		setOpen(true);
	}

	const styleBody = {
		root: {
			width: "100%",
			// width: "calc(100% - 100px)",
			display: "flex",
			alignItems: "center",
		},
		mentionBox: {
			width: "calc(100% - 100px)",
		},
		control: {
			width: "100%",
			height: "50px",
		},
		input: {
			width: "100%",
			padding: "0px",
		},
	};

	return (
		<Paper className={classes.root} elevation={0}>
			<GuestDialogueBox open={open} setOpen={setOpen} />
			<div className={rowDiv}>
				<Avatar
					imgProps={{
						referrerPolicy: "no-referrer",
					}}
					className={classes.avatar}
					alt={user?.displayName}
					src={user?.displayPicture?.thumbUrl || user?.displayPicture?.url}
				/>

				<div className={colDiv}>
					{/* <Typography className={classes.name}>
						{user?.displayName}
					</Typography> */}

					<div style={{ padding: "10px" }}>
						<MentionInput
							value={text}
							setValue={setText}
							onChange={handleChange}
							placeholder={"Type your comment here"}
							styleBody={styleBody}
							emojies={true}
							files={true}
							fileParentType="Comment"
							fileIds={createdFileIds}
						/>
					</div>

					{text?.length > 0 || createdFileIds?.length > 0 ? (
						<div className={rowRev}>
							<CreateBtn
								onClick={() => {
									guestView ? showWarning() : _createComment();
								}}
							>
								Comment
							</CreateBtn>
							<ButtonBase
								className={cancelBtn}
								onClick={() => {
									setText("");
								}}
							>
								<Typography>CANCEL</Typography>
							</ButtonBase>
						</div>
					) : null}
				</div>
			</div>
		</Paper>
	);
}
