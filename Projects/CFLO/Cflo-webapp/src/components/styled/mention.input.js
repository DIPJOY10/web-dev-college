import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { MentionsInput, Mention } from "react-mentions";
import IconButton from "@material-ui/core/IconButton";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import Picker from "emoji-picker-react";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import FilesViewer from "../file/Viewer/FilesViewer";

import Api from "../../helpers/Api";

const useStyles = makeStyles((theme) => ({
	root: (props) => {
		return {
			width: "100%",
			...(props && typeof props.root === "object" ? props.root : {}),
			position: "relative",
		};
	},
	mentionBox: (props) => {
		return {
			width: "100%",
			...(props && typeof props.mentionBox === "object"
				? props.mentionBox
				: {}),
		};
	},
	buttons: {
		display: "flex",
		justifyContent: "flex-end",
	},
	emojiBox: {
		position: "absolute",
		bottom: "50px",
		right: "0",
		zIndex: "10",
		overflow: "visible",
	},
	icon: {
		// padding: 0,
	},
}));

function MentionInputMemo({
	value,
	setValue,
	onChange,
	onClick,
	inputRef,
	placeholder,
	styleBody,
	emojies = false,
	files = false,
	fileParentType,
	fileIds = [],
	buttonBox = true,
}) {
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => state);
	const { user } = auth;
	const classes = useStyles(styleBody);
	const [openEmojiBox, setOpenEmojiBox] = useState(false);
	const { createdFileIds } = useSelector((state) => state.file);
	const style = {
		control: {
			width: "100%",
			height: "55px",
			backgroundColor: "inherit",
			...(styleBody && typeof styleBody.control === "object"
				? styleBody.control
				: {}),
		},

		highlighter: {
			...(styleBody && typeof styleBody.highlighter === "object"
				? styleBody.highlighter
				: {}),
		},

		input: {
			margin: 0,
			border: "none",
			outline: "none",
			width: "100%",
			height: "auto",
			...(styleBody && typeof styleBody.input === "object"
				? styleBody.input
				: {}),
			overflow: "auto",
		},

		"&singleLine": {
			// control: {
			//   display: "inline-block",
			//   width: 130,
			// },
			// highlighter: {
			//   padding: 1,
			//   border: "none",
			// },
			// input: {
			//   padding: 1,
			//   border: "none",
			// },
		},

		"&multiLine": {
			control: {
				border: "none",
			},
			highlighter: {
				padding: 9,
			},
			input: {
				minHeight: "80px",
				border: "none",
				outline: "none",
			},
		},

		suggestions: {
			list: {
				backgroundColor: "white",
				border: "1px solid rgba(0,0,0,0.15)",
				fontSize: 14,
			},

			item: {
				padding: "5px 15px",
				borderBottom: "1px solid rgba(0,0,0,0.15)",

				"&focused": {
					backgroundColor: "#cee4e5",
				},
			},
		},
	};

	function displayTransform(id, display, type) {
		return `@${display}`;
	}

	function fetchUsers(query, callback) {
		if (!query) return;
		Api.post("searchProfileList", {
			name: query,
		})
			.then((res) => {
				return res.data;
			})

			// Transform the users to what react-mentions expects
			.then((res) => {
				const filteredArray = res.filter((el) => el.parent !== null);

				const ret = filteredArray.map((profile) => ({
					display: profile.parent.displayName,
					id: profile._id,
					type: profile._id,
				}));
				return ret;
			})
			.then(callback);
	}
	return (
		<div className={classes.root} onClick={onClick}>
			<div className={classes.mentionBox}>
				<MentionsInput
					value={value}
					onChange={onChange}
					placeholder={placeholder ? placeholder : "Description"}
					style={style}
					inputRef={inputRef}
					allowSpaceInQuery={true}
				>
					<Mention
						type="user"
						displayTransform={displayTransform}
						trigger="@"
						data={fetchUsers}
						markup="|--|@__id__||__display__|--|"
					/>
				</MentionsInput>
			</div>
			<div className={classes.emojiBox}>
				{openEmojiBox && emojies ? (
					<Picker
						onEmojiClick={(ev, emojiObj) => {
							setValue((prev) => prev + emojiObj.emoji);
						}}
					/>
				) : (
					<div />
				)}
			</div>
			{buttonBox ? (
				<div className={classes.buttons}>
					{files ? (
						<FileUploadButton
							parentType={fileParentType}
							used={false}
							parentId={null}
						/>
					) : (
						<div />
					)}
					{emojies ? (
						<IconButton
							className={classes.icon}
							aria-label="emojiBox"
							onClick={() => setOpenEmojiBox((prev) => !prev)}
						>
							<EmojiEmotionsIcon />
						</IconButton>
					) : (
						<div />
					)}
				</div>
			) : (
				<div />
			)}
			<FilesViewer fileIds={fileIds} />
		</div>
	);
}

const MentionInput = React.memo(MentionInputMemo);
export default MentionInput;
