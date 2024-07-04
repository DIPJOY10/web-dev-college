import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Icon } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},

	unitText: {
		fontWeight: "600",
	},

	unitBlock: {
		maxWidth: "8rem",
		padding: "1rem",
		margin: "0.5rem",
	},
	selected: {
		backgroundColor: "#2196f3bf",
		maxWidth: "8rem",
		padding: "1rem",
		margin: "0.5rem",
	},
}));

export default function RentalUnitList(props) {
	const classes = useStyles();
	const { root, row, unitBlock, unitText } = classes;

	const { units, onClick, selectMode } = props;
	const [selectedNode, setSelectedNode] = useState();

	return (
		<div className={row}>
			{units.map((unit) => {
				return (
					<ButtonBase
						onClick={() => {
							if (onClick) {
								onClick(unit);
								if (selectMode) {
									setSelectedNode(unit?._id);
								}
							}
						}}
						key={unit?._id}
					>
						{selectedNode == unit?._id && (
							<div
								style={{
									backgroundColor: "#fff",
									position: "absolute",
									top: "0",
									right: "0",
								}}
							>
								<Icon
									style={{ display: "flex" }}
									color="secondary"
								>
									<CheckBoxIcon />
								</Icon>
							</div>
						)}
						<Paper
							square
							className={
								selectMode
									? selectedNode == unit?._id
										? classes.selected
										: unitBlock
									: unitBlock
							}
						>
							<Typography className={unitText}>
								{unit?.name}
							</Typography>
							<Typography>
								{unit?.numTenants} Tenant
								{unit?.numTenants > 1 ? "s" : ""}
							</Typography>
						</Paper>
					</ButtonBase>
				);
			})}
		</div>
	);
}
