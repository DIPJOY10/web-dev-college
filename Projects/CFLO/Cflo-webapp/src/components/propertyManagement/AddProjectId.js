import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
	updateRentalRelationUnit,
	getProjectIdCode,
	updateProject,
} from "./apiCall";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddProjectId(props) {
	const history = useHistory();
	const classes = useStyles();
	const { teamId } = useParams();
	const { team, setTeam, newID } = props;
	const { auth } = useSelector((state) => state);
	const [open, setOpen] = useState(false);

	const [projectIdCode, setProjectIdCode] = useState("");
	const [alreadyExist, setAlreadyExist] = useState(false);
	const [alertBool, setAlertBool] = useState(false);
	const [availble, setAvailable] = useState(false);

	useEffect(() => {
		setProjectIdCode(team?.parent?.projectIdCode);
	}, [team]);

	const handleCloseAlert = () => {
		setAlertBool(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const addNewProjectId = async () => {
		setAvailable(false);
		setAlreadyExist(false);
		let oldProjectIdCode = team?.parent?.projectIdCode;

		if (oldProjectIdCode !== projectIdCode) {
			await getProjectIdCode({ projectIdCode: projectIdCode })
				.then(async (data) => {
					console.log(data);
					if (data.length > 0) {
						setAlreadyExist(true);
					} else {
						if (newID) {
							setAvailable(true);
						} else {
							setAlertBool(true);
						}
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			setOpen(false);
		}
	};

	const finalProjectIdCodeUpdate = async () => {
		await updateProject({
			_id: team?.parent?._id,
			projectIdCode: projectIdCode,
		})
			.then((data) => {
				let oldProject = team?.parent;
				let newProject = {
					...oldProject,
					projectIdCode: projectIdCode,
				};

				let newTeam = {
					...team,
					parent: newProject,
				};

				setTeam(newTeam);
				console.log(newTeam);
				console.log(data);
				setAlertBool(false);
				setOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-around" }}>
				<TextField
					id="outlined-basic"
					size="small"
					label="Project Id"
					variant="outlined"
					style={{ width: "80%" }}
					value={projectIdCode}
					onChange={(e) => {
						setProjectIdCode(e.target.value);
					}}
				/>
				<Button
					variant="contained"
					color="primary"
					disabled={team?.parent?.projectIdCode == projectIdCode}
					onClick={addNewProjectId}
				>
					{newID ? "Check" : "Update ID"}
				</Button>
			</div>
			{alreadyExist && (
				<div style={{ color: "red" }}>
					The Project Id Code is already exist! Please choose another.
				</div>
			)}
			{availble && (
				<div style={{ color: "green" }}>
					This Project Id Code is available!
				</div>
			)}

			<Dialog
				open={alertBool}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseAlert}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle
					id="alert-dialog-slide-title"
					style={{ color: "red" }}
				>
					Alert!!!
				</DialogTitle>
				<DialogContent dividers={true}>
					Your action will change the id code of the project, And
					because of that all Tenants will lose their access of their
					tenant website
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseAlert} color="primary">
						Cancel
					</Button>
					<Button onClick={finalProjectIdCodeUpdate} color="primary">
						Proceed
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
