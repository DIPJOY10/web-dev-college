import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { onSelectFiles } from "../fileUtils";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { CloudUpload } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    dragNdrop: {
        height: "25rem",
        padding: "3.5rem",
        border: "4px dashed #82C3EC",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "&:hover": {
            backgroundColor: '#BFEAF5',
            border: "4px dashed #2296f3",
        }
    },
    icon: {
        fontSize: '10rem',
        color: theme.palette.primary.main,
    }
}));

const CustomUploadZone = ({
    fileNum,
    givenFileTypes,
    givenMaxSize,
}) => {
    const maxSize = 26214400; //25 mb
    const classes = useStyles();
    const dispatch = useDispatch();
    const file = useSelector((state) => state.file);
    const { selectedFilePaths } = file;

    const [optionsObj, setOptionsObj] = useState({})

    const onDrop = useCallback(
        async (acceptedFiles, rejectedFiles) => {
            onSelectFiles(acceptedFiles, file, dispatch);
        },
        [selectedFilePaths]
    );

    const locFileTypes = ["image", "video", "html", "xhtml", "csv", "doc", "docx", "pdf", "rtf", "plain", "ppt", "pptx", "xls", "xlsx"]

    useEffect(() => {
        let typeObj = {}

        let fileTypes = givenFileTypes ? givenFileTypes : locFileTypes

        if (fileTypes.includes("image")) {
            const imgObj = {
                "image/jpeg": [],
                "image/png": [],
                "image/bmp": [".bmp"],
                "image/bmp": [".gif"],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/tiff": [".tiff"],
            }
            typeObj = { ...typeObj, ...imgObj }
        }

        if (fileTypes.includes("video")) {
            const videoObj = {
                "video/*": [],
            }
            typeObj = { ...typeObj, ...videoObj }
        }

        if (fileTypes.includes("html")) {
            const htmlObj = {
                "text/html": [".html", ".htm"],
            }
            typeObj = { ...typeObj, ...htmlObj }
        }

        if (fileTypes.includes("xhtml")) {
            const xhtmlObj = {
                "application/xhtml+xml": [".xhtml"],
            }
            typeObj = { ...typeObj, ...xhtmlObj }
        }

        if (fileTypes.includes("csv")) {
            const csvObj = {
                "text/csv": [".csv"],
            }
            typeObj = { ...typeObj, ...csvObj }
        }

        if (fileTypes.includes("doc")) {
            const docObj = {
                "application/msword": [".doc", ".docm"],
            }
            typeObj = { ...typeObj, ...docObj }
        }

        if (fileTypes.includes("docx")) {
            const docxObj = {
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            }
            typeObj = { ...typeObj, ...docxObj }
        }

        if (fileTypes.includes("pdf")) {
            const pdfObj = {
                "application/pdf": [".pdf"],
            }
            typeObj = { ...typeObj, ...pdfObj }
        }

        if (fileTypes.includes("rtf")) {
            const rtfObj = {
                "application/rtf": [".rtf"],
            }
            typeObj = { ...typeObj, ...rtfObj }
        }

        if (fileTypes.includes("plain")) {
            const plainObj = {
                "text/plain": ["txt"],
            }
            typeObj = { ...typeObj, ...plainObj }
        }

        if (fileTypes.includes("ppt")) {
            const pptObj = {
                "application/vnd.ms-powerpoint": [".ppt"],
            }
            typeObj = { ...typeObj, ...pptObj }
        }

        if (fileTypes.includes("pptx")) {
            const pptxObj = {
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
            }
            typeObj = { ...typeObj, ...pptxObj }
        }

        if (fileTypes.includes("xls")) {
            const xlsObj = {
                "application/vnd.ms-excel": [".xls", ".xlsm"],
            }
            typeObj = { ...typeObj, ...xlsObj }
        }

        if (fileTypes.includes("xlsx")) {
            const xlsxObj = {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            }
            typeObj = { ...typeObj, ...xlsxObj }
        }

        let docOptions = null

        let locMaxSize = givenMaxSize ? givenMaxSize : maxSize

        if (fileNum) {
            docOptions = {
                onDrop,
                maxFiles: fileNum,
                accept: typeObj,
                minSize: 0,
                maxSize: locMaxSize
            }
        } else {
            docOptions = {
                onDrop,
                accept: typeObj,
                minSize: 0,
                maxSize: locMaxSize
            }
        }

        setOptionsObj(docOptions)
    }, [givenFileTypes])

    const { getRootProps, getInputProps } = useDropzone(optionsObj);

    return (
        <div {...getRootProps()} className="uploader">
            <div className={classes.dragNdrop}>
                <input {...getInputProps()} multiple={fileNum === 1 ? false : true} />
                <CloudUpload className={classes.icon} />
                {givenFileTypes && givenFileTypes.length === 1 && givenFileTypes.includes("image") ? (
                    <p>Drag 'n' drop some images here, or click to select</p>
                ) : (
                    <p>Drag 'n' drop some files here, or click to select files</p>
                )}
                <>
                    {fileNum && fileNum > 0 ? (
                        <p>({fileNum} files are the maximum number of files you can drop here)</p>
                    ) : null}
                </>
            </div>
        </div>
    );
};

export default CustomUploadZone;
