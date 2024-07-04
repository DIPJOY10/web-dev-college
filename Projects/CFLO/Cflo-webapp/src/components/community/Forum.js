import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	Avatar, CircularProgress, Divider, Grid,
	makeStyles, Paper, Typography,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ForumNav from "./ForumNav";
import SuggestedCommunitiesSidebar from "./SuggestedCommunitiesSidebar";
import PostFile from "../post/PostFile";
import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";
import useGetAdminProfiles from "../profile/useGetAdminProfiles";
import CommunitySearches from "./CommunitySearches";
import YourCommunitySidebar from "./YourCommunitiesSidebar";
import PopularTags from "../styled/CommonComponents/PopularTags";

var suggestedArr = [];

const useStyles = makeStyles((theme) => ({
	nav: {
		width: "75%",
		margin: "0 auto",
		marginBottom: "20px",
		[theme.breakpoints.down("md")]: {
			width: "100%",
		},
	},
}));
var suggestedArr = [];

function Forum() {
	const dispatch = useDispatch();
	const history = useHistory();
	const classes = useStyles();
	const { auth, forum } = useSelector((state) => state);
	const { user } = auth;

	console.log("forumReducer", forum);
	const [joinedCommunitiesProfileids, setjoinedCommunitiesProfileids] =
		useState(null);
	const [joinedCommunitiesDictList, setjoinedCommunitiesDictList] = useState(
		{}
	);
	const [joinedCommsIds, setJoinedCommsIds] = useState([]);
	const [joinedCommsDict, setJoinedCommsDict] = useState({});
	const [popularIds, setPopularIds] = useState([]);
	const [popularDict, setPopularDict] = useState({});

	const { adminProfiles, loading: loadingAdmin } = useGetAdminProfiles();
	const [selectedProfile, setSelectedProfile] = useState(null);
	const observer = useRef();
	const [currPage, setCurrPage] = useState(0);
	const [loading, setLoading] = useState(true);
	const [nextLoading, setNextLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [newUser, setNewUser] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const location = useLocation();
	const searchParam = location.search;

	var items = [
		"Popular Posts",
		"You may also like",
		"Happening around you",
		"Suggested Posts",
	];
	let postFromBackend = 10;
	useEffect(() => {
		setSelectedProfile(adminProfiles[0]);
	}, [adminProfiles]);

	async function getForumInfo() {
		setLoading(true);
		// dispatch({ type: "ResetForum" });
		const moderations = await Api.post("community/get-moderation", {
			profile: selectedProfile?.profile,
		});
		const { idArr: moderationIds, newDict: moderationDict } =
			arrayToReducer(moderations?.communities || []);

		let joinedCommunities = (
			await Api.post("community/get-joined", {
				profile: selectedProfile?.profile,
			})
		).communities.map((el) => el.community);
		let joinedCommunitiesProfileIdsTemp = joinedCommunities.map(
			(el) => el?.profile?._id
		);

		// console.log(
		//   "forumJoinCommunities",
		//   joinedCommunities,
		//   joinedCommunitiesProfileIds,
		//   selectedProfile?.profile
		// );
		console.log(
			"forumJoinedCommunityProfileIdss",
			joinedCommunitiesProfileIdsTemp,
			joinedCommunitiesProfileids
		);
		setjoinedCommunitiesProfileids([
			...(joinedCommunitiesProfileIdsTemp || []),
		]);
		const { idArr: joinedCommunitiesIds, newDict: joinedCommunitiesDict } =
			arrayToReducer(joinedCommunities || []);
		setjoinedCommunitiesDictList(joinedCommunitiesDict);

		const suggestedCommunities = await Api.post("community/get-suggested", {
			profile: selectedProfile?.profile,
			limit: 10,
			page: 0,
		});

		const {
			idArr: suggestedCommunitiesIds,
			newDict: suggestedCommunitiesDict,
		} = arrayToReducer(suggestedCommunities?.communities || []);

		dispatch({
			type: "AddForum",
			payload: {
				joinedCommunities: [...(joinedCommunities || [])],
				joinedCommunitiesIds: [...(joinedCommunitiesIds || [])],
				joinedCommunitiesDict: { ...(joinedCommunitiesDict || {}) },
				moderationCommunities: [...(moderations?.communities || [])],
				moderationCommunitiesIds: [...(moderationIds || [])],
				moderationCommunitiesDict: { ...(moderationDict || {}) },
				suggestedCommunities: [
					...(suggestedCommunities?.communities || []),
				],
				suggestedCommunitiesIds: [...(suggestedCommunitiesIds || [])],
				suggestedCommunitiesDict: {
					...(suggestedCommunitiesDict || {}),
				},
			},
		});
		await getFollwingPosts();
		setLoading(false);
	}

	const getFollwingPosts = async () => {
		setNextLoading(true);
		// console.log("forumJoinedProfileIds", joinedCommunitiesProfileIds);
		const joinedCommunitiesPosts = await Api.post("post/communities-post", {
			communitiesProfileIds: joinedCommunitiesProfileids,
			userProfile: selectedProfile?.profile,
			limit: 10,
			page: currPage,
		});
		setNextLoading(false);
		// console.log(
		// 	"forumJoinedPosts",
		// 	joinedCommunitiesPosts,
		// 	joinedCommunitiesProfileids
		// );

		if (joinedCommunitiesPosts?.joinedCommunitiesPosts) {
			if (
				joinedCommunitiesPosts?.joinedCommunitiesPosts.length > 0 ||
				joinedCommsIds.length > 0
			) {
				const {
					idArr: joinedCommunitiesPostsIdsTemp,
					newDict: joinedCommunitiesPostsDictTemp,
				} = arrayToReducer(
					joinedCommunitiesPosts?.joinedCommunitiesPosts || []
				);

				setJoinedCommsDict((prev) => {
					return {
						...(prev || {}),
						...(joinedCommunitiesPostsDictTemp || {}),
					};
				});
				setJoinedCommsIds((prev) => {
					return [
						...(prev || []),
						...(joinedCommunitiesPostsIdsTemp || []),
					];
				});
				if (
					joinedCommunitiesPosts?.joinedCommunitiesPosts.length <
					postFromBackend
				) {
					setHasMore(false);
				}
			}
		}
	};

	const getPopularPosts = async () => {
		setNextLoading(true);
		const resSuggested = await Api.post("post/popular-forum-posts", {
			userProfile: selectedProfile?.profile,
			page: currPage,
		});
		setNextLoading(false);

		if (resSuggested?.posts) {
			if (resSuggested?.posts.length > 0) {
				const {
					idArr: resSuggestedPostsIdsTemp,
					newDict: resSuggestedPostsDictTemp,
				} = arrayToReducer(resSuggested?.posts || []);

				setPopularDict((prev) => {
					return { ...(prev || {}), ...resSuggestedPostsDictTemp };
				});
				setPopularIds((prev) => {
					return [...(prev || {}), ...resSuggestedPostsIdsTemp];
				});

				if (resSuggested?.posts.length < postFromBackend) {
					setHasMore(false);
				}
			}
		}
	};
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
	const getSearchResults = async () => {
		const searchResultsRes = await Api.post("community/search", {
			name: decodeURI(location.search.slice(1)),
		});
		setSearchResults(searchResultsRes?.data || []);
	};

	useEffect(() => {
		if (!searchParam) {
			setSearchResults([]);
		} else {
			getSearchResults();
		}
	}, [searchParam]);

	useEffect(() => {
		if (selectedProfile) {
			getForumInfo();
			setCurrPage(0);
		} else {
			setNewUser(false);
		}
	}, [selectedProfile]);

	useEffect(() => {
		if (joinedCommunitiesProfileids) {
			if (joinedCommunitiesProfileids.length > 0) {
				setNewUser(false);
			} else {
				setNewUser(true);
			}
		}
	}, [joinedCommunitiesProfileids]);

	useEffect(() => {
		if (newUser) {
			getPopularPosts();
		} else {
			getFollwingPosts();
		}
	}, [newUser, currPage, joinedCommunitiesProfileids]);

	console.log("state = ", newUser, joinedCommsDict, popularDict);
	if (!loading) {
		return (
			<div>
				<Grid container>
					<Grid item xs={12} sm={9} md={9}>
						{/* <Post /> */}
						<div className={classes.nav}>
							<ForumNav
								adminProfiles={adminProfiles}
								selectedProfile={selectedProfile}
								setSelectedProfile={setSelectedProfile}
								loading={loadingAdmin}
							/>
						</div>

						{!searchParam ? (
							newUser ? (
								popularIds.map((id, index) => {
									let lastItem = popularIds.length - 1;
									if (!suggestedArr[index]) {
										suggestedArr[index] =
											items[
											Math.floor(
												Math.random() * items.length
											)
											];
									}
									{
										return popularDict[id] ? (
											index == lastItem ? (
												<div ref={lastElementRef}>
													<PostFile
														topText={
															<div>
																<div
																	style={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		padding:
																			"8px 15px",
																		gap: "5px",
																		// cursor: "pointer",
																	}}
																>
																	<Typography
																		variant="body1"
																		style={{
																			fontWeight:
																				"400",
																			color: "rgb(68, 68, 68)",
																			fontSize:
																				"0.9rem",
																			lineHeight:
																				"1.3",
																		}}
																	>
																		{
																			suggestedArr[
																			index
																			]
																		}
																	</Typography>
																</div>

																<div
																	onClick={() => {
																		history.push("/explore/forum/communities/" + popularDict[id]?.channels[0]?.parent?.slug);
																	}}
																	style={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		padding:
																			"12px 15px 0px",
																		gap: "5px",
																		cursor: "pointer",
																	}}
																>
																	<Avatar
																		alt={
																			popularDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayName
																		}
																		src={
																			popularDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayPicture
																				?.thumbUrl ||
																			popularDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayPicture
																				?.url
																		}
																		style={{
																			width: "25px",
																			height: "25px",
																		}}
																	/>
																	<Typography
																		variant="body1"
																		style={{
																			fontWeight: "500",
																			fontSize: "14px"
																		}}
																	>
																		c/
																		{
																			popularDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayName
																		}
																	</Typography>
																</div>
																<Divider
																	style={{
																		margin: "4px 0 -8px",
																	}}
																/>
															</div>
														}
														commentLimit={5}
														key={index}
														post={popularDict[id]}
														// setPostDict={postDict}
														addLink={false}
													/>
												</div>
											) : (
												<div>
													<PostFile
														topText={
															<div>
																<div
																	style={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		padding:
																			"8px 15px",
																		gap: "5px",
																		// cursor: "pointer",
																	}}
																>
																	<Typography
																		variant="body1"
																		style={{
																			fontWeight:
																				"400",
																			color: "rgb(68, 68, 68)",
																			fontSize:
																				"0.9rem",
																			lineHeight:
																				"1.3",
																		}}
																	>
																		{
																			suggestedArr[
																			index
																			]
																		}
																	</Typography>
																</div>

																<div
																	onClick={() => {
																		history.push("/explore/forum/communities/" + popularDict[id]?.channels[0]?.parent?.slug);
																	}}
																	style={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		padding:
																			"12px 15px 0px",
																		gap: "5px",
																		cursor: "pointer",
																	}}
																>
																	<Avatar
																		alt={
																			popularDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayName
																		}
																		src={
																			popularDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayPicture
																				?.thumbUrl ||
																			popularDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayPicture
																				?.url
																		}
																		style={{
																			width: "25px",
																			height: "25px",
																		}}
																	/>
																	<Typography
																		variant="body1"
																		style={{
																			fontWeight: "500",
																			fontSize: "14px"
																		}}
																	>
																		c/
																		{
																			popularDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayName
																		}
																	</Typography>
																</div>
																<Divider
																	style={{
																		margin: "4px 0 -8px",
																	}}
																/>
															</div>
														}
														commentLimit={5}
														key={index}
														post={popularDict[id]}
														// setPostDict={postDict}
														addLink={false}
													/>
												</div>
											)
										) : (
											<></>
										);
									}
								})
							) : (
								joinedCommsIds.map((id, index) => {
									let lastItem = joinedCommsIds.length - 1;
									{
										return joinedCommsDict[id] ? (
											index == lastItem ? (
												<div ref={lastElementRef}>
													<PostFile
														topText={
															<div>
																<div
																	onClick={() => {
																		history.push("/explore/forum/communities/" + joinedCommsDict[id]?.channels[0]?.parent?.slug);
																	}}
																	style={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		padding:
																			"8px 15px",
																		gap: "5px",
																		cursor: "pointer",
																	}}
																>
																	<Avatar
																		alt={
																			joinedCommsDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayName
																		}
																		src={
																			joinedCommsDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayPicture
																				?.thumbUrl ||
																			joinedCommsDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayPicture
																				?.url
																		}
																		style={{
																			width: "25px",
																			height: "25px",
																		}}
																	/>
																	<Typography
																		variant="body1"
																		style={{
																			fontWeight: "500",
																			fontSize: "14px"
																		}}
																	>
																		c/
																		{
																			joinedCommsDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayName
																		}
																	</Typography>
																</div>
																<Divider
																	style={{
																		margin: "4px 0 -8px",
																	}}
																/>
															</div>
														}
														commentLimit={5}
														key={id}
														post={
															joinedCommsDict[id]
														}
														// setPostDict={postDict}
														addLink={false}
													/>
												</div>
											) : (
												<div>
													<PostFile
														topText={
															<div>
																<div
																	onClick={() => {
																		history.push("/explore/forum/communities/" + joinedCommsDict[id]?.channels[0]?.parent?.slug)
																	}}
																	style={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		padding:
																			"8px 15px",
																		gap: "5px",
																		cursor: "pointer",
																	}}
																>
																	<Avatar
																		alt={
																			joinedCommsDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayName
																		}
																		src={
																			joinedCommsDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayPicture
																				?.thumbUrl ||
																			joinedCommsDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayPicture
																				?.url
																		}
																		style={{
																			width: "25px",
																			height: "25px",
																		}}
																	/>
																	<Typography
																		variant="body1"
																		style={{
																			fontWeight: "500",
																			fontSize: "14px"
																		}}
																	>
																		c/
																		{
																			joinedCommsDict[
																				id
																			]
																				?.channels[0]
																				?.parent
																				?.displayName
																		}
																	</Typography>
																</div>
																<Divider
																	style={{
																		margin: "4px 0 -8px",
																	}}
																/>
															</div>
														}
														commentLimit={5}
														key={
															joinedCommsDict[id]
																._id
														}
														post={
															joinedCommsDict[id]
														}
														// setPostDict={postDict}
														addLink={false}
													/>
												</div>
											)
										) : (
											<></>
										);
									}
								})
							)
						) : (
							<CommunitySearches communities={searchResults} />
						)}
						{nextLoading && (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									marginTop: "1rem",
								}}
							>
								<CircularProgress />
							</div>
						)}
					</Grid>
					<Grid item xs={false} sm={3} md={3}>
						<div>
							<div style={{ marginBottom: '2rem' }}>
								<YourCommunitySidebar selectedProfile={selectedProfile} />
							</div>
							<div >
								<SuggestedCommunitiesSidebar
									selectedProfile={selectedProfile}
								/>
							</div>
							<div>
								<PopularTags />
							</div>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	} else {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					marginTop: "1rem",
				}}
			>
				<CircularProgress />
			</div>
		);
	}
}

export default Forum;
