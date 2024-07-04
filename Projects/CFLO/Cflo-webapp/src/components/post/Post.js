import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../../helpers/Api";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import PostFile from "./PostFile";
import FilesViewer from "../file/Viewer/FilesViewer";
import UploadPostBox from "./UploadPostBox";
import arrayToReducer from "../../helpers/arrayToReducer";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Divider, ListItemIcon, Menu, MenuItem } from "@material-ui/core";
// import baseStyle from "./styled/base/index";

const useStyles = makeStyles((theme) => ({
	media: {
		minHeight: 350,
		backgroundSize: "contain",
	},
	link: {
		textDecoration: "none",
	},
	fabButton: {
		position: "absolute",
		bottom: "5rem",
		right: "4rem",
		cursor: "pointer",
		// fontSize: "1.1rem",
	},
	fabIcon: {
		marginRight: theme.spacing(0.8),
		// fontSize: "2.4rem",
	},
	progressBox: {
		display: "flex",
		justifyContent: "center",
		height: "50vh",
		alignItems: "center"
	},
	viewBox: {
		width: "75%",
		border: "1px solid rgba(175, 175, 175, 0.8)",
		display: "flex",
		padding: "0.5rem 0.5rem",
		alignItems: "center",
		borderRadius: "8px",
		marginBottom: "1.5rem",
		justifyContent: "space-between",
		backgroundColor: "white",
		[theme.breakpoints.down("md")]: {
			width: "100%",
		},
	},
}));
var suggestedArr = [];

function PostMemo({
	selectedProfile,
	setSelectedProfile,
	loadingAdmin,
	adminProfiles,
}) {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => state);
	const { user } = auth;
	const [menuAnchor, setMenuAnchor] = useState(null);
	const observer = useRef();
	const [currPage, setCurrPage] = useState(0);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [nextLoading, setNextLoading] = useState(false);
	const [postIds, setPostIds] = useState([]);
	const [postDict, setPostDict] = useState({});
	const [hasMore, setHasMore] = useState(true);
	const [newUser, setNewUser] = useState(false);
	var items = [
		"Popular Posts",
		"You may also like",
		"Happening around you",
		"Suggested Posts",
	];

	let postFromBackend = 10;

	const handleMenuOpen = (event) => {
		setMenuAnchor(event.currentTarget);
	};

	const handleMenuClose = () => {
		setMenuAnchor(null);
	};
	const handleMenuClick = (obj) => {
		setSelectedProfile({ ...obj });
		handleMenuClose();
	};

	const getFollwingPosts = async () => {
		setNextLoading(true);
		const res = await Api.post("post/followingpost", {
			page: currPage,
			userProfile: selectedProfile?.profile,
		});

		setNextLoading(false);
		if (res?.followingPosts) {
			if (res?.followingPosts.length > 0 || posts.length > 0) {
				setLoading(false);
				setPosts((prev) => [...prev, ...res?.followingPosts]);
				if (res?.followingPosts.length < postFromBackend) {
					setHasMore(false);
				}
			} else {
				// new user with no followed post so we show suggested posts
				setNewUser(true);
			}
		}
	};
	const getSuggestedPosts = async () => {
		setNextLoading(true);
		const resSuggested = await Api.post("post/popular-feed-posts", {
			userProfile: selectedProfile?.profile,
			page: currPage,
		});
		setLoading(false);
		setNextLoading(false);
		if (resSuggested?.posts) {
			setPosts((prev) => [...prev, ...resSuggested?.posts]);
			if (resSuggested?.posts.length < postFromBackend) {
				setHasMore(false);
			}
		}
	};

	useEffect(() => {
		const { newDict, idArr } = arrayToReducer([...posts] || []);
		// console.log("allPosts-", newDict, idArr);
		setPostDict({ ...newDict });
		setPostIds([...idArr]);
	}, [posts]);

	const lastElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setCurrPage((prev) => {
						return prev + 1;
					});
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);
	useEffect(() => {
		if (newUser) {
			getSuggestedPosts();
		} else {
			getFollwingPosts();
		}
	}, [currPage, newUser]);
	useEffect(() => {
		setCurrPage(0);
		setPostIds([]);
		setPostDict({});
		getFollwingPosts();
	}, [selectedProfile]);

	return (
		<div>
			{!loadingAdmin ? (
				<div className={classes.root}>
					<UploadPostBox selectedProfile={selectedProfile} adminProfiles={adminProfiles}
						setSelectedProfile={setSelectedProfile} loading={loadingAdmin} />
					{loading ? (
						<div className={classes.progressBox}>
							<CircularProgress />
						</div>
					) : (
						postIds.map((el, idx) => {
							let lastItem = postIds.length - 1;
							if (!suggestedArr[idx]) {
								suggestedArr[idx] =
									items[
									Math.floor(Math.random() * items.length)
									];
							}

							return postDict[el] ? (
								idx === lastItem ? (
									<div
										ref={lastElementRef}
										// style={{ height: "10rem" }}
										className={classes.link}
									>
										<PostFile
											topText={
												newUser && (
													<div>
														<div
															style={{
																display: "flex",
																alignItems:
																	"center",
																padding:
																	"8px 15px 0px",
																gap: "5px",
																// cursor: "pointer",
															}}
														>
															<Typography
																variant="body1"
																style={{
																	fontWeight:
																		"500",
																	color: "#444444",
																	fontSize:
																		"0.97rem",
																}}
															>
																{
																	suggestedArr[
																	idx
																	]
																}
															</Typography>
														</div>
														<Divider
															style={{
																margin: "4px 0 -8px",
															}}
														/>
													</div>
												)
											}
											commentLimit={5}
											key={postDict[el]._id}
											post={postDict[el]}
											setPostDict={postDict}
											addLink={true}
											sentProfile={selectedProfile}
										/>
									</div>
								) : (
									<div
										// style={{ height: "10rem" }}
										className={classes.link}
									>
										<PostFile
											topText={
												newUser && (
													<div>
														<div
															style={{
																display: "flex",
																alignItems:
																	"center",
																padding:
																	"8px 15px 0px",
																gap: "5px",
																// cursor: "pointer",
															}}
														>
															<Typography
																variant="body1"
																style={{
																	fontWeight:
																		"500",
																	color: "#444444",
																	fontSize:
																		"0.97rem",
																}}
															>
																{
																	suggestedArr[
																	idx
																	]
																}
															</Typography>
														</div>
														<Divider
															style={{
																margin: "4px 0 -8px",
															}}
														/>
													</div>
												)
											}
											commentLimit={5}
											key={postDict[el]._id}
											post={postDict[el]}
											setPostDict={postDict}
											addLink={true}
											sentProfile={selectedProfile}
										/>
									</div>
								)
							) : (
								<></>
							);
						})
					)}
					{!loading && nextLoading && (
						<div className={classes.progressBox}>
							<CircularProgress />
						</div>
					)}
					<div></div>
				</div>
			) : (
				<div className={classes.progressBox}>
					<CircularProgress />
				</div>
			)}
		</div>
	);
}

const Post = React.memo(PostMemo);
export default Post;
