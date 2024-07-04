import {
	Avatar,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Typography,
} from "@material-ui/core";
import React from "react";

function DialogOptionSelect({ items, icons = [], noIcon = false, setTab }) {
	// icons array should only contain mui icons or svgs. No image src file
	return (
		<div
			style={{
				display: "grid",
				gap: "15px",
				gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))",
				gridAutoRows: "1fr",
				gridAutoFlow: "column",
			}}
		>
			{items.map((itemName, idx) => {
				const Imgtag = icons[idx];
				return (
					<Card style={{ height: "100%" }} key={idx}>
						<CardActionArea
							onClick={() => {
								if (setTab) {
									setTab(idx);
								}
							}}
							style={{
								padding: "1rem",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								height: "100%",
								justifyContent: "space-around",
							}}
						>
							{!noIcon && (
								<Avatar alt="no">
									<Imgtag />
								</Avatar>
							)}
							<CardContent>
								<Typography
									variant="h6"
									component="h2"
									align="center"
								>
									{itemName}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				);
			})}
		</div>
	);
}

export default DialogOptionSelect;
