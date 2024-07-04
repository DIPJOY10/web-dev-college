import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Uploader from "./Uploader";
import CustomFileUploadDialog from "./CustomUploadDialog";

const useStyles = makeStyles((theme) => ({

}));

const CustomFileUploadButton = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const {
        showComponent, parentType, parentId,
        used, fileNum, givenFileTypes, givenMaxSize
    } = props;
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const fileReducer = useSelector((state) => state.file);
    const { selectedFilePaths } = fileReducer;

    useEffect(() => {
        dispatch({ type: "FileUploadReset" });
    }, []);

    useEffect(() => {
        Uploader({
            state,
            dispatch,
            parentType,
            parentId,
            used,
        });
    }, [selectedFilePaths]);

    return (
        <>
            <span style={{ cursor: "pointer" }} onClick={() => { setOpen(true) }} >
                {showComponent}
            </span>

            <CustomFileUploadDialog
                open={open}
                setOpen={setOpen}
                fileNum={fileNum}
                givenFileTypes={givenFileTypes}
                givenMaxSize={givenMaxSize}
            />
        </>
    );
};

export default CustomFileUploadButton;