import React, { useState, useEffect } from "react";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";

import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";

import AvatarLocal from "../../profile/avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { Radio, Typography } from "@material-ui/core";
import arrayToReducer from "../../../helpers/arrayToReducer";

const useStyles = makeStyles((theme) => ({
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},

	itemStyle: {
		minWidth: "18rem",
	},
}));

const EntityListItem = (props) => {
	const classes = useStyles();

	const entity = props?.entity?.parent;
    const entityId = entity._id
	const multiple = props?.multiple;
    const setSelectedIds = props?.setSelectedIds;
    const selectedIds = props?.selectedIds;
    const setSelectedDict = props?.setSelectedDict;
    const selectedDict = props?.selectedDict


	const handleToggle = () => {
        const { newDict, idArr } = arrayToReducer([entity])
        var index = selectedIds.indexOf(entityId)
        const isSelected = index !== -1;
        if(isSelected){
            var tempArr = [...selectedIds]
            var removed = tempArr.splice(index,1)
            setSelectedIds(tempArr)
        }else{
            setSelectedIds([...selectedIds,entityId])
            setSelectedDict({
                ...selectedDict,
                ...newDict
            })
        }
	};

	const handleRadioToggle = () => {
		setSelectedIds([entityId]);
        const { newDict, idArr } = arrayToReducer([entity])
        setSelectedDict(newDict)
	};

	return (
		<ListItem className={classes.row}>
			<div className={classes.row}>
				<ListItemAvatar>
					<AvatarLocal
						src={entity}
						style={{
							height: "1.6rem",
							width: "1.6rem",
							borderRadius: "0.8rem",
						}}
					/>
				</ListItemAvatar>

				<ListItemText
					id={entity?._id}
					primary={entity?.displayName || []}
				/>
			</div>

			{multiple ?(
				<Checkbox
					edge="end"
					onChange={() => handleToggle(entityId)}
					checked={selectedIds.indexOf(entityId) !== -1}
					inputProps={{ "aria-labelledby": entity?._id }}
					color="primary"
				/>
			): (
				<Radio
					color="primary"
					value={entityId}
					checked={(selectedIds || []).indexOf(entityId) !== -1}
					onChange={() => handleRadioToggle(entityId)}
				/>
			)}
		</ListItem>
	);
};

export default EntityListItem;
