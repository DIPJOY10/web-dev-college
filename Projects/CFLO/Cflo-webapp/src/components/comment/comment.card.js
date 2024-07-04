import React, { useState, useEffect, useRef } from "react";
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
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { update } from "./comment.utils";
import ChatMsgSlack from "../chat/ChatMsgSlack";
import MentionOutput from "../styled/mention.output";
import FilesObjectViewer from "../file/Viewer/FilesObjectViewer";
import { format } from "timeago.js";
import Api from "../../helpers/Api";

const useStyles = makeStyles({
	root: {
		flex: 1,
		padding: "3px 4px",
		width: "100%",
		position: "relative",
	},

	rowRev: {
		flex: 1,
		display: "flex",
		flexDirection: "row-reverse",
	},

	colDiv: {
		flex: "1",
		display: "flex",
		gap: "3px",
	},

	rowDiv: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},

	rowDivBetween: {
		flex: "1",
		display: "flex",
		paddingLeft: "10px",
		flexDirection: "row",
		justifyContent: "space-between",
	},

	title: {
		fontSize: 14,
	},

	titleInput: {
		flex: 1,
	},
	avatar: {
		width: "2.5rem",
		height: "2.5rem",
	},

	cancelBtn: {
		borderRadius: "0.4rem",
		paddingLeft: "1rem",
		paddingRight: "1rem",
	},

	menuButton: {
		// height: "2rem",
		// width: "2rem",
		padding: "3px",
	},
	name: {
		height: "auto",
		fontSize: "15px",
		fontWeight: "500",
		"&:hover": {
			textDecoration: "underline",
			cursor: "pointer",
		},
	},
	commentBox: {
		width: "100%",
		paading: "5px 0",
		backgroundColor: "#f5f6f7",
		borderRadius: "10px",
	},
	menuList: {
		padding: "0",
	},
	menuItem: {
		padding: "2px 10px",
	},
});

const mentionStyleBody = {
	root: {},
};

export default function CommentCard(props) {
	const {
		comment,
		setEditMode,
		setSelectedId,
		setCommentDictionary,
		sentProfile,
	} = props;
	const {
		_id: commentId,
		user: commentUser,
		profile: commentUserProfile,
		text,
		files,
	} = comment;
	// console.log("comment = ", comment);
	const state = useSelector((state) => state);
	const dispatch = useDispatch();
	const { auth } = state;
	const { user: userAuth } = auth;
	const user = sentProfile || userAuth;
	const profile = user?.profile;
	const classes = useStyles();
	const { colDiv, rowDiv, rowRev, cancelBtn, rowDivBetween, menuButton } =
		classes;

	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};
	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};
	function handleListKeyDown(event) {
		if (event.key === "Tab") {
			event.preventDefault();
			setOpen(false);
		}
	}
	function handleEdit(event) {
		setSelectedId(commentId);
		setEditMode(true);
		handleClose(event);
	}

	function handleDelete(event) {
		handleClose(event);
		Api.post("comment/delete", {
			commentId,
		}).then(() => {
			setCommentDictionary((prev) => {
				const newDict = { ...prev };
				newDict[commentId] = undefined;
				return newDict;
			});
		});
	}

	return (
		<>
			{user && commentUser ? (
				<div className={classes.root} style={{ marginTop: "0.2rem" }}>
					<div className={classes.root}>
						<div>
							<div className={colDiv}>
								<Avatar
									imgProps={{
										referrerPolicy: "no-referrer",
									}}
									className={classes.avatar}
									alt={commentUser?.displayName}
									src={commentUser?.displayPicture?.thumbUrl || commentUser?.displayPicture?.url}
								/>
								<div className={classes.commentBox}>
									<div className={rowDivBetween}>
										<div
											style={{
												display: "flex",
												gap: "10px",
												alignItems: "center",
											}}
										>
											<Typography className={classes.name}>
												{commentUser?.displayName}
											</Typography>
											<Typography
												variant="subtitle1"
												style={{ fontSize: "14px" }}
											>
												{format(comment?.updatedAt)}
											</Typography>
										</div>
										{commentUser?._id === user._id ? (
											<>
												<IconButton
													ref={anchorRef}
													aria-controls={
														open
															? "menu-list-grow"
															: undefined
													}
													aria-haspopup="true"
													onClick={handleToggle}
													className={menuButton}
												>
													<MoreVertIcon />
												</IconButton>
												<Popper
													open={open}
													anchorEl={anchorRef.current}
													role={undefined}
													transition
													disablePortal
												>
													{({
														TransitionProps,
														placement,
													}) => (
														<Grow
															{...TransitionProps}
															style={{
																transformOrigin:
																	placement ===
																		"bottom"
																		? "center top"
																		: "center bottom",
															}}
														>
															<Paper>
																<ClickAwayListener
																	onClickAway={
																		handleClose
																	}
																>
																	<MenuList
																		autoFocusItem={
																			open
																		}
																		id="menu-list-grow"
																		onKeyDown={
																			handleListKeyDown
																		}
																		className={
																			classes.menuList
																		}
																	>
																		<MenuItem
																			className={
																				classes.menuItem
																			}
																			onClick={
																				handleEdit
																			}
																		>
																			Edit
																		</MenuItem>
																		<MenuItem
																			className={
																				classes.menuItem
																			}
																			onClick={
																				handleDelete
																			}
																		>
																			Delete
																		</MenuItem>
																	</MenuList>
																</ClickAwayListener>
															</Paper>
														</Grow>
													)}
												</Popper>
											</>
										) : (
											<div />
										)}
									</div>
									<MentionOutput
										styleBody={{ root: { padding: "0 10px 10px" } }}
										text={text}
									/>
									<FilesObjectViewer
										// styleBody={{ width: "5.5rem", height: "5.5rem" }}
										// isGallery={true}
										files={files}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
}
