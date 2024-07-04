import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import EditBtn from "../styled/actionBtns/edit.btn";
import moment from "moment";
import folderIcon from "../../Assets/FileIcon/folder.png";
import {
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
} from "@material-ui/core";
import AvatarLocal from "../profile/avatar";

const useStyles = makeStyles((theme) => ({
	root: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		marginTop: "0.5rem",
		maxWidth: "19rem",
		padding: "1rem",
	},
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},

	topRow: {
		display: "flex",
		flexDirection: "row",
		height: "4rem",
	},
	nameText: {
		flex: 1,
		height: "4rem",
	},
}));

export default function FolderCardOld(props) {
	const { folder, onSelect } = props;

	// console.log(folder,' is the folder',folderId)
	const history = useHistory();
	const classes = useStyles();
	console.log("folder is", folder);
	if (folder) {
		const user = folder?.user;
		const displayName = user?.displayName;
		const displayPicture = user?.displayPicture;

		return (
			<Grid item style={{ display: "flex" }} lg={4} md={4} xs={6}>
				{/* <Paper
				className={classes.root}
				variant="outlined"
				square
				onClick={() => {
					dispatch({
						type: "AddDoc",
						payload: {
							tempDoc: doc,
						},
					});
					var path = "/doc/view/" + doc?._id;
					history.push(path);
				}}
			> */}
				<Card
					sx={{ p: 3 }}
					className={classes.card}
					// onClick={}
				>
					<CardActionArea>
						<CardMedia
							component="img"
							alt="Folder Icon"
							height="120"
							image={folderIcon}
						/>
						<CardContent>
							<Typography
								gutterBottom
								variant="h6"
								component="h4"
							>
								{<b>{(folder?.title).slice(0, 40)}</b>}
							</Typography>
						</CardContent>
						<CardActions
							style={{
								padding: "0.4rem",
							}}
						>
							<Typography
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<AvatarLocal
									alt={displayName}
									src={user}
									className={classes.dP}
								/>
								{displayName}
							</Typography>
						</CardActions>
					</CardActionArea>
				</Card>

				{/* <div className={classes.topRow}>

            <Typography className={classes.titleText}>
            <b>{(doc?.title).slice(0, 40)}</b>
            </Typography>

          <AvatarLocal alt={displayName}
            src={user}
            className={classes.dP}
          />


          <Typography className={classes.nameText}>
            {displayName}
          </Typography>


          <EditBtn
            onClick={()=>{

            }}
          />

        </div> */}
				{/* </Paper> */}
			</Grid>
		);
		//  (
		// 	<Paper className={classes.root} variant="outlined" square>
		// 		<div className={classes.topRow}>
		// 			<Avatar
		// 				alt={displayName}
		// 				src={displayPicture?.thumbUrl}
		// 				className={classes.dP}
		// 			/>

		// 			<Typography className={classes.nameText}>
		// 				{displayName}
		// 			</Typography>

		// 			<EditBtn onClick={() => {}} />
		// 		</div>

		// 		<Typography className={classes.titleText}>
		// 			<b>{(folder?.title).slice(0, 40)}</b>
		// 		</Typography>
		// 	</Paper>
		// );
	} else {
		return null;
	}
}
