import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import {
	Button,
	Card,
	CardActionArea,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Menu,
	MenuItem,
	Snackbar,
	Typography,
} from "@material-ui/core";
import IssueGraph from "./issue.graph";
import useGetProject from "./useGetProject";
import AddIcon from "@material-ui/icons/Add";
import { Loadinglogo } from "../../helpers/loadinglogo";
import ProfileAppbar from "../profile/profile.appbar";
import dfs from "./graph.dfs";
import { MarkerType } from "react-flow-renderer";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Api from "../../helpers/Api";
import { useDispatch } from "react-redux";
import { Alert } from "@material-ui/lab";

const drawerWidth = "17rem";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		height: "100vh",
		marginTop: "8vh",
		// justifyContent: "center",
		alignItems: "center",
	},
	drawer: {
		[theme.breakpoints.up("md")]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		[theme.breakpoints.up("md")]: {
			display: "none",
			color: "#000",
			backgroundColor: "#fff",
		},
	},
	menuButton: {
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
	},
	graphArea: {
		[theme.breakpoints.up("sm")]: {
			marginTop: "7vh",
			width: `calc(100% - 13rem)`,
			height: "85vh",
		},
		[theme.breakpoints.down("sm")]: {
			width: `100%`,
			height: "80vh",
			marginTop: "6vh",
		},
	},
	// necessary for content to be below app bar
	// toolbar: theme.mixins.toolbar,
	drawerPaper: {
		[theme.breakpoints.up("sm")]: {
			marginTop: "7vh",
		},
		width: `min(${drawerWidth},66%)`,
		padding: "0.5rem 0 4rem 0",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}));

const IssueTimeline = (props) => {
	const { profileId } = useParams();
	const { window } = props;
	const position = { x: 0, y: 0 };
	const edgeType = "smoothstep";
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const dispatch = useDispatch();
	const [anchorElMenu, setAnchorElMenu] = React.useState(null);
	const [openMenu, setOpenMenu] = React.useState(false);
	const [initialNodes, setInitialNodes] = useState([]);
	const [initialEdges, setInitialEdges] = useState([]);
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [openSnack, setOpenSnack] = React.useState(false);
	const [successState, setSuccessState] = React.useState("");
	const [menuObj, setMenuObj] = React.useState(null);
	const [error, setError] = React.useState("");
	const [openDialog, setOpenDialog] = React.useState(false);

	const handleClickSnack = (err) => {
		setOpenSnack(true);
		setError(err);
	};

	const handleCloseSnack = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnack(false);
		setSuccessState("");
	};
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};
	const { loading, projectArray } = useGetProject(profileId);

	const handleClickMenu = (event, Obj) => {
		setAnchorElMenu(event.currentTarget);
		setMenuObj(Obj);
		setOpenMenu(true);
	};
	// console.log(projectArray);
	const setNodesandEdges = (obj) => {
		let pathsArr = [];
		let { arr, issueReverseDict } = dfs(obj?.units);
		pathsArr = arr;
		// arr is array of arrays denoting all paths in graph with node nameing as 0 to n
		let maxValue = 0;
		let maxIndex = 0;
		pathsArr.map((path, idx) => {
			let temp = 0;
			path.map((nodes) => {
				if (nodes != 0 && nodes != obj?.units.length + 1) {
					let issue = obj?.units[nodes - 1]?.issue;
					// console.log("obj=", obj, nodes);

					// add a check here for actual finish and real finish
					temp =
						temp +
						parseInt(
							new Date(issue?.actualFinish) -
								new Date(issue?.actualStart)
						);
				}
			});
			if (temp > maxValue) {
				maxValue = temp;
				maxIndex = idx;
			}
		});
		let critical_path = new Array(); // stores issue id of on critical path
		pathsArr[maxIndex].map((nodes) => {
			if (nodes != 0 && nodes != obj?.units.length + 1) {
				critical_path.push(issueReverseDict[nodes]);
			}
		});

		let nodes = [
			{
				id: "start",
				type: "input",
				data: {
					label: "Start",
					issue: {
						_id: "start",
						title: "Start",
						template: { title: "Start" },
					},
				},
				position,
				style: { backgroundColor: "#53d769" },
			},
			...obj?.units.map((unitObj) => {
				let issueObj = unitObj?.issue;
				let status = issueObj?.template?.pipeline.filter(
					(pobj) => pobj?._id == issueObj?.status
				)[0];
				return {
					id: issueObj._id,
					data: {
						label: `${issueObj.title} (${status?.text})`,
						issue: issueObj,
					},
					position,
					style: critical_path.includes(issueObj?._id)
						? {
								border: "2px solid #fc3158",
								backgroundColor: status?.color,
						  }
						: { backgroundColor: status?.color },
				};
			}),
			{
				id: "finish",
				type: "output",
				data: {
					label: "Finish",
					issue: {
						_id: "finish",
						title: "Finish",
						template: { title: "Finish" },
					},
				},
				position,
				style: { backgroundColor: "rgb(239 85 5)" },
			},
		];
		// console.log("nodes", nodes);
		let tempedges = obj?.units.map((obj) => {
			return {
				_id: obj?.issue?._id,
				source: obj?.connectedToStart
					? ["start", ...obj?.source]
					: [...obj?.source],
				destination: obj?.connectedToEnd
					? ["finish", ...obj?.destination]
					: [...obj?.destination],
			};
		});
		let edges = [
			...tempedges.map((Obj, indexid) => {
				return [
					...Obj.source.map((sid, index) => {
						return {
							id: `${indexid}${index}${Obj._id}`,
							source: sid,
							target: Obj._id,
							type: edgeType,
							animated: false,
							markerEnd: {
								type: MarkerType.ArrowClosed,
							},
						};
					}),
					...Obj.destination.map((did, idx) => {
						return {
							id: `${indexid}${Obj._id}${idx}`,
							source: Obj._id,
							target: did,
							type: edgeType,
							animated: false,
							markerEnd: {
								type: MarkerType.ArrowClosed,
							},
						};
					}),
				];
			}),
		].flat(3);
		const filterEdge = edges.filter(
			(value, index, self) =>
				index ===
				self.findIndex(
					(t) =>
						t.source === value.source && t.target === value.target
				)
		);
		// console.log(filterEdge);
		setInitialNodes([...nodes]);
		setInitialEdges([...filterEdge]);
	};
	console.log("nodes = ", initialNodes, initialEdges);
	const deleteContract = async () => {
		setOpenDialog(false);
		const response = await Api.post("issue/project/delete", {
			_id: menuObj?._id,
		});
		// add modal and then update project arr instead of reloading
		if (response?.success) {
			setSuccessState("Task Map Deleted Successfully");
			setTimeout(() => {
				history.go(0);
			}, 1500);
		} else {
			handleClickSnack(response?.data);
		}
	};

	const drawer = (
		<div
			style={{
				overflowY: "scroll",
				paddingBottom: "3rem",
			}}
		>
			<Hidden mdUp implementation="css">
				<Button
					endIcon={<ArrowForwardIosIcon />}
					onClick={handleDrawerToggle}
				>
					Collapse
				</Button>
				<Divider />
				<Button
					fullWidth
					startIcon={<AddIcon />}
					onClick={() => {
						history.push("/issue/timeline/" + profileId + "/new");
					}}
				>
					Create New Task Map
				</Button>
			</Hidden>
			{projectArray ? (
				projectArray.length == 0 ? (
					<div
						style={{
							display: "flex",
							height: "90vh",
							width: "100%",
							alignItems: "center",
							padding: "1.5rem",
						}}
					>
						<Typography
							variant="h5"
							style={{ color: "#bdbdbd" }}
							align="center"
						>
							You dont have any existing Task Maps. Tap on Create
							new Task Map to create one.
						</Typography>
					</div>
				) : (
					<div style={{ marginTop: "1.5vh" }}>
						<Menu
							id="simple-menu"
							anchorEl={anchorElMenu}
							keepMounted
							open={Boolean(anchorElMenu)}
							onClose={() => {
								setAnchorElMenu(null);
								setMenuObj(null);
							}}
						>
							<MenuItem>
								<Button
									fullWidth
									startIcon={<UpdateIcon />}
									color="inherit"
									onClick={() => {
										var path = `/issue/timeline/${profileId}/update/${menuObj?._id}`;
										history.push(path);
									}}
								>
									Update Task Map
								</Button>
							</MenuItem>
							<MenuItem>
								<Button
									fullWidth
									startIcon={<DeleteIcon />}
									color="inherit"
									onClick={() => {
										setOpenDialog(true);
										setAnchorElMenu(null);
									}}
								>
									Delete Task Map
								</Button>
							</MenuItem>
						</Menu>
						{projectArray.map((obj) => {
							return (
								<Card>
									<CardActionArea
										onClick={() => setNodesandEdges(obj)}
										style={{ padding: "1rem 0.5rem" }}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<Typography
												gutterBottom
												variant="h6"
												component="h2"
												style={{
													overflowWrap: "anywhere",
												}}
											>
												{obj?.title}
											</Typography>
											<IconButton
												style={{ padding: "5px" }}
												onClick={(event) =>
													handleClickMenu(event, obj)
												}
											>
												<MoreVertIcon />
											</IconButton>
										</div>
										<Typography
											variant="body2"
											color="textSecondary"
											component="p"
										>
											Shared With{" "}
											{`${obj?.shared.map((share) => {
												return share?.parent
													?.displayName;
											})}`}
										</Typography>
									</CardActionArea>
								</Card>
							);
						})}
					</div>
				)
			) : null}
		</div>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<div>
			{loading ? (
				<Loadinglogo />
			) : (
				<div>
					<ProfileAppbar
						name={"Task Maps"}
						btns={
							<>
								<Hidden mdUp implementation="css">
									<IconButton
										color="inherit"
										aria-label="open drawer"
										edge="end"
										onClick={handleDrawerToggle}
										className={classes.menuButton}
									>
										<MenuIcon />
									</IconButton>
								</Hidden>
								<Hidden mdDown implementation="css">
									<Button
										fullWidth
										color="primary"
										variant="contained"
										startIcon={<AddIcon />}
										onClick={() => {
											history.push(
												"/issue/timeline/" +
													profileId +
													"/new"
											);
										}}
									>
										Create New Task Map
									</Button>
								</Hidden>
							</>
						}
					/>
					<nav
						className={classes.drawer}
						aria-label="mailbox folders"
					>
						{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
						<Hidden mdUp implementation="css">
							<Drawer
								container={container}
								variant="temporary"
								anchor={"right"}
								open={mobileOpen}
								onClose={handleDrawerToggle}
								classes={{
									paper: classes.drawerPaper,
								}}
								ModalProps={{
									keepMounted: true, // Better open performance on mobile.
								}}
							>
								{drawer}
							</Drawer>
						</Hidden>
						<Hidden smDown implementation="css">
							<Drawer
								anchor={"right"}
								classes={{
									paper: classes.drawerPaper,
								}}
								variant="permanent"
								open
							>
								{drawer}
							</Drawer>
						</Hidden>
					</nav>
					<Snackbar
						anchorOrigin={{
							horizontal: "right",
							vertical: "top",
						}}
						open={Boolean(successState)}
						autoHideDuration={4000}
						onClose={handleCloseSnack}
					>
						<Alert
							onClose={handleCloseSnack}
							severity="success"
							style={
								Boolean(successState)
									? { zIndex: "340", marginTop: "6vh" }
									: {}
							}
						>
							{successState}
						</Alert>
					</Snackbar>
					<Snackbar
						anchorOrigin={{ horizontal: "right", vertical: "top" }}
						open={openSnack}
						autoHideDuration={4000}
						onClose={handleCloseSnack}
					>
						<Alert
							onClose={handleCloseSnack}
							severity="error"
							style={
								openSnack
									? { zIndex: "340", marginTop: "6vh" }
									: {}
							}
						>
							Error: {error}
						</Alert>
					</Snackbar>
					<Dialog
						open={openDialog}
						onClose={() => setOpenDialog(false)}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							Delete {menuObj?.title} ?
						</DialogTitle>
						<DialogContent>
							<DialogContentText style={{ color: "black" }}>
								Are you sure you want to delete{" "}
								<b>{menuObj?.title} </b>. This action is not
								reversible.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => setOpenDialog(false)}
								color="primary"
								variant="contained"
							>
								Cancel
							</Button>
							<Button
								onClick={deleteContract}
								variant="contained"
								style={{
									backgroundColor: "#df342b",
									color: "white",
								}}
								autoFocus
							>
								confirm
							</Button>
						</DialogActions>
					</Dialog>
					;
					<div className={classes.graphArea}>
						<IssueGraph
							initialEdges={initialEdges}
							initialNodes={initialNodes}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

IssueTimeline.propTypes = {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};
export default IssueTimeline;
