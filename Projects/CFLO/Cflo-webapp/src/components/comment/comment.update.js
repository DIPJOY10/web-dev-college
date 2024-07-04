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
import { update } from "./comment.utils";
import Api from "../../helpers/Api";
import MentionInput from "../styled/mention.input";
import mentionTextProcessor from "../styled/mentionTextProcessor";
import _ from "lodash";

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

const styleBody = {
	root: {
		width: "100%",
	},
	control: {
		width: "100%",
		height: "60px",
	},
	input: {
		padding: "10px",
	},
};

export default function CommentUpdate(props) {
	const {
		commentId,
		setEditMode,
		commentDictionary,
		setCommentIds,
		setCommentDictionary,
		sentProfile,
	} = props;
	const comment = commentDictionary[commentId];
	// console.log(commentDictionary,commentId,comment,' is comment everything')
	console.log(comment);
	const oldText = comment?.text ? comment.text : "";
	const oldFileIds = comment?.files?.map((el) => el._id) || [];
	const [text, setText] = useState(oldText);
	const [initialMentionProfiles, setInitialMentionProfiles] = useState([]);
	const { parent, parentModelName } = props;
	const { user: userAuth, userProfile } = useSelector((state) => state.auth);
	const user = props?.sentProfile || userAuth;
	const dispatch = useDispatch();
	const classes = useStyles();
	const { colDiv, rowDiv, rowRev, cancelBtn } = classes;
	const userId = user._id;
	const { createdFileIds } = useSelector((state) => state.file);

	useEffect(() => {
		const processedArr = mentionTextProcessor(oldText);
		const mentions = [];
		processedArr.forEach((el) => {
			if (el.type === "mention") mentions.push(el.id);
		});
		setInitialMentionProfiles(mentions);
	}, []);

	useEffect(() => {
		const newComment = commentDictionary[commentId];
		const newText = comment?.text ? comment.text : "";
		setText(newText);
	}, [commentDictionary]);

	useEffect(() => {
		setText(oldText);
	}, [oldText]);

	const _updateComment = async () => {
		const newMentions = [];
		const processedArr = mentionTextProcessor(text);
		processedArr.forEach((el) => {
			if (el.type === "mention") newMentions.push(el.id);
		});
		// console.log({ initialMentionProfiles, newMentions });
		const diffMentions = _.difference(newMentions, initialMentionProfiles);
		// console.log({ diffMentions });
		console.log({ all: [...oldFileIds, ...createdFileIds] });

		const commentObject = {
			_id: commentId,
			text,
			notify: diffMentions,
			files: [...oldFileIds, ...createdFileIds],
		};

		const commentRes = await Api.post("comment/update", commentObject);
		setCommentIds((prev) => [
			commentRes._id,
			...prev.filter((el) => el !== commentRes._id),
		]);
		console.log({ commentRes });
		setCommentDictionary((prev) => {
			const newDict = prev;
			newDict[commentRes._id] = commentRes;
			return newDict;
		});
		setEditMode(false);
	};

	function handleChange(event) {
		setText(event.target.value);
	}

	return (
		<Paper className={classes.root} elevation={0}>
			<div className={rowDiv}>
				<Avatar
					imgProps={{
						referrerPolicy: "no-referrer",
					}}
					className={classes.avatar}
					alt={user.displayName}
					src={user?.displayPicture?.thumbUrl}
				/>
				<div className={colDiv}>
					{/* <Typography className={classes.name}>
						{user?.displayName}
					</Typography> */}
					<div style={{ padding: "10px" }}>
						{/* <InputBase
              multiline
              rowsMax={2}
              value={text}
              placeholder={"Type your comment here"}
              onChange={(event) => setText(event.target.value)}
              className={classes.titleInput}
              autoFocus
            /> */}
						<MentionInput
							value={text}
							setValue={setText}
							onChange={handleChange}
							placeholder={"Type your comment here"}
							styleBody={styleBody}
							emojies={true}
							files={true}
							fileParentType="Comment"
							fileIds={[...oldFileIds, ...createdFileIds]}
						/>
					</div>
					<div className={rowRev}>
						<CreateBtn
							onClick={() => {
								_updateComment();
							}}
						>
							Update
						</CreateBtn>
						<ButtonBase
							className={cancelBtn}
							onClick={() => {
								setEditMode(false);
							}}
						>
							<Typography>CANCEL</Typography>
						</ButtonBase>
					</div>
				</div>
			</div>
		</Paper>
	);
}
