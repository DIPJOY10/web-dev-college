import { LinearProgress } from "@material-ui/core";
import React from "react";
import logo from "../Assets/LogoV3NoWhite.svg";

export const Loadinglogo = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				height: "78vh",
			}}
		>
			<img
				src={logo}
				style={{
					width: "8rem",
				}}
			/>
			<div style={{ width: "8rem", marginTop: "0.7rem" }}>
				<LinearProgress />
			</div>
		</div>
	);
};
