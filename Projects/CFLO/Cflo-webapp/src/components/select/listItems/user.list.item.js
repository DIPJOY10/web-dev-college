import React, { useState, useEffect } from "react";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import arrayToReducer from "../../../helpers/arrayToReducer";

import { Avatar, Radio, Typography } from "@material-ui/core";
import html2plaintext from "html2plaintext";

const useStyles = makeStyles((theme) => ({
	row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	imgStyle: {
		width: "1.1rem",
		height: "1.1rem",
		borderRadius:'1.1rem'
	},
	itemStyle: {
		minWidth: "18rem",
	},
}));

const UserListItem = (props) => {
	const classes = useStyles();
	const entity = props?.entity;
	const entityId = entity?._id
	const file = entity?.displayPicture

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
                    <img 
                            src={file?.thumbUrl||file?.url} 
                            className={classes.imgStyle}
                        />

				</ListItemAvatar>

				<ListItemText
					style={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						width: "3rem",
						flex: "0 0 100%",
					}}
					id={entity?._id}
					primary={entity?.displayName || " "}
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

export default UserListItem;
