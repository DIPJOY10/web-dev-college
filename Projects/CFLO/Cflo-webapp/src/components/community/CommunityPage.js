import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Api from "../../helpers/Api";
import {
	CircularProgress, Divider, IconButton, ListItemIcon,
	Menu, MenuItem, TextField, Tooltip, Button
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";
import useGetAdminProfiles from "../profile/useGetAdminProfiles";
import LoadingButton from "../styled/actionBtns/loading.btn";
import CustomBtn from "../styled/CommonComponents/CustomBtn"
import CategoryCreateDialog from "../styled/CommonComponents/Category.Create";
import CategoryFilter from "../styled/CommonComponents/Category.Filter";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CreateNewPost from "../styled/CommonComponents/CreateNewPost";
import moment from "moment";
import { getCommunityCategoryCount, updateCategory } from "./api.call";
import LocationStateFilter from "../styled/CommonComponents/Location.State.Filter";
import { useDebounce } from "react-use";
import DeleteIcon from '@material-ui/icons/Delete';
import CommunityFeeds from "./CommunityFeeds";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import defaultBlogDP from "../../Assets/defaultBlogDP.jpg"
import investmentAnalysis from "../../Assets/investmentAnalysis.png"


const useStyles = makeStyles((theme) => ({
	mainCont: {
		width: "100%",
		height: `calc(100vh - ${theme.appbar.height})`,
		display: "flex",
		justifyContent: "space-between",
		padding: "5px",
	},
	feedCont: {
		width: "56%",
		height: "100%",
		overflowY: "auto",
		padding: "0px 70px",
		"&::-webkit-scrollbar": {
			display: "none"
		},
		scrollbarWidth: "none",
	},
	leftSideCont: {
		width: "23%",
		height: "100%",
		overflowY: "auto",
		paddingLeft: "20px",
		"&::-webkit-scrollbar": {
			display: "none"
		},
		scrollbarWidth: "none",
	},
	rightSideCont: {
		width: "23%",
		height: "100%",
		overflowY: "auto",
		paddingRight: "20px",
		"&::-webkit-scrollbar": {
			display: "none"
		},
		scrollbarWidth: "none",
	},
	sideBar: {
		backgroundColor: "white",
		margin: "0 1rem",
	},
	communityCardHead: {
		backgroundColor: "rgb(83 80 80)",
		color: "white",
		padding: "0.5rem",
		display: "flex",
		alignItems: "center",
		borderTopLeftRadius: "5px",
		borderTopRightRadius: "5px",
	},
	imgAvatar: {
		width: "40px",
		height: "40px",
		objectFit: "cover"
	},
	nameOwnerCont: {
		paddingLeft: '15px',
		"& h3": {
			fontSize: "18px",
			fontWeight: "500"
		},
		"& p": {
			fontSize: "11px",
			fontWeight: "400"
		}
	},

	titleSty: {
		fontSize: "20px",
		// borderBottom: "1px solid #e3e0e0"
	},
	loaderCont: {
		width: "100%",
		borderTop: "1px solid #e3e0e0",
		height: "4px",
	},
	categoryCont: {
		height: "230px",
		width: "100%",
		overflowY: "auto",
		display: "flex",
		alignItems: "flex-start",
		flexDirection: "column",
	},
	filterLocationCont: {
		height: "230px",
		width: "100%",
		overflowY: "auto",
		display: "flex",
		flexDirection: "column",
	},
	categoryTagCont: {
		height: "230px",
		overflowY: "auto"
	},


	aboutCard: {
		borderRadius: "7px",
		boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
		height: "345px",
		backgroundColor: "white",
		position: "relative",
		marginBottom: "20px"
	},
	coverImg: {
		width: "100%",
		height: "100px",
		overflow: "hidden",
	},
	profilePicCont: {
		width: "100%",
		position: "absolute",
		top: "50px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0)"
	},
	profilePic: {
		width: "100px",
		height: "100px",
		borderRadius: "50%",
		border: "7px solid white"
	},
	aboutInfoCont: {
		padding: "50px 15px 0px",
		"& h3": {
			textAlign: "center",
			fontSize: "18px",
			marginBottom: "8px"
		},
		"& p": {
			textAlign: "center",
			color: "#181818",
			fontSize: "13px",
		}
	},
	subCardCont: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-around",
		marginTop: "10px",
		"& div": {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			"& h3": {
				fontSize: "16px",
				marginBottom: "0px"
			}
		}
	},




	locationCont: {
		height: "42%",
		width: "100%",
		padding: "0px 10px"
	},
	categoryHead: {
		display: "flex",
		alignItems: "center",
		paddingRight: "10px",
		justifyContent: "space-between"
	},
	noBorder: {
		border: "none",
	},
	searchText: {
		backgroundColor: "white",
		borderRadius: "12px",
		margin: "0px"
	},
	tagsCont: {
		backgroundColor: "white",
		padding: "0px 0px 10px",
		borderRadius: "7px"
	},
	tagsHead: {
		padding: "7px 10px",
		paddingLeft: "15px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottom: "1px solid rgba(0,0,0,0.2)",
		"& p": {
			fontSize: "18px",
			fontWeight: "500"
		}
	},
	tagSty: {
		padding: "6px 0px",
		paddingLeft: "15px",
		paddingRight: "10px",
		display: "flex",
		height: "35px",
		alignItems: "center",
		justifyContent: "space-between",
		fontSize: "15px",
		fontWeight: "400",
		"& .MuiSvgIcon-root": {
			display: "none"
		},
		"&:hover .MuiSvgIcon-root": {
			display: "flex"
		}
	}
}));

function getTomorrowDateTime() {
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const date = moment(tomorrow).format("YYYY-MM-DDTkk:mm");
	return date;
}

function CommunityPage({ match }) {
	var history = useHistory();
	const classes = useStyles();
	const dispatch = useDispatch();

	const { adminProfiles } = useGetAdminProfiles();
	const { auth } = useSelector((state) => state);
	const { createdFileIds } = useSelector((state) => state.file);
	const { user } = auth;
	const profile = user?.profile;

	const [community, setCommunity] = useState({});
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [isJoin, setIsJoin] = useState(null);
	const [openCategoryCreate, setOpenCategoryCreate] = useState(false)

	// filter create related variables
	const [searchTitle, setSearchTitle] = useState("")
	const [locationTags, setLocationTags] = useState([])
	const [filterCategories, setFilterCategories] = useState([])
	const [filterSelectedCategories, setFilterSelectedCategories] = useState([])
	const [categories, setCategories] = useState([])

	// post create related variables
	const [categoriesStr, setCategoriesStr] = useState([])
	const [selectedCategories, setSelectedCategories] = useState([])
	const [newPostCreate, setNewPostCreate] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [selectedLocationTags, setSelectedLocationTags] = useState(["Florida"])
	const [isPoll, setIsPoll] = useState(false)
	const [pollOptions, setPollOptions] = useState([""]);
	const [pollExireAt, setPollExireAt] = useState(getTomorrowDateTime());




	useEffect(() => {
		if (community?._id) {
			getTagCount()
		}
	}, [community])

	const getTagCount = async () => {
		await getCommunityCategoryCount({ communityId: community?._id })
			.then((data) => {
				console.log(data)
				let arr = data[0]?.category_details
				arr.sort((a, b) => {
					return b.count - a.count;
				})
				setFilterCategories(arr)
			})
			.catch((err) => {

			})
	}

	async function getCommunity() {
		try {
			const res = await Api.post("community/get", {
				communitySlug: match.params.communityNameSlug,
				profile: selectedProfile?.profile || profile,
			});

			setCommunity(res.data);
			setCategories(res?.data?.tags)
			setCategoriesStr(res?.data?.tagStrs)

			if (res?.join?.status == "accepted") {
				setIsJoin(true);
			} else {
				setIsJoin(false);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getCommunity();
	}, []);

	const joinCommunity = async () => {
		const joinRes = await Api.post("join/create", {
			user: selectedProfile?._id,
			profile: selectedProfile?.profile,
			community: community?._id,
			communityProfile: community?.profile,
		});
	};

	// currently not in use
	const checkIsJoin = async () => {
		console.log("communityProfile", community?.profile);
		const isJoinRes = await Api.post("join/isJoined", {
			profile: selectedProfile?.profile,
			communityProfile: community?.profile?._id,
		});
		setIsJoin(Boolean(isJoinRes?.isjoined));
		console.log("res here = ", isJoinRes);
	};

	const removeCategoryTag = async (removeCat) => {
		let updatedCategories = categories.filter((cat) => cat?._id !== removeCat?._id)

		let categoriesId = new Set([])
		let categoriesStr = new Set([]);

		updatedCategories.map((category) => {
			categoriesId.add(category?._id)
			categoriesStr.add(category?.name)
		})

		let categoriesIdArr = [...categoriesId]
		let categoriesStrArr = [...categoriesStr];

		const obj = {
			...community,
			tagStrs: categoriesStrArr,
			tags: categoriesIdArr,
		};

		console.log(obj);

		await updateCategory(obj)
			.then((data) => {
				console.log(data)
				setCommunity(data);
				setCategories(data?.tags)
				setCategoriesStr(data?.tagStrs)
			})
			.catch((err) => {
				console.log(err)
			})

	}

	const addCategoryTag = async (newTag) => {

		const updatedCategories = [...categories, newTag]

		let categoriesId = new Set([])
		let categoriesStr = new Set([]);

		updatedCategories.map((category) => {
			categoriesId.add(category?._id)
			categoriesStr.add(category?.name)
		})

		let categoriesIdArr = [...categoriesId]
		let categoriesStrArr = [...categoriesStr];

		const obj = {
			...community,
			tagStrs: categoriesStrArr,
			tags: categoriesIdArr,
		};

		await updateCategory(obj)
			.then((data) => {
				console.log(data)
				setCommunity(data);
				setCategories(data?.tags)
				setCategoriesStr(data?.tagStrs)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	// currently not in use
	useEffect(() => {
		setSelectedProfile(adminProfiles[0]);
	}, [adminProfiles]);

	// currently not in use
	useEffect(() => {
		checkIsJoin();
	}, [selectedProfile, community]);


	const publish = async () => {
		if (community?.profile?._id && selectedCategories && selectedCategories.length > 0 && description.length > 0 && title.length > 0) {
			let postBody = {
				title,
				description,
				published: true,
				profile: profile,
				tagStrs: selectedCategories,
				stateTags: selectedLocationTags,
				parent: community?._id,
				parentModelName: "Community",
				files: [
					...(Array.isArray(createdFileIds) ? createdFileIds : []),
				],
				channels: [community?.profile?._id],
			};

			if (isPoll) {
				postBody.poll = {};
				postBody.poll.options = pollOptions;
				postBody.poll.expireAt = pollExireAt;
				postBody.poll.user = selectedProfile;
				postBody.poll.profile = selectedProfile?.profile;
				postBody.poll.parentModelName = "Post";
			}
			await Api.post("post/create", postBody);

			//need to add new post
			// await findPostsForScroll()

			dispatch({ type: "FileUploadReset" });
			setNewPostCreate(false)
			setSelectedCategories([])
			setTitle("")
			setDescription("")
			setSelectedLocationTags(["Florida"])
			setIsPoll(false)
			setPollOptions([""]);
			setPollExireAt(getTomorrowDateTime());
		}
	}















	return (
		<div className={classes.mainCont} >
			<div className={classes.leftSideCont} >
				<Accordion
					style={{
						borderRadius: "7px",
						marginBottom: "20px",
						boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)"
					}}
					defaultExpanded
				>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
						style={{ height: "50px", minHeight: "0px" }}
					>
						<h3 className={classes.titleSty}>Category</h3>
					</AccordionSummary>
					<div className={classes.loaderCont} >

					</div>
					<AccordionDetails>
						<div className={classes.categoryCont} >
							<CategoryFilter
								selectedCategories={filterSelectedCategories}
								setSelectedCategories={setFilterSelectedCategories}
								categories={filterCategories}
							/>
						</div>
					</AccordionDetails>
				</Accordion>

				<Accordion
					style={{
						borderRadius: "7px",
						boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)"
					}}
					defaultExpanded
				>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
						style={{ height: "50px", minHeight: "0px" }}
					>
						<h3 className={classes.titleSty}>Location</h3>
					</AccordionSummary>
					<div className={classes.loaderCont} >

					</div>
					<AccordionDetails>
						<div className={classes.filterLocationCont} >
							<LocationStateFilter
								locationTags={locationTags}
								setLocationTags={setLocationTags}
							/>
						</div>
					</AccordionDetails>
				</Accordion>
			</div>

			<div className={classes.feedCont} >
				<div style={{ marginBottom: "15px" }} >
					{newPostCreate ? (<>
						<CreateNewPost
							titlePlaceholder={"Title"}
							descPlaceholder={"What is in your mind"}
							description={description}
							setDescription={setDescription}
							title={title}
							setTitle={setTitle}
							categoriesStr={categoriesStr}
							setCategoriesStr={setCategoriesStr}
							selectedCategories={selectedCategories}
							setSelectedCategories={setSelectedCategories}
							selectedLocationTags={selectedLocationTags}
							setSelectedLocationTags={setSelectedLocationTags}
							isPoll={isPoll}
							setIsPoll={setIsPoll}
							pollOptions={pollOptions}
							setPollOptions={setPollOptions}
							pollExireAt={pollExireAt}
							setPollExireAt={setPollExireAt}
							closeIt={() => { setNewPostCreate(false) }}
							publish={publish}
						/>
					</>) : (
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							value={searchTitle}
							onChange={(e) => { setSearchTitle(e.target.value) }}
							id="phoneNumber"
							disableUnderline={false}
							autoFocus
							className={classes.searchText}
							placeholder="Search or create a post..."
							InputProps={{
								startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
								endAdornment: (<InputAdornment position="end">
									<Button
										variant="contained"
										color="primary"
										startIcon={<PostAddIcon />}
										style={{ borderRadius: "15px" }}
										onClick={() => { setNewPostCreate(true) }}
									>
										New Post
									</Button>
								</InputAdornment>),
								classes: { notchedOutline: classes.noBorder }
							}}
						/>
					)}
				</div>
				{community?._id && (
					<CommunityFeeds
						locationTags={locationTags}
						filterSelectedCategories={filterSelectedCategories}
						searchTitle={searchTitle}
						communityId={community?._id}
					/>
				)}
			</div>

			<div className={classes.rightSideCont} >
				<div className={classes.aboutCard} >
					<div className={classes.coverImg} >
						<img
							src={defaultBlogDP}
							style={{
								width: "100%",
								height: "auto",
								borderTopLeftRadius: "7px",
								borderTopRightRadius: "7px"
							}}
						/>
					</div>
					<div className={classes.profilePicCont} >
						<img
							src={community?.displayPicture?.thumbUrl || community?.displayPicture?.url || investmentAnalysis}
							className={classes.profilePic}
						/>
					</div>
					<div className={classes.aboutInfoCont} >
						<h3>{community?.displayName}</h3>
						<p>{community?.description || "Freelance UX/UI designer, 80+ projects in web design, mobile apps (iOS & android) and creative projects. Open to offers."}</p>
						<div className={classes.subCardCont} >
							<div>
								<h3>{community?.joinCount}</h3>
								<p>Members</p>
							</div>
							<div>
								<h3>{community?.communityType}</h3>
								<p>Type</p>
							</div>
						</div>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "10px" }} >
							<Button
								variant="contained"
								color="primary"
								size="small"
								onClick={joinCommunity}
							>
								{false ? "Updating" : isJoin ? "Leave" : "Join"}
							</Button>
						</div>
					</div>
				</div>
				<div className={classes.tagsCont} >
					<div className={classes.tagsHead} >
						<h3 className={classes.titleSty} >Tags</h3>
						<Button
							variant="contained"
							color="primary"
							size="small"
							startIcon={<AddIcon />}
							onClick={() => { setOpenCategoryCreate(true) }}
						>
							Add Tag
						</Button>
						<CategoryCreateDialog
							openCategoryCreate={openCategoryCreate}
							setOpenCategoryCreate={setOpenCategoryCreate}
							addCategoryTag={addCategoryTag}
						/>
					</div>
					<div className={classes.categoryTagCont} >
						{categories && categories.map((cat) => (
							<div className={classes.tagSty} >
								<p>{cat?.name}</p>
								<DeleteIcon className={classes.deleteIcon} onClick={() => { removeCategoryTag(cat) }} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
export default CommunityPage;