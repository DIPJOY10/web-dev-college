import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { makeStyles } from "@material-ui/core/styles";
import "./GalleryViewer.css";

// @import "~react-image-gallery/styles/css/image-gallery.css";

function GalleryViewer({ images, fileObject = false, files: filesProp = [] }) {
	const componentRef = useRef();

	const fileReducer = useSelector((state) => state.file);
	const { fileDictionary } = fileReducer;
	const [itemsArray, setItemsArray] = useState([]);
	const [files, setFiles] = useState(filesProp);

	useEffect(() => {
		let items;
		if (!fileObject) {
			items = images.map((image) => ({
				original: fileDictionary[image].url,
				thumbnail: fileDictionary[image].thumbUrl,
			}));
		} else {
			items = files.map((file) => ({
				original: file.url,
				thumbnail: file.thumbUrl || file.url,
			}));
		}
		setItemsArray(items);
	}, [images, files]);

	//   console.log({ images, filesProp });
	return (
		<div className="imageGallery">
			<ImageGallery
				items={itemsArray}
				showPlayButton={false}
				loading={"lazy"}
				lazyLoad
				showFullscreenButton={false}
				showThumbnails={itemsArray.length > 1}
				originalWidth="100%"
				originalHeight="auto"
				ref={componentRef}
			/>
		</div>
	);
}

export default GalleryViewer;
