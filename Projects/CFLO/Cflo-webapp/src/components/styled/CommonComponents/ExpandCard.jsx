import {
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	Collapse,
	Container,
	IconButton,
} from "@material-ui/core";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";

export default function ExpandCard({ fields }) {
	// fields : title, titleStyle, body, bodyStyle,initialFlag
	const [open, setOpen] = useState(fields?.initialFlag || false);
	return (
		<>
			<Card
				sx={{
					minWidth: 300,
					border: "1px solid rgba(211,211,211,0.6)",
				}}
			>
				<CardActionArea onClick={() => setOpen(!open)}>
					<CardHeader
						style={fields?.titleStyle}
						title={fields?.title}
						action={
							<IconButton aria-label="expand">
								{open ? <ClearIcon /> : <AddIcon />}
							</IconButton>
						}
					></CardHeader>
				</CardActionArea>
				<div style={{ border: "0px solid black" }}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<CardContent style={fields?.bodyStyle}>
							{fields?.body}
						</CardContent>
					</Collapse>
				</div>
			</Card>
		</>
	);
}
