import { makeStyles } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import React from "react";
import { Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles({
	secondaryDetails: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		fontSize: "12px",
		fontWeight: "400px",
	},
	fullWidth: {
		flex: "1 0 100%",
	},
});

const TaskInformation = styled("div")({
	display: "flex",
	marginTop: "15px",
	alignItems: "flex-start",
	borderRadius: "5px",
	width: "100%",
	flexDirection: "column",
	justifyContent: "center",
});

const TaskCard = ({ item, index }) => {
	const { secondaryDetails, fullWidth } = useStyles();
	return (
		<Draggable
			key={item._id}
			draggableId={item._id}
			index={index}
			style={{ width: "100%" }}
			className={fullWidth}
		>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<TaskInformation>
						<p>{item?.title}</p>
						<div style={{ width: "100%" }}>{item?.content}</div>
					</TaskInformation>
				</div>
			)}
		</Draggable>
	);
};

export default TaskCard;
