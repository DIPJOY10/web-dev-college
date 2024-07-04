import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory, Link } from "react-router-dom";
import ImageVideoViewer from "./ImageVideo.Viewer";
import DownloadDocCard from "./DownloadDocCard";


const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: "center",
        width: "100%",
        height: "100%"
    },
    mainImgCont: {
        width: "100%",
        height: "calc(100% - 100px)",
        "& img": {
            float: "left",
            width: "100%",
            height: "100%",
            objectFit: "scale-down"
        }
    },
    imgConts: {
        display: "flex",
        overflowX: "auto",
        marginTop: "15px",
        width: "100%",
        paddingLeft: "15px",
        "& div": {
            flexShrink: "0",
            width: "80px",
            height: "50px",
            overflow: "hidden",
            marginRight: "15px",
            marginBottom: "15px",
            boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            cursor: "pointer",
            "& img": {
                float: "left",
                width: "100%",
                height: "100%",
                objectFit: "scale-down"
            }
        },
        "&::-webkit-scrollbar": {
            display: "none"
        },
        scrollbarWidth: "none",
    },
    docsCont: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
    }
}));

export default function AllFileViewerFeed(props) {
    const classes = useStyles();
    const history = useHistory();
    const {
        picVideoViewerHeight, picVideoViewerWidth, picVideoViewerHeightSmall,
        files, isDeletable, removeFun
    } = props

    const [current, setCurrent] = useState(0);
    const [picVideosArr, setPicVideosArr] = useState([])
    const [docsArr, setDocsArr] = useState([])

    useEffect(() => {
        let arr1 = []
        let arr2 = []

        files.map((file, i) => {
            if (file.type.startsWith("image/")) {
                arr1.push({
                    _id: file?._id,
                    index: i,
                    url: file?.url,
                    type: "photo"
                })
            } else if (file.type.startsWith("video/")) {
                arr1.push({
                    _id: file?._id,
                    index: i,
                    url: file?.url,
                    type: "video"
                })
            } else {
                arr2.push(file)
            }
        })

        setPicVideosArr(arr1)
        setDocsArr(arr2)
    }, [files])


    return (
        <>
            {picVideosArr.length > 0 && (
                <ImageVideoViewer
                    data={picVideosArr}
                    picVideoViewerHeight={picVideoViewerHeight}
                    picVideoViewerWidth={picVideoViewerWidth}
                    picVideoViewerHeightSmall={picVideoViewerHeightSmall}
                    isDeletable={isDeletable}
                    removeFun={removeFun}
                />
            )}

            <div className={classes.docsCont} >
                {docsArr.length > 0 && docsArr.map((file) => (
                    <DownloadDocCard
                        file={file}
                        isDeletable={isDeletable}
                        removeFun={removeFun}
                    />
                ))}
            </div>
        </>
    );
}
