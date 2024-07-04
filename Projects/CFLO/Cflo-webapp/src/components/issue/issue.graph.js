import React, { useCallback, useState } from "react";
import ReactFlow, {
	addEdge,
	ConnectionLineType,
	useNodesState,
	useEdgesState,
	Controls,
	Background,
	ReactFlowProvider,
	ControlButton,
} from "react-flow-renderer";
import dagre from "dagre";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import "./issue.graph.css";
import {
	ClickAwayListener,
	makeStyles,
	Popper,
	Typography,
} from "@material-ui/core";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	flex: {
		display: "grid",
		gridTemplateColumns: "50% 50%",
		padding: "0.2rem 0",
	},
}));

const IssueGraph = (props) => {
	const { initialNodes, initialEdges } = props;
	const classes = useStyles();
	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));

	const nodeWidth = 172;
	const nodeHeight = 36;

	const getLayoutedElements = (nodes, edges, direction = "TB") => {
		const isHorizontal = direction === "LR";
		dagreGraph.setGraph({ rankdir: direction });

		nodes.forEach((node) => {
			dagreGraph.setNode(node.id, {
				width: nodeWidth,
				height: nodeHeight,
			});
		});

		edges.forEach((edge) => {
			dagreGraph.setEdge(edge.source, edge.target);
		});

		dagre.layout(dagreGraph);

		nodes.forEach((node) => {
			const nodeWithPosition = dagreGraph.node(node.id);
			node.targetPosition = isHorizontal ? "left" : "top";
			node.sourcePosition = isHorizontal ? "right" : "bottom";

			// We are shifting the dagre node position (anchor=center center) to the top left
			// so it matches the React Flow node anchor point (top left).
			node.position = {
				x: nodeWithPosition.x - nodeWidth / 2,
				y: nodeWithPosition.y - nodeHeight / 2,
			};

			return node;
		});

		return { nodes, edges };
	};

	const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
		initialNodes,
		initialEdges
	);

	const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
	const history = useHistory();
	const [instance, setInstance] = useState(null);
	const [popperText, setPopperText] = useState("");
	React.useEffect(() => {
		setNodes([...layoutedNodes]);
		setEdges([...layoutedEdges]);
	}, [layoutedNodes, layoutedEdges]);

	const onConnect = useCallback(
		(params) =>
			setEdges((eds) =>
				addEdge(
					{
						...params,
						type: ConnectionLineType.SmoothStep,
						animated: true,
					},
					eds
				)
			),
		[]
	);
	const onInit = (reactFlowInstance) => {
		setInstance(reactFlowInstance);
	};
	React.useEffect(() => {
		if (instance) {
			instance.fitView();
		}
	});

	const changeview = (direction) => {
		onLayout(direction);
	};
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClick = (event, issue) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
		let status = "";
		if (issue?.template?.pipeline) {
			status = issue?.template?.pipeline.filter((obj) => {
				return obj?._id == issue?.status;
			})[0];
		}
		setPopperText({ ...issue, currentStatus: status });
	};

	const open = Boolean(anchorEl);
	const onLayout = useCallback(
		(direction) => {
			const { nodes: layoutedNodes, edges: layoutedEdges } =
				getLayoutedElements(nodes, edges, direction);

			setNodes([...layoutedNodes]);
			setEdges([...layoutedEdges]);
			// instance.fitView();
			// instance.setCenter({ x: "100vw", y: "100vh" });
		},
		[nodes, edges]
	);
	const nodeClick = (event, node) => {
		console.log("node=", node);
		handleClick(event, node?.data?.issue);
	};

	return (
		<ReactFlowProvider>
			<div className="layoutflow">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onNodeClick={nodeClick}
					connectionLineType={ConnectionLineType.SmoothStep}
					fitView
					elementsSelectable={false}
					nodesConnectable={false}
					// nodesDraggable={false}
					onInit={onInit}
				>
					<Controls showInteractive={false}>
						<ControlButton onClick={() => changeview("TB")}>
							<RotateLeftIcon
								style={{ maxWidth: "100%", maxHeight: "100%" }}
							/>
						</ControlButton>
					</Controls>
					<Background color="#aaa" gap={16} />
				</ReactFlow>

				{/* <div className="controls">
					<button onClick={() => changeview("TB")}>Vertical Layout</button>
					<button onClick={() => changeview("LR")}>
						horizontal layout
					</button>
				</div> */}
				<Popper open={open} anchorEl={anchorEl}>
					<ClickAwayListener
						onClickAway={() => {
							setAnchorEl(null);
						}}
					>
						{popperText?._id == "start" ? (
							<div
								style={{
									width: "15rem",
									backgroundColor: "white",
									border: "1px solid black",
									borderRadius: "10px",
									padding: "0.7rem",
								}}
							>
								This is Start Node. Use this as a starting point
							</div>
						) : popperText?._id == "finish" ? (
							<div
								style={{
									width: "15rem",
									backgroundColor: "white",
									border: "1px solid black",
									borderRadius: "10px",
									padding: "0.7rem",
								}}
							>
								This is Finish Node. Use this as a ending point
							</div>
						) : (
							<div
								style={{
									backgroundColor: "white",
									border: "1px solid black",
									borderRadius: "10px",
									padding: "0.7rem",
								}}
							>
								<Typography
									align="center"
									variant="button"
									style={{
										width: "100%",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										paddingBottom: "0.4rem",
										cursor: "pointer",
										color: "#5353d6",
									}}
									onClick={() => {
										var path =
											"/issue/view/" + popperText?._id;
										history.push(path);
									}}
								>
									View Issue{" "}
									<OpenInNewIcon
										style={{ paddingLeft: "0.3rem" }}
									/>
								</Typography>

								<div className={classes.flex}>
									<Typography variant="h6">Title</Typography>
									<Typography variant="body1">
										{popperText?.title}
									</Typography>
								</div>
								<div className={classes.flex}>
									<Typography variant="h6">
										Template
									</Typography>
									<Typography variant="body1">
										{popperText?.template?.title}
									</Typography>
								</div>
								<div className={classes.flex}>
									<Typography variant="h6">Type</Typography>
									<Typography
										variant="body1"
										component={"div"}
									>
										{popperText?.closed ? (
											<div style={{ display: "flex" }}>
												<RadioButtonCheckedIcon
													style={{ color: "red" }}
												/>{" "}
												Closed
											</div>
										) : (
											<div style={{ display: "flex" }}>
												<RadioButtonCheckedIcon
													style={{
														color: "rgb(0, 255, 128)",
													}}
												/>{" "}
												Open
											</div>
										)}
									</Typography>
								</div>
								<div className={classes.flex}>
									<Typography variant="h6">Status</Typography>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											borderRadius: "5px",
										}}
									>
										<div
											style={{
												width: "1em",
												height: "1em",
												backgroundColor:
													popperText?.currentStatus
														?.color,
												marginRight: "0.5rem",
												borderRadius: "5px",
											}}
										>
											{" "}
										</div>
										<p
											style={{
												fontSize: "1rem",
												fontFamily: "Inter",
												fontWeight: "400",
												lineHeight: "1.5",
											}}
										>
											{popperText?.currentStatus?.text}
										</p>
									</div>
								</div>
							</div>
						)}
					</ClickAwayListener>
				</Popper>
			</div>
		</ReactFlowProvider>
	);
};

export default IssueGraph;
