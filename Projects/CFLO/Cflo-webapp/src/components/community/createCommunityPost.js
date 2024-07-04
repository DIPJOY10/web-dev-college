import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Api from "../../helpers/Api";
import {
	CircularProgress,
	Divider,
	IconButton,
	TextField,
	Tooltip,
} from "@material-ui/core";
import PermMediaOutlinedIcon from "@material-ui/icons/PermMediaOutlined";
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";
import PollOutlinedIcon from "@material-ui/icons/PollOutlined";
import UploadCommunityBox from "./createCommunityPostBox";

const useStyles = makeStyles((theme) => ({
	header: {
		backgroundColor: "white",
		// display: "flex",
		// width: "50%",
		// justifyContent: "space-around",
		margin: "1rem 0",
	},
	body: {
		// backgroundColor: "blue",
	},
	button: {
		borderRadius: "22px",
	},
	avatar: {
		width: "5rem",
		top: "-13px",
		height: "5rem",
		position: "absolute",
		border: "5px solid white",
	},
	communityIntro: {
		display: "flex",
		flexDirection: "column",
		// marginLeft: "10px",
		justifyContent: "flex-end",
	},
	coloumnFlexEnd: {
		display: "flex",
		flexDirection: "column",
		// marginLeft: "10px",
		justifyContent: "flex-end",
	},
	sideBar: {
		backgroundColor: "white",
		margin: "0 1rem",
	},
	createBar: {
		gap: "0.5rem",
		display: "flex",
		backgroundColor: "white",
		alignItems: "center",
		borderRadius: "12px",
		border: "0.5px solid #00000017",
	},
}));

function CreateCommunityPost({ match }) {
	const [community, setCommunity] = useState({});
	const [loading, setLoading] = useState(false);
	var history = useHistory();

	const classes = useStyles();

	async function getCommunity() {
		try {
			setLoading(true);
			const res = await Api.post("community/get", {
				_id: match.params.communityId,
			});
			console.log("res = ", res);
			setCommunity(res.data);
			setLoading(false);
		} catch (error) {
			if (error.response) {
				console.log(error);
			} else if (error.request) {
				console.log(error);
			} else {
				console.log(error);
			}
		}
	}
	useEffect(() => {
		getCommunity();
	}, []);

	return (
		<div>
			{loading ? (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</div>
			) : (
				<div>
					<Grid container className={classes.header}>
						<Grid item sm={1} xs={false}></Grid>
						<Grid
							item
							xs={12}
							sm={8}
							style={{
								display: "flex",
								position: "relative",
								padding: "0 1rem",
								justifyContent: "space-between",
							}}
						>
							<Avatar
								imgProps={{
									referrerPolicy: "no-referrer",
								}}
								className={classes.avatar}
								alt={community?.displayName}
							/>
							<div style={{ paddingLeft: "6rem" }}>
								<Typography
									variant="h4"
									component="div"
									style={{ padding: "0.5rem 0 0" }}
								>
									{community?.displayName}
								</Typography>
								<Typography
									variant="subtitle1"
									component="div"
									style={{
										color: "#848484",
										textTransform: "capitalize",
									}}
								>
									{`Created By: ${community?.user?.displayName}`}
								</Typography>
							</div>
						</Grid>
						<Grid item xs={false} sm={4}></Grid>
					</Grid>
					<div className={classes.body}>
						<Grid container>
							<Grid item sm={1} xs={false}></Grid>
							<Grid item sm={8} xs={12}>
								<UploadCommunityBox community={community} />
							</Grid>
							<Grid item sm={3} xs={false}>
								<div className={classes.sideBar}>
									<Typography
										component="div"
										variant="h5"
										style={{
											backgroundColor: "rgb(83 80 80)",
											color: "white",
											padding: "0.5rem",
											fontSize: "1.2rem",
											fontWeight: "500",
											borderRadius: "5px",
											borderBottomLeftRadius: "0",
											borderBottomRightRadius: "0",
										}}
									>
										About Community
									</Typography>
									<div
										style={{
											backgroundColor: "white",
										}}
									>
										<Typography
											variant="body2"
											style={{
												padding: "0.5rem 1rem",
												color: "#848484",
											}}
										>
											{community?.description ||
												"placeholder for description"}
										</Typography>
										<Divider />
										<div>
											<div
												style={{
													padding: "0.5rem 1rem",
												}}
											>
												<Typography
													variant="subtitle2"
													component={"div"}
												>
													{community?.joinCount}
												</Typography>
												<Typography
													variant="subtitle2"
													component={"div"}
												>
													Members of{" "}
													{community?.displayName}
												</Typography>
											</div>
											<Divider />
											<div
												style={{
													display: "flex",
													padding: "0.5rem 1rem",
												}}
											>
												<Typography
													variant="subtitle1"
													style={{
														textTransform:
															"capitalize",
													}}
												>
													Community Type :{" "}
													{community?.communityType}
												</Typography>
											</div>
											<Divider />
											<div
												style={{
													padding: "0.5rem 1rem",
													display: "flex",
												}}
											>
												<CakeOutlinedIcon />
												<Typography variant="subtitle1">
													Created{" "}
													{new Date(
														`${community?.createdAt}`
													).toLocaleString(
														"default",
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														}
													)}
												</Typography>
											</div>
										</div>
									</div>
								</div>
							</Grid>
						</Grid>
					</div>
				</div>
			)}
		</div>
	);
}

export default CreateCommunityPost;
