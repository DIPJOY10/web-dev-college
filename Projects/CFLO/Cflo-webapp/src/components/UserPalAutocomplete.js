/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Api from "../helpers/Api";
import Typography from "@material-ui/core/Typography";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		"& > * + *": {
			marginTop: theme.spacing(3),
		},
		margin: "1rem",
		alignItems: "center",
		// 'justifyContent': 'center',
	},
	inputPaper: {
		padding: "2px 4px",
		display: "flex",
		alignItems: "center",
		width: "20rem",
		borderRadius: 10,
		paddingLeft: 10,
		[theme.breakpoints.down("xs")]: {
			width: "15rem",
		},
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
}));

export default function UserPalAutoComplete(props) {
	const classes = useStyles();
	const { participant, setParticipant, setSelectUser, placeholder } = props;

	const { user, userProfile } = useSelector((state) => state.auth);
	const [text, setText] = useState("");
	const [users, setUsers] = useState([]);
	const [pals, setPals] = useState([]);

	const sendQuery = () => {
		Api.post("searchPeople/", {
			name: text,
		}).then((users) => {
			setUsers(users);
		});
	};

	useEffect(() => {
		sendQuery();
		// get user create accounts
		Api.post("pal/getPals", {
			parent: user._id,
			parentModelName: user.model,
		}).then((pals) => {
			setPals(pals);
			// console.log(pals,' is the pals')
		});
	}, []);

	const delayedQuery = useCallback(
		_.debounce((q) => sendQuery(), 500),
		[]
	);

	return (
		<div className={classes.root}>
			<Autocomplete
				id="userpalautocomplete"
				value={participant}
				options={_.concat(users, pals)}
				getOptionLabel={(option) => {
					return option && option?.parent
						? option?.parent?.displayName
						: "";
				}}
				onChange={(event, value) => {
					setParticipant(value);
					if (setSelectUser) {
						setSelectUser(false);
					}
				}}
				renderInput={(params) => (
					<Paper
						component="form"
						className={classes.inputPaper}
						ref={params.InputProps.ref}
					>
						<InputBase
							{...params}
							className={classes.input}
							placeholder={
								placeholder ? placeholder : "Add Members"
							}
							inputProps={{ "aria-label": "Add Members" }}
							{...params.inputProps}
						/>
						<IconButton
							type="submit"
							className={classes.iconButton}
							aria-label="search"
						>
							<SearchIcon />
						</IconButton>
					</Paper>
				)}
				renderOption={(option, state) => {
					return option ? (
						<ListItem>
							<ListItemAvatar>
								<Avatar
									src={
										option?.parent?.displayPicture?.thumbUrl
											? option.parent.displayPicture
													.thumbUrl
											: option?.parent?.displayPicture
													?.url
									}
									alt={option?.parent?.displayName}
								/>
							</ListItemAvatar>
							<ListItemText
								primary={option?.parent?.displayName}
								secondary={
									option.parent.model == "Pal"
										? "Connection"
										: option?.parentModelName
								}
							/>
						</ListItem>
					) : null;

					// if(option.model=='Pal'){
					//   return <ListItem>
					//       <ListItemAvatar>
					//         <Avatar src={option.displayPicture?.thumbUrl} alt={option.displayName} />
					//       </ListItemAvatar>
					//       <ListItemText
					//         primary={option.displayName}
					//         secondary={'Connection'}
					//       />
					//   </ListItem>
					// }else{
					//   return <ListItem>
					//       <ListItemAvatar>
					//         <Avatar src={
					//           option?.parent?.displayPicture?.thumbUrl?
					//           option.parent.displayPicture.thumbUrl:option?.parent?.displayPicture?.url} alt={option?.parent?.displayName} />
					//       </ListItemAvatar>
					//       <ListItemText
					//         primary={option?.parent?.displayName}
					//         secondary={option.parent.model=='Pal'?'Connection':option?.parentModelName}
					//       />
					//   </ListItem>
					// }
				}}
			/>
		</div>
	);
}
