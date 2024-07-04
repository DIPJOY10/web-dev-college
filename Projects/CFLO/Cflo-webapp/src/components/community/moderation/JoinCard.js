import {
	Avatar,
	Button,
	makeStyles,
	Typography,
	useMediaQuery,
} from "@material-ui/core";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Api from "../../../helpers/Api";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";

const useStylesNew = makeStyles((theme) => ({
	wrapper: {
		"&:hover": {
			backgroundColor: "#d3d3d369",
			cursor: "pointer",
		},
		display: "flex",
		alignItems: "center",
	},
	root: {
		padding: "1rem",
		margin: "0.5rem 0",
		display: "flex",
		borderRadius: "10px",
		justifyContent: "space-between",
		width: "100%",
		[theme.breakpoints.down("xs")]: {
			display: "block",
		},
	},
	ButtonDiv: {
		display: "flex",
		gap: "1rem",
		[theme.breakpoints.down("xs")]: {
			marginTop: "0.5rem",
			paddingLeft: "0.5rem",
		},
	},
	ButtonTagNew: {
		color: "#44a7f1",
		width: "70%",
	},
	ButtonTagProgress: {
		display: "none",
	},
}));

function JoinCard({ join, updateProgress }) {
	const dispatch = useDispatch();
	const classesNew = useStylesNew();
	const { moderation, auth } = useSelector((state) => state);
	const {
		newJoinIds,
		newJoinDict,
		progressJoinIds,
		progressJoinDict,
		acceptedJoinIds,
		acceptedJoinDict,
	} = moderation;

	async function handleAccept() {
		const joinId = join?._id;
		if (!joinId) return;
		console.log("moderationFunctionCalled");
		const joinRes = await Api.post("join/update", {
			_id: join?._id,
			status: "accepted",
		});

		const newDict = { ...newJoinDict };
		newDict[joinId] = undefined;
		const newProgressDict = { ...progressJoinDict };
		newProgressDict[joinId] = undefined;
		const newAcceptedJoinIds = [joinId, ...(acceptedJoinIds || [])];
		const newAcceptedJoinDict = { ...acceptedJoinDict };
		newAcceptedJoinDict[joinId] = joinRes;

		dispatch({
			type: "AddModeration",
			payload: {
				newJoinDict: newDict,
				progressJoinDict: newProgressDict,
				acceptedJoinIds: newAcceptedJoinIds,
				acceptedJoinDict: newAcceptedJoinDict,
			},
		});
		// console.log("moderationAccepted", joinRes);
	}

	async function handleReject() {
		const joinId = join?._id;
		if (!joinId) return;
		console.log("moderationFunctionCalled");
		const joinRes = await Api.post("join/update", {
			_id: join?._id,
			status: "rejected",
		});

		const newDict = { ...newJoinDict };
		newDict[joinId] = undefined;
		const newProgressDict = { ...progressJoinDict };
		newProgressDict[joinId] = undefined;

		dispatch({
			type: "AddModeration",
			payload: {
				newJoinDict: newDict,
				progressJoinDict: newProgressDict,
			},
		});
		// console.log("moderationRejected", joinRes);
	}

	async function handleDelete() {
		const joinId = join?._id;
		if (!joinId) return;
		// console.log("moderationFunctionCalled");
		const joinRes = await Api.post("join/delete", {
			_id: join?._id,
		});

		const newDict = { ...newJoinDict };
		newDict[joinId] = undefined;
		const newProgressDict = { ...progressJoinDict };
		newProgressDict[joinId] = undefined;

		dispatch({
			type: "AddModeration",
			payload: {
				newJoinDict: newDict,
				progressJoinDict: newProgressDict,
			},
		});
		// console.log("moderationDeleted", joinRes);
	}
	const handleClick = () => {
		if (updateProgress) {
			updateProgress(join?._id);
		}
	};
	console.log("join = ", join);
	return (
		<div
			className={classesNew.wrapper}
			onClick={() => {
				if (join?.status == "new") {
					handleClick();
				}
			}}
		>
			<div className={classesNew.root}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
					}}
				>
					<Avatar
						src={join?.profile?.parent?.displayPicture?.thumbUrl}
						alt={join?.profile?.displayName}
					/>
					<div>
						<Typography variant="h6" style={{ fontSize: "1rem" }}>
							{join?.profile?.parent?.displayName}
						</Typography>
						<Typography variant="body2">
							Hi I would like to Join your community
						</Typography>
					</div>
				</div>
				<div className={classesNew.ButtonDiv}>
					<Button
						variant={"contained"}
						onClick={handleAccept}
						color="primary"
					>
						Accept
					</Button>
					<Button variant={"contained"} onClick={handleDelete}>
						Delete
					</Button>
				</div>
			</div>
			<div
				style={
					join?.status == "new"
						? { paddingRight: "5px" }
						: { paddingRight: "5px", minWidth: "3%" }
				}
			>
				<FiberManualRecordIcon
					className={
						join?.status == "new"
							? classesNew.ButtonTagNew
							: classesNew.ButtonTagProgress
					}
				/>
			</div>
		</div>
	);
}

export default JoinCard;
