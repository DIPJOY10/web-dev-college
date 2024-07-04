import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@material-ui/core/Avatar";

const AvatarLocal = (props) => {
	const { src, ...rest } = props;
	const displayName = src?.displayName;
	const displayPicture = src?.displayPicture;
	const url = displayPicture?.url;
	const thumbUrl = displayPicture?.thumbUrl;
	let imageUrl = url;
	// console.log("url = ", imageUrl);

	if (thumbUrl) {
		imageUrl = thumbUrl;
	}
	// console.log("url = ", imageUrl);
	return <Avatar alt={displayName} sx={props.sx} {...rest} src={imageUrl} />;
};

export default AvatarLocal;
