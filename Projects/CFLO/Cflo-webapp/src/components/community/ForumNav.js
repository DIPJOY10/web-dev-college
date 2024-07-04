import React, { useEffect, useState } from "react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useDebounce } from "react-use";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {
	Avatar,
	Button,
	ClickAwayListener,
	IconButton,
	InputAdornment,
	InputBase,
	Paper,
	Popper,
	TextField,
	Tooltip,
	Typography,
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import SelectedCommunityDropDown from "./SelectedCommunityDropDown";
import CreateCommunity from "./CreateCommunity";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory, useLocation } from "react-router-dom";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import Api from "../../helpers/Api";

const styleProps = {
	lightGray: "#ededed",
};

const useStyle = makeStyles((theme) => ({
	root: {
		// display: "flex",
		// display: "flex",
		// justifyContent: "space-between",
		// rowGap: "10px",
		padding: "3px 10px",
		backgroundColor: "white",
		border: "1.5px solid rgba(0, 0, 0, 0.12)",
		borderRadius: "7px",
		boxShadow: "none",
	},
	navOptions: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		// // rowGap: "10px",
		// padding: "10px",
		// backgroundColor: "white",
		// border: "1px solid lightgray",
		// // borderRadius: "2px",
	},
	navOption: {
		// backgroundColor: "white",
		// color: "gray",
		borderRadius: "20px",
		// paddingRigt: "8px",
		// paddingLeft: "8px",
		fontSize: "14px",
		textTransform: "none",
		boxShadow: "none",
		// marginRight: "10px",
	},
	navOptionIcon: {
		marginRight: "7px",
		fontSize: "20px",
	},
	navSelect: {
		border: "none",
	},
	AutocompleteAvatar: {
		width: "25px",
		height: "25px",
		marginTop: "0px",
		flexShrink: "0",
		marginRight: "8px",
	},
	text: {
		flexGrow: 1,
		alignSelf: "center",
	},
	iconSelected: {
		width: 17,
		height: 17,
		marginRight: 5,
		marginLeft: -2,
	},
	iconSelectedComms: {
		width: 17,
		height: 17,
	},
	tag: {
		marginTop: 3,
		height: 20,
		padding: ".15em 4px",
		fontWeight: 600,
		lineHeight: "15px",
		borderRadius: 2,
	},
	popper: {
		border: "1px solid rgba(27,31,35,.15)",
		boxShadow: "0 3px 12px rgba(27,31,35,.15)",
		borderRadius: 3,
		width: 300,
		zIndex: 1,
		fontSize: 13,
		color: "#586069",
		backgroundColor: "#f6f8fa",
	},
	header: {
		borderBottom: "1px solid #e1e4e8",
		padding: "8px 10px",
		fontWeight: 600,
	},
	inputBase: {
		padding: 10,
		width: "100%",
		borderBottom: "1px solid #dfe2e5",
		"& input": {
			borderRadius: 4,
			backgroundColor: theme.palette.common.white,
			padding: 8,
			transition: theme.transitions.create([
				"border-color",
				"box-shadow",
			]),
			border: "1px solid #ced4da",
			fontSize: 14,
			"&:focus": {
				boxShadow: `${alpha(
					theme.palette.primary.main,
					0.25
				)} 0 0 0 0.2rem`,
				borderColor: theme.palette.primary.main,
			},
		},
	},
	paper: {
		boxShadow: "none",
		margin: 0,
		color: "#586069",
		fontSize: 13,
	},
	option: {
		minHeight: "auto",
		alignItems: "flex-start",
		padding: 8,
		'&[aria-selected="true"]': {
			backgroundColor: "transparent",
		},
		'&[data-focus="true"]': {
			backgroundColor: theme.palette.action.hover,
		},
	},
	popperDisablePortal: {
		position: "relative",
	},
	color: {
		width: 14,
		height: 14,
		flexShrink: 0,
		borderRadius: 3,
		marginRight: 8,
		marginTop: 2,
	},
	text: {
		flexGrow: 1,
	},
	close: {
		opacity: 0.6,
		width: 18,
		height: 18,
	},
	searchIcon: {
		color: "black",
	},
}));

function ForumNav({
	adminProfiles,
	selectedProfile,
	setSelectedProfile,
	loading,
}) {
	const classes = useStyle();
	const [navValue, setNavValue] = useState("left");
	const history = useHistory();
	const { forum } = useSelector((state) => state);
	const { joinedCommunitiesIds, joinedCommunitiesDict } = forum;
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [anchorElComms, setAnchorElComms] = React.useState(null);
	const [openCreate, setOpenCreate] = useState(false);
	const location = useLocation();
	const pathname = location["pathname"];
	const [searchClick, setSearchClick] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	var CommsOptions = [
		{
			displayName: "New Community",
			displayPicture: { thumbUrl: <AddIcon /> },
			_id: "createNew",
			slug: "createNew",
		},
		...Object.values(joinedCommunitiesDict),
	];

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClickComms = (event) => {
		setAnchorElComms(event.currentTarget);
	};

	const handleClose = (event, reason) => {
		if (reason === "toggleInput") {
			return;
		}
		if (anchorEl) {
			anchorEl.focus();
		}
		setAnchorEl(null);
	};
	const handleCloseComms = (event, reason) => {
		if (reason === "toggleInput") {
			return;
		}
		if (anchorElComms) {
			anchorElComms.focus();
		}
		setAnchorElComms(null);
	};
	const handleGotoCommunity = (slug) => {
		if (slug == "createNew") {
			setOpenCreate(true);
			// open box
		} else {
			history.push(`/explore/forum/communities/${slug}`);
		}
	};

	useEffect(() => {
		if (history.location.search) {
			setSearchQuery(decodeURI(history.location.search.slice(1)));
		}
	}, []);

	const open = Boolean(anchorEl);
	const openComms = Boolean(anchorElComms);

	const handleKeyPress = (event) => {
		if (event?.key === "Enter") {
			history.push({
				pathname: pathname,
				search: searchQuery,
			});
		}
	};

	return (
		<Paper className={classes.root}>
			<div className={classes.navOptions}>
				<div
					onClick={handleClick}
					style={{ cursor: "pointer", flexBasis: "5%" }}
				>
					<Avatar src={selectedProfile?.displayPicture?.thumbUrl} />
				</div>
				<div style={{ flexBasis: "95%" }}>
					<div
						style={{
							padding: "0 1rem",
							gap: "5px",
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<ClickAwayListener
							onClickAway={() => {
								setSearchClick(false);
							}}
						>
							<TextField
								onKeyPress={handleKeyPress}
								label="Search"
								onClick={() => setSearchClick(true)}
								placeholder="Search Community Here"
								type="text"
								// sx={{ width: "100%", margin: "1.2rem" }}
								variant="outlined"
								style={
									searchClick
										? {
											width: "90%",
											transition: "width 0.5s",
										}
										: {
											width: "67%",
											transition: "width 0.5s",
										}
								}
								margin="normal"
								onChange={(e) => setSearchQuery(e.target.value)}
								value={searchQuery}
								// onKeyPress={handleKeypress}
								InputProps={{
									startAdornment: (
										<InputAdornment
											position="start"
											style={
												!searchClick
													? {
														color: "#c4c4c4",
														transition:
															"color 0.5s ease",
													}
													: {
														transition:
															"color 0.5s ease",
													}
											}
											className={classes.searchIcon}
										>
											c/
										</InputAdornment>
									),
									endAdornment: (
										<>
											<IconButton
												style={
													searchQuery
														? {
															padding: "2px",
														}
														: { display: "none" }
												}
												aria-label="toggle password visibility"
												onClick={() => {
													setSearchQuery("");
												}}
											>
												<ClearIcon />
											</IconButton>

											<IconButton
												style={{ padding: "2px" }}
												aria-label="toggle password visibility"
												onClick={() => {
													history.push({
														pathname: pathname,
														search: searchQuery,
													});
												}}
											>
												<SearchIcon />
											</IconButton>
										</>
									),
								}}
							/>
						</ClickAwayListener>

						{/* <div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-end",
							}}
						>
							<Button
								onClick={handleClickComms}
								style={{
									textTransform: "none",
									whiteSpace: "nowrap",
								}}
								color="default"
								variant="outlined"
								endIcon={<KeyboardArrowDownIcon />}
							>
								<Typography
									style={
										searchClick
											? {
												width: 0,
												overflow: "hidden",
												transition: "width 0.5s",
											}
											: {
												width: "auto",
												transition: "width 0.5s",
											}
									}
								>
									{"Your Communities"}
								</Typography>
							</Button>
						</div> */}
					</div>
				</div>

				{/* <div
					style={{
						display: "flex",
						alignItems: "center",
						flexBasis: "15%",
					}}
				>
					<CreateCommunity
						className={classes.navOption}
						buttonText={<>New</>}
						startIcon={<AddIcon />}
					/>
				</div> */}

				{/* <Button
					variant="contained"
					color="secondary"
					className={classes.navOption}
				>
					<FontAwesomeIcon
						className={classes.navOptionIcon}
						icon={faRocket}
						// size="md"
					/>{" "}
					New
				</Button> */}
			</div>
			{/* <SelectedCommunityDropDown /> */}
			<div>
				<Popper
					open={open}
					anchorEl={anchorEl}
					placement="bottom-start"
					className={classes.popper}
				>
					<div className={classes.header}>Select A Profile</div>
					<Autocomplete
						open
						onClose={handleClose}
						autoSelect={false}
						options={adminProfiles}
						disablePortal
						classes={{
							paper: classes.paper,
							option: classes.option,
							popperDisablePortal: classes.popperDisablePortal,
						}}
						renderTags={() => null}
						loading={loading}
						loadingText={"Loading..."}
						value={selectedProfile}
						onChange={(event, newValue) => {
							setSelectedProfile(newValue);
						}}
						noOptionsText="No Profiles Found"
						getOptionLabel={(option) => option.displayName}
						renderOption={(option, { selected }) => (
							<div style={{ display: "flex" }}>
								<DoneIcon
									className={classes.iconSelected}
									style={{
										visibility: selected
											? "visible"
											: "hidden",
									}}
								/>
								<Avatar
									className={classes.AutocompleteAvatar}
									src={option?.displayPicture?.thumbUrl}
								/>
								<div className={classes.text}>
									{option?.displayName}
								</div>
							</div>
						)}
						renderInput={(params) => (
							<InputBase
								ref={params.InputProps.ref}
								inputProps={params.inputProps}
								autoFocus
								className={classes.inputBase}
							/>
						)}
					/>
				</Popper>
			</div>
			<div>
				<Popper
					open={openComms}
					anchorEl={anchorElComms}
					placement="bottom-start"
					className={classes.popper}
				>
					{/* <div className={classes.header}>Select A Profile</div> */}
					<Autocomplete
						open={openComms}
						onClose={handleCloseComms}
						autoSelect={false}
						options={CommsOptions}
						disablePortal
						classes={{
							paper: classes.paper,
							option: classes.option,
							popperDisablePortal: classes.popperDisablePortal,
						}}
						renderTags={() => null}
						// loading={loading}
						// loadingText={"Loading..."}
						// value={selectedProfile}
						onChange={(event, newValue) => {
							handleGotoCommunity(newValue?.slug);
						}}
						noOptionsText="Loading ..."
						getOptionLabel={(option) => option.displayName}
						renderOption={(option, { selected }) => (
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
									alignItems: "center",
								}}
							>
								{option?._id == "createNew" ? (
									<Avatar
										style={{ backgroundColor: "white" }}
										className={classes.AutocompleteAvatar}
										alt={option?.displayName}
									>
										<AddIcon style={{ color: "black" }} />
									</Avatar>
								) : (
									<Avatar
										className={classes.AutocompleteAvatar}
										src={
											option?.displayPicture?.thumbUrl ||
											option?.displayPicture?.url
										}
										alt={option?.displayName}
									/>
								)}
								<div className={classes.text}>
									{option?.displayName}
								</div>

								<OpenInBrowserIcon
									style={
										option?._id == "createNew"
											? { display: "none" }
											: {}
									}
									className={classes.iconSelectedComms}
								/>
							</div>
						)}
						renderInput={(params) => (
							<InputBase
								ref={params.InputProps.ref}
								inputProps={params.inputProps}
								autoFocus
								className={classes.inputBase}
							/>
						)}
					/>
				</Popper>
				<CreateCommunity open={openCreate} setOpen={setOpenCreate} />
			</div>
		</Paper>
	);
}

export default ForumNav;
