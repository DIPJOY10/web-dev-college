import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import cx from "clsx";
import Autocomplete from "../styled/SearchAndAdd/AddAutocomplete";
import Dialog from "../styled/SearchAndAdd/AddDialog";
import PalForm from "./newPalForm";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Api from "../../helpers/Api";
import _ from "lodash";
import { useDebounce } from "react-use";
import { addRelation } from "../finance/network/api";

const useStyles = makeStyles((theme) => ({
	root: {},

	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
	},

	col: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
	},
}));

export default function AddFinRel(props) {
	const { walletId, value, onSelect, placeholder, type = "Customer" } = props;
	const classes = useStyles();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const walletReducer = useSelector((state) => state.wallet);
	const { walletDictionary } = walletReducer;
	const [users, setUsers] = useState([]);
	const [pals, setPals] = useState([]);
	const [text, setText] = useState("");
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([]);
	const { root, row, col } = classes;

	const wallet = walletDictionary[walletId];

	const sendQuery = () => {
		Api.post("searchProfile/", {
			name: text,
		}).then((res) => {
			const data = res?.data;
			if (data?.length > 0) {
				setUsers(data);
			}
		});
	};

	const findOrAddRel = async (profile) => {
		const relObj = {
			profile: profile?._id,
			wallet: walletId,
			addedBy: user?.profile,
			user: user?._id,
			type,
		};
		await Api.post("wallet/relation/findOrAdd", relObj);
	};

	const newOnSelect = async (profile) => {
		if (profile?._id) {
			setPals([...pals, profile]);

			if (onSelect) {
				onSelect(profile);
			}
		}
	};

	useEffect(() => {
		Api.post("wallet/relation/find/wallet", {
			walletId,
		}).then((res) => {
			const data = res?.data;

			if (data?.length > 0) {
				const palData = data.map((rel) => rel.profile);
				setPals(palData);
			}
		});

		sendQuery();
	}, []);

	useDebounce(
		() => {
			sendQuery();
		},
		1000,
		[text]
	);

	const getListItem = (option) => {
		return (
			<div className={row}>
				<ListItemAvatar>
					<Avatar
						src={
							option?.parent?.displayPicture?.thumbUrl
								? option.parent.displayPicture.thumbUrl
								: option?.parent?.displayPicture?.url
						}
						alt={option?.parent?.displayName}
					/>
				</ListItemAvatar>
				<ListItemText
					primary={option?.parent?.displayName}
					secondary={
						option?.parent?.model == "Pal"
							? "Connection"
							: option?.parentModelName
					}
				/>
			</div>
		);
	};

	const onNew = () => {
		setOpen(true);
	};

	const getOptionLabel = (option) => {
		return option && option?.parent ? option?.parent?.displayName : "";
	};

	const getAddObject = (params) => {
		return {
			_id: "New",
			parent: {
				displayName: `Add ${params.inputValue}`,
			},
		};
	};

	return (
		<>
			{/* auto complete add vendor */}
			<Autocomplete
				value={value}
				text={text}
				setText={setText}
				placeholder={placeholder}
				getListItem={getListItem}
				results={_.concat(users, pals)}
				getAddObject={getAddObject}
				getOptionLabel={getOptionLabel}
				onSelect={newOnSelect}
				onNew={onNew}
			/>
			{/* auto complete add vendor */}
			<Dialog
				open={open}
				setOpen={setOpen}
				loading={loading}
				form={
					<PalForm
						text={text}
						setOpen={setOpen}
						onSelect={newOnSelect}
						loading={loading}
						setLoading={setLoading}
					/>
				}
			/>
		</>
	);
}
