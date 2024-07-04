import { Avatar, Divider, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import CakeIcon from "@material-ui/icons/Cake";
import PublicIcon from "@material-ui/icons/Public";
import VpnLockIcon from "@material-ui/icons/VpnLock";
import PeopleIcon from "@material-ui/icons/People";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: "white",
		padding: "1rem 0.5rem",
		margin: "1rem",
		borderRadius: "13px",
	},
	belowText: {
		display: "flex",
		alignItems: "center",
		fontSize: "0.875rem",
		fontFamily: "Inter",
		fontWeight: "400",
		lineHeight: "1.43",
		gap: "5px",
		color: "#777777",
		flexWrap: "wrap",
	},
	wrapper: {
		"&:hover": {
			backgroundColor: "#d3d3d369",
			cursor: "pointer",
		},
		display: "flex",
		alignItems: "center",
		gap: "8px",
		padding: "0.7rem 0",
	},
}));

function formatNumber(number) {
	if (number > 999999) {
		return `${Math.floor(number / 1000000)}M`;
	} else if (number > 999) {
		return `${Math.floor(number / 1000)}K`;
	} else {
		return `${number}`;
	}
}

function CommunitySearches({ communities = [] }) {
	const classes = useStyles();
	const location = useLocation();
	const history = useHistory();
	const Arrlength = communities.length;

	const handleClick = (slug) => {
		history.push("/explore/forum/communities/" + slug);
	};
	return (
		<div className={classes.root}>
			{Boolean(Arrlength) && (
				<Typography variant="h6" gutterBottom>
					Showing Results For "{decodeURI(location.search.slice(1))}"
				</Typography>
			)}
			{Arrlength > 0 ? (
				communities.map((community, idx) => {
					return (
						<>
							<div
								className={classes.wrapper}
								onClick={() => handleClick(community?.slug)}
							>
								<Avatar
									src={
										community?.displayPicture?.thumbUrl ||
										community?.displayPicture?.url
									}
									alt={community?.displayName}
								/>
								<div>
									<Typography
										variant="h6"
										style={{ fontSize: "1rem" }}
									>
										{community?.displayName}
									</Typography>
									<div className={classes.belowText}>
										<span
											style={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<AssignmentIndIcon
												style={{ width: "1rem" }}
											/>{" "}
											Owner:{" "}
											{community?.user?.displayName}
										</span>
										|
										<span
											style={{
												display: "flex",
												alignItems: "center",
											}}
										>
											{community?.communityType ==
											"public" ? (
												<>
													<PublicIcon
														style={{
															width: "1rem",
														}}
													/>{" "}
													Public
												</>
											) : (
												<>
													<VpnLockIcon
														style={{
															width: "1rem",
														}}
													/>{" "}
													Private
												</>
											)}
										</span>
										|
										<span
											style={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<PeopleIcon
												style={{ width: "1rem" }}
											/>
											Members:{" "}
											{formatNumber(community?.joinCount)}
										</span>
									</div>
								</div>
							</div>
							{idx != Arrlength - 1 && <Divider />}
						</>
					);
				})
			) : (
				<div>
					No results found for{" "}
					<b>{decodeURI(location.search.slice(1))}</b>. Try shortening
					or rephrasing your search.
				</div>
			)}
		</div>
	);
}

export default CommunitySearches;
