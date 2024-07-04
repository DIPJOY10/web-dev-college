import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import MuiLink from '@material-ui/core/Link';

import Community from "./Community";
import { Button, Divider, IconButton, Typography, useMediaQuery } from "@material-ui/core";
import CreateCommunity from "./CreateCommunity";
import { useTheme } from "styled-components";
import AddIcon from '@material-ui/icons/Add';

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

function YourCommunitySidebar({ selectedProfile }) {
	const dispatch = useDispatch();

	const [openCreate, setOpenCreate] = useState(false);
	const { forum } = useSelector((state) => state);
	const communities = forum.joinedCommunities.slice(0, 5)
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<div
			style={{
				backgroundColor: "white",
				borderRadius: "7px",
				border: "1.5px solid rgba(0, 0, 0, 0.12)",
			}}
		>
			<div style={{ padding: "0.5rem 1rem 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="h6" style={{ fontSize: "1.1rem" }}>
					Your Communities
				</Typography>
				{isSmall ? (<IconButton onClick={() => setOpenCreate(true)} aria-label="add-new">
					<AddIcon />
				</IconButton>) : (<Button onClick={() => setOpenCreate(true)} variant="outlined" size="small">Add new</Button>)}
			</div>
			<div style={{ padding: "1rem 1rem 0.5rem" }}>
				{communities.map((community) => (
					<Community
						selectedProfile={selectedProfile}
						key={community._id}
						community={community}
					/>
				))}
			</div>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "1rem" }}>
				<Link to="/explore/forum/yourforums" style={{ textDecoration: "none" }}><MuiLink underline="hover">Show All</MuiLink></Link>
			</div>
			<CreateCommunity open={openCreate} setOpen={setOpenCreate} />
		</div>
	);
}

export default YourCommunitySidebar;
