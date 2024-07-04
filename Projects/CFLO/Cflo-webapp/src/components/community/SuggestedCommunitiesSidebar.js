import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import Community from "./Community";
import { Divider, Typography } from "@material-ui/core";

const guestSuggestedIds = ["62f77ad5f52e0962f99006a7",
	"62ee99802bc3474adcd97860",
	"62dbad48c4244f5181eefadf",
	"62dbad9ed905a051d6b36009",
	"6212006feb00153b85e09e78"]

const guestCommunity = {
	"62f77ad5f52e0962f99006a7": { displayName: 'test1' },
	"62ee99802bc3474adcd97860": { displayName: 'test2' },
	"62dbad48c4244f5181eefadf": { displayName: 'test12' },
	"62dbad9ed905a051d6b36009": { displayName: 'test3' },
	"6212006feb00153b85e09e78": { displayName: 'test4' }
}

function SuggestedCommunitySidebar({ selectedProfile }) {
	const dispatch = useDispatch();

	const { auth, forum } = useSelector((state) => state);
	const { user } = auth;
	const { suggestedCommunitiesIds, suggestedCommunitiesDict } = forum;
	const topSuggestedCommunitiesIds = suggestedCommunitiesIds.slice(0, 5);

	console.log(suggestedCommunitiesDict)

	return (
		<div
			style={{
				backgroundColor: "white",
				borderRadius: "7px",
				border: "1.5px solid rgba(0, 0, 0, 0.12)",
			}}
		>
			<div style={{ padding: "0.5rem 1rem 0" }}>
				<Typography variant="h6" style={{ fontSize: "1.1rem" }}>
					Suggested Communities
				</Typography>
			</div>
			<div style={{ padding: "1rem" }}>
				{(topSuggestedCommunitiesIds).map((id) => (
					<Community
						selectedProfile={selectedProfile}
						key={id}
						community={suggestedCommunitiesDict[id]}
					/>
				))}
			</div>
		</div>
	);
}

export default SuggestedCommunitySidebar;
