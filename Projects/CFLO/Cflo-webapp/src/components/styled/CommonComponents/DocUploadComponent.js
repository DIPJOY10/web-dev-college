import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useDebounce } from 'react-use';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import FileUploadButton from '../../file/Uploader/FileUploadButton';


const useStyles = makeStyles((theme) => ({
    flexCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }
    },
    fileUploadCont: {
        width: "300px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleStyle: {
        fontSize: "17px",
        fontWeight: "600",
        [theme.breakpoints.down('sm')]: {
            marginBottom: "20px"
        }
    }
}));

export default function DocUploadComponent(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { docName, setDocName, setIsFileUpload } = props;
    const { } = classes;

    return (
        <div className={classes.flexCont} >
            <Typography className={classes.titleStyle} >Attach File(s)</Typography>
            <div className={classes.fileUploadCont} >
                <TextField
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                    size="small"
                    style={{ width: "225px" }}
                    value={docName}
                    onChange={(e) => { setDocName(e.target.value) }}
                />

                {docName?.length > 2 ? (
                    <Button
                        variant="contained"
                        style={{
                            height: "40px",
                            padding: "0px",
                            backgroundColor: "#ffffff",
                            border: "2px solid #2193EF"
                        }}
                    >
                        <span onClick={() => { setIsFileUpload(true) }}>
                            <FileUploadButton
                                parentType='Message'
                                used={false}
                                parentId={null}
                            />
                        </span>
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        style={{
                            height: "40px",
                            padding: "0px",
                            backgroundColor: "#ffffff",
                            border: "2px solid #2193EF",
                        }}
                        disabled
                    >
                        <AttachFileIcon style={{ color: "#2193EF" }} />
                    </Button>
                )}
            </div>
        </div>
    );
}

