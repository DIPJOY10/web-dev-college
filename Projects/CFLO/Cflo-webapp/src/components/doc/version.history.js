import React, { useEffect, useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import VersionDiff from "../styled/version.diff";
import {
	Avatar,
	Chip,
	CircularProgress,
	Divider,
	Paper,
	Typography,
} from "@material-ui/core";
import { result } from "lodash";
import Api from "../../helpers/Api";
import * as h2p from "html2plaintext";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: "1rem",
		width: "50vw",
	},
}));

export default function VersionHistory(props) {
	const classes = useStyles();
	const { versions = [], docId } = props;
	const [loading, setLoading] = useState(false);
	const [allVersions, setAllVersions] = useState([]);
	const [allLogs, setAllLogs] = useState([]);
	const getAllVersions = async () => {
		setLoading(true);
		const res = await Api.post("/doc/getDocVersions", {
			versions,
		});
		if (res?.data) {
			setAllVersions(res?.data);
		}
		setLoading(false);
	};
	const getAllLogs = async () => {
		setLoading(true);
		const res = await Api.post("/activity/get-dataModel", {
			data: docId,
			dataModel: 'Doc',
		});
		if (res?.data) {
			console.log("All logs saved", res?.data);
			setAllLogs(res?.data);
		}
		setLoading(false);
	};
	useEffect(() => {
		getAllVersions();
		getAllLogs();
	}, []);
	console.log("versions ", allVersions);

	const len = allLogs.length;
	// console.log(versions,' is versions')

	var lookArr = [];

	for (let i = 1; i < len; i++) {
		// var newDoc = allVersions[len - i];
		// var oldDoc = allVersions[len - i - 1];
		var newDoc = JSON.parse(allLogs[len - i]?.raw);
		var oldDoc = JSON.parse(allLogs[len - i - 1]?.raw);
		var titleDiff = !(newDoc.title == oldDoc.title);
		var descDiff = !(h2p(newDoc.description) == h2p(oldDoc.description));

		if (oldDoc?._id) {
			lookArr.push(
				<Paper className={classes.root} key={i} elevation={4}>
					<div>
						<Typography align="center" variant="h5">
							Version {len - i + 1}
						</Typography>
						<Typography
							align="left"
							variant="body1"
							style={{ marginRight: "10px" }}
						>
							Updated By {<Chip
								avatar={<Avatar alt={allLogs[len - i]?.profile?.parent?.displayName} src={allLogs[len - i]?.profile?.parent?.displayPicture?.thumbUrl} />}
								label={allLogs[len - i]?.profile?.parent?.displayName}

							/>}
						</Typography>
						<Typography
							align="right"
							variant="body1"
							style={{ marginRight: "10px" }}
						>
							{new Date(newDoc?.updatedAt)
								.toString()
								.split(" ")
								.slice(0, 5)
								.join(" ")}
						</Typography>
					</div>
					{titleDiff ? (
						<>
							<Typography align="center" variant="body1">
								Title changed
							</Typography>
							<VersionDiff
								oldValue={oldDoc?.title}
								newValue={newDoc?.title}
							/>
						</>
					) : null}

					{descDiff ? (
						<>
							<Typography align="center" variant="body1">
								Description changed
							</Typography>
							<VersionDiff
								oldValue={h2p(oldDoc?.description)}
								newValue={h2p(newDoc?.description)}
							/>
						</>
					) : null}
					{!titleDiff && !descDiff ? (
						<Typography variant="h6" align="center">
							No changes were made in Text Content.
						</Typography>
					) : null}

					<Divider />
				</Paper>
			);
		}
	}

	return (
		<div className={classes.root}>
			{loading ? (
				<CircularProgress />
			) : lookArr.length > 0 ? (
				lookArr
			) : (
				<Typography align="center" variant="h6">
					Current version is the only version
				</Typography>
			)}
		</div>
	);
}
