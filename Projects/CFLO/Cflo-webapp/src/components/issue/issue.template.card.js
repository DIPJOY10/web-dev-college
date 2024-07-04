import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";
import { Chip } from "@material-ui/core";
import Label from "../styled/label/index";
import { Delete } from "@material-ui/icons";
import Api from "../../helpers/Api";

const useStyles = makeStyles((theme) => ({
	root: {
		flex: 1,
		width: "16rem",
		maxWidth: "16rem",
		margin: "1rem 0.5rem",
		display: "flex",
		flexDirection: "column",
		marginTop: "0.5rem",
		padding: "0.5rem",
	},
	rootSelected: {
		flex: 1,
		width: "16rem",
		maxWidth: "16rem",
		margin: "1rem 0.5rem",
		display: "flex",
		flexDirection: "column",
		marginTop: "0.5rem",
		padding: "0.5rem",
		backgroundColor: "cornflowerblue",
		color: "aliceblue",
	},
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},
	titleText: {
		fontSize: (props) => {
			if (props.size == "xs") {
				return "0.9rem";
			} else {
				return "1.2rem";
			}
		},
		fontWeight: "600",
		textTransform: "capitalize",
	},
	nameText: {
		fontSize: (props) => {
			if (props.size == "xs") {
				return "0.8rem";
			} else {
				return "1.0rem";
			}
		},
		fontWeight: "500",
	},

	avatarBox: {
		width: "2rem",
		padding: "0.7rem",
		[theme.breakpoints.down("sm")]: {
			padding: "0.3rem",
			marginRight: "0.4rem",
		},
	},

	textBox: {
		flex: 1,
		flexDirection: "column",
	},
}));

export default function IssueTemplateCard(props) {
	const {
		template,
		onSelect,
		size,
		onDelete,
		setCurrentTemplate,
		currentTemplate,
	} = props;
	const templateId = template?._id;
	const history = useHistory();
	const classes = useStyles({ size });
	const user = template?.user;
	const dispatch = useDispatch();
	const displayName = user?.displayName;
	const displayPicture = user?.displayPicture;
	const pipeline = template?.pipeline || [];
	const handleCurrentTemplateChange = () => {
		if (currentTemplate == templateId) {
			setCurrentTemplate("");
		} else {
			setCurrentTemplate(templateId);
		}
	};
	return (
		<Paper
			className={
				currentTemplate == templateId
					? classes.rootSelected
					: classes.root
			}
			elevation={8}
		>
			<ButtonBase
				className={classes.row}
				onClick={handleCurrentTemplateChange}
			>
				<div className={classes.textBox}>
					<div className={classes.row}>
						<div className={classes.row}>
							<Typography className={classes.titleText}>
								<b>{template?.title?.slice(0, 40)}</b>
							</Typography>
						</div>

						{props.size == "xs" ? null : (
							<EditIcon
								onClick={() => {
									var path =
										"/issue/template/" +
										templateId +
										"/view";
									history.push(path);
								}}
							/>
						)}
						<Delete
							onClick={() => {
								onDelete(templateId);
							}}
						/>
					</div>
				</div>
			</ButtonBase>
		</Paper>
	);
}
