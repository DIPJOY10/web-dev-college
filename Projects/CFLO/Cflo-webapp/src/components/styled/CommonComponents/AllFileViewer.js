import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory, Link } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import "./common.css"
import DownloadDocCard from "./DownloadDocCard";


const useStyles = makeStyles((theme) => ({
    imgConts: {
        display: "flex",
        flexWrap: "wrap",
        paddingLeft: "15px",
        "& div": {
            width: "250px",
            height: "250px",
            marginRight: "15px",
            marginBottom: "15px",
            boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            cursor: "pointer",
            "&:hover": {
                transform: "scale(1.05)"
            },
            "& img": {
                float: "left",
                width: "100%",
                height: "100%",
                objectFit: "scale-down"
            }
        }
    },
    title: {
        fontSize: "18px",
        fontWeight: "500",
        marginLeft: "15px",
        marginBottom: "10px",
        marginTop: "10px",
    },
    docTitle: {
        fontSize: "16px",
        fontWeight: "500",
        marginLeft: "15px",
        marginBottom: "10px",
        width: "250px",
        position: "relative",
        top: "47px",
        zIndex: "5"
    },
    downloadCont: {
        display: "flex",
        flexWrap: "wrap",
        "& div": {
            marginRight: "10px",
            marginBottom: "10px",
            width: "270px"
        }
    }
}));

export default function AllFileViewers(props) {
    const classes = useStyles();
    const history = useHistory();
    const { files } = props

    const [imgFileArr, setImgFileArr] = useState([])
    const [docsArr, setDocsArr] = useState([])
    const [downloadDocsArr, setDownloadDocsArr] = useState([])
    const [clickedImg, setClickedImg] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleCloseShare = () => {
        setClickedImg(null)
        setDialogOpen(false)
    }

    useEffect(() => {
        let arr = [];
        let imgArr = [];
        let docs = [];
        files.map((file) => {
            let nameArr = file.name.split('.')
            let len = nameArr.length

            if (file?.type.includes("image")) {
                imgArr.push({
                    uri: file?.url,
                    type: nameArr[len - 1]
                })
            } else {
                let typeLen = nameArr[len - 1].length
                let nameLen = file.name.length
                let onlyName = file.name.slice(0, nameLen - typeLen - 1)
                let limitedName = onlyName.slice(0, 17);

                docs.push({
                    url: file?.url,
                    name: limitedName + "." + nameArr[len - 1],
                })
            }

            if (!file?.type.includes("image") && nameArr[len - 1] !== "csv") {
                arr.push({
                    uri: file?.url,
                    type: nameArr[len - 1]
                })
            }
        })

        setDownloadDocsArr(docs)
        setImgFileArr(imgArr)
        setDocsArr(arr)
    }, [files])



    return (
        <div>
            <p className={classes.title} >Photo(s)</p>
            <div className={classes.imgConts} >
                {imgFileArr && imgFileArr.map((img) => (
                    <div onClick={() => {
                        setClickedImg(img?.uri)
                        setDialogOpen(true)
                    }} >
                        <img src={img?.uri} />
                    </div>
                ))}
            </div>


            <p className={classes.docTitle} >Document(s)</p>
            {docsArr.length > 0 ? (
                <DocViewer
                    pluginRenderers={DocViewerRenderers}
                    documents={docsArr}
                    config={{
                        header: {
                            disableFileName: true,
                        }
                    }}
                />
            ) : null}

            <p className={classes.title} >Download Document(s)</p>
            <div className={classes.downloadCont} >
                {downloadDocsArr.length > 0 && downloadDocsArr.map((file) => (
                    <DownloadDocCard file={file} />
                ))}
            </div>



            <Dialog
                open={dialogOpen}
                onClose={handleCloseShare}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        borderRadius: "5px",
                        maxWidth: "1200px"
                    }
                }}
            >
                <DialogContent style={{ padding: "0" }} >
                    {clickedImg && (
                        <img style={{
                            maxHeight: "90vh",
                            maxWidth: "1200px"
                        }} src={clickedImg} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
