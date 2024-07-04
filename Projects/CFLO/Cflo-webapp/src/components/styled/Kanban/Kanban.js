import { Chip } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import React, { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

// export const columnsData = {
// 	1: {
// 		title: "To-do",
// 		items: data,
// 	},
// 	2: {
// 		title: "In Progress",
// 		items: [],
// 	},
// 	3: {
// 		title: "Done",
// 		items: [],
// 	},
// };

const Container = styled("div")({
	display: "flex",
});

const TaskList = styled("div")({
	display: "flex",
	padding: "15px 15px",
	minWidth: "341px",
	background: "#f3f3f3",
	minHeight: "150px",
	borderRadius: "5px",
	flexDirection: "column",
	border: "1px solid rgba(0, 0, 0, 0.23)",
});

const TaskColumnStyles = styled("div")({
	// margin: "8px",
	display: "flex",
	width: "100%",
	gap: "1rem"
});

const Title = styled("span")({
	color: "#10957d",
	background: "rgba(16, 149, 125, 0.15)",
	padding: "2px 10px",
	borderRadius: "5px",
	alignSelf: "flex-start",
});

const Kanban = ({
	columns,
	setColumns,
	onDragEnd,
	containerStyles,
	allColumnStyles,
	columnStyles,
	itemStyles,
	dragDirection,
	chipTitle, // bool flag. if true then send object in place of title field named chipTitle  containing title, backgroundColor, color, size.
}) => {
	const onDragEndDefault = (result, columns, setColumns) => {
		if (!result.destination) return;
		const { source, destination } = result;
		if (source.droppableId !== destination.droppableId) {
			const sourceColumn = columns[source.droppableId];
			const destColumn = columns[destination.droppableId];


			const sourceItems = [...sourceColumn.items];
			const destItems = [...destColumn.items];
			const [removed] = sourceItems.splice(source.index, 1);
			destItems.splice(destination.index, 0, removed);
			setColumns({
				...columns,
				[source.droppableId]: {
					...sourceColumn,
					items: sourceItems,
				},
				[destination.droppableId]: {
					...destColumn,
					items: destItems,
				},
			});
		} else {
			const column = columns[source.droppableId];
			const copiedItems = [...column.items];
			const [removed] = copiedItems.splice(source.index, 1);
			copiedItems.splice(destination.index, 0, removed);
			setColumns({
				...columns,
				[source.droppableId]: {
					...column,
					items: copiedItems,
				},
			});
		}
	};
	return (
		<DragDropContext
			onDragEnd={(result) =>
				onDragEnd
					? onDragEnd(result, columns, setColumns)
					: onDragEndDefault(result, columns, setColumns)
			}
		>
			<Container style={containerStyles ? containerStyles : {}}>
				<TaskColumnStyles
					style={
						allColumnStyles
							? allColumnStyles
							: {
								flexWrap: "wrap",
								gap: "17px",
								// justifyContent: "space-around",
							}
					}
				>
					{(Object.entries(columns) || []).map(
						([columnId, column], index) => {
							return (
								<Droppable
									direction={
										dragDirection
											? dragDirection
											: "horizontal"
									}
									key={columnId}
									droppableId={columnId}
								>
									{(provided) => (
										<TaskList
											style={columnStyles}
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											{chipTitle ? (
												<div>
													<Chip
														label={`${column?.chipTitle
															?.title
															} (${(column.items || [])
																.length
															})`}
														style={{
															color: column
																?.chipTitle
																?.color,
															backgroundColor:
																column
																	?.chipTitle
																	?.backgroundColor,
														}}
														size={
															column?.chipTitle
																?.size
														}
													/>
												</div>
											) : (
												<Title>{column?.title}</Title>
											)}
											<div style={itemStyles}>
												{(column.items || []).map(
													(item, index) => (
														<TaskCard
															key={index}
															item={item}
															index={index}
														/>
													)
												)}
											</div>
											{provided.placeholder}
										</TaskList>
									)}
								</Droppable>
							);
						}
					)}
				</TaskColumnStyles>
			</Container>
		</DragDropContext>
	);
};

export default Kanban;
