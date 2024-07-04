import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import cx from "clsx";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Api from "../../helpers/Api";
import configObject from "../../config";
import arrayToReducer from "../../helpers/arrayToReducer";
import ReplayIcon from "@material-ui/icons/Replay";
import {
	CircularProgress,
	IconButton,
	ListItem,
	useMediaQuery,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	InputAdornment,
	// TextField,
	// Typography,
} from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import CloseIcon from "@material-ui/icons/Close";
import IssueTemplateViewManager from "./issue.template.view.manager";

const useStyles = makeStyles((theme) => ({
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},

	iconBtn: {
		backgroundColor: "white",
		marginLeft: "0.2rem 0",
	},
	reloadPaper: {
		backgroundColor: "white",
		boxShadow: "0 3px 12px rgba(27,31,35,.15)",
		height: "2.4rem",
		width: "2.4rem",
		justifyContent: "center",
		alignItems: "center",
		marginRight: "1rem",
	},
}));

export default function TemplateAttach(props) {
	const classes = useStyles();
	const { row, col } = props;
	const history = useHistory();
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => state);
	const {
		template,
		status,
		onSelect,
		profileId,
		style = {
			width: "15rem",
			backgroundColor: "white",
		},
		type,
		platform,
	} = props;
	const user = auth?.user;
	const oldTemplates = props.templates || [];
	const [currentTemplate, setCurrentTemplate] = useState(template);
	const [currentTemplateId, setCurrentTemplateId] = useState(null);
	const [open, setOpen] = useState(false);
	const [templates, setTemplates] = useState(oldTemplates);
	const pipeline = template?.pipeline || [];
	const [loading, setLoading] = useState(false);



	const handleClickOpen = (id) => {
		setCurrentTemplateId(id);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setCurrentTemplateId(null);
		history.go(0);
	};


	const getTemplates = async () => {
		setLoading(true);
		const res = await Api.post("issue/template/getAll", {
			profileId: profileId,
		});
		setLoading(false);

		if (res?.data) {
			const data = res?.data;
			setCurrentTemplate(
				data.filter((obj) => obj?._id == template?._id)[0]
			);
			setTemplates(data);
		}
	};
	console.log(type, "Type");
	const getTypeTemplates = async () => {
		setLoading(true);
		const res = await Api.post("issue/template/getTypeAll", {
			profileId: profileId,
			type
		});
		setLoading(false);

		if (res?.data) {
			const data = res?.data;
			setCurrentTemplate(
				data.filter((obj) => obj?._id == template?._id)[0]
			);
			setTemplates(data);
		}
	};

	const onNew = async () => {
		const res = await Api.post("issue/template/create", {
			profile: profileId,
			shared: [profileId],
			managers: [user?.profile],
			type: type,
			platform: platform,
		});

		const data = res?.data;

		if (data) {
			var path =
				configObject.BASE_URL + "issue/template/" + data?._id + "/view";
			window.open(path, "_blank");
			// handleClickOpen(data?._id);
			dispatch({
				type: "AddApiAlert",
				payload: {
					success: true,
					message: "Template created successfully",
				},
			});

		}
		else {
			dispatch({
				type: "AddApiAlert",
				payload: {
					success: false,
					message: "Template create failed",
				},
			});
		}
	};

	const defaultProps = {
		value: template,
		options: [
			{
				_id: "New",
				title: "Add New Template",
			},
			...templates,
		],
		style,
		getOptionLabel: (option) => option?.title,
		getOptionSelected: (option, value) => option?._id == value?._id,
		onChange: (event, value) => {
			if (value?._id == "New") {
				onNew();
			} else {
				if (onSelect) {
					onSelect(value);
				}
			}
		},
	};

	const updatedProps = () => {
		setTemplates(oldTemplates);
		if (oldTemplates.length > 0) {
			onSelect(currentTemplate);
		}
	};
	useEffect(() => {
		setCurrentTemplate(template);
	}, [template]);
	useEffect(() => {
		if (currentTemplate == null && templates.length > 0) {
			setCurrentTemplate(templates[0]);
			onSelect(templates[0]);
		}
	}, [templates]);

	useEffect(() => {
		updatedProps();
	}, [oldTemplates?.length]);
	// console.log("template = ", template, templates, currentTemplate);
	return (
		<>
			<ListItem>
				<Autocomplete
					{...defaultProps}
					id="disable-clearable"
					disableClearable
					renderInput={(params) => (
						<TextField
							{...params}
							square
							label={"Template"}
							size="small"
							variant="outlined"
						/>
					)}
				/>

				{loading ? (
					<CircularProgress />
				) : (
					<Paper
						square
						className={classes.reloadPaper}
						variant="outlined"
					>
						<ButtonBase
							onClick={() => {
								// type === "Job" ? getJobTemplates() : getTemplates();
								getTypeTemplates();
							}}
						>
							<CachedIcon
								style={{
									fontSize: "1.8rem",
									fontWeight: "700",
									margin: "0.2rem",
								}}
							/>
						</ButtonBase>
					</Paper>
				)}
			</ListItem>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth={"md"}
				fullWidth
			>
				<DialogTitle style={{ margin: "2%", padding: "0px 9px" }}>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography variant="h6">Edit Template</Typography>
						<CloseIcon
							onClick={handleClose}
							style={{ cursor: "pointer" }}
						/>
					</Grid>
				</DialogTitle>
				<DialogContent>
					<IssueTemplateViewManager
						handleClose={handleClose}
						templateId={currentTemplateId}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
