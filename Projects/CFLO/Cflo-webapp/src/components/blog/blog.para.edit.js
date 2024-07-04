import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import cx from 'clsx';
import { useParams } from 'react-router-dom';
import Api from '../../helpers/Api';
import TitleInput from '../styled/title.input';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import FilesViewer from '../file/Viewer/FilesViewer';
import DescriptionInput from '../styled/description.input';
import { deleteFiles, getFiles } from './api.call';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "30px"
    },
    saveContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 18px'
    },
    fileConts: {
        margin: "1rem",
        display: 'flex',
        flexWrap: "wrap",
        "& img": {
            width: "150px",
            height: "auto",
            marginRight: "20px"
        }
    },
    crossIcon: {
        position: "absolute",
        top: "5px",
        right: "25px",
        color: "#EE1D52",
    }
}));

export default function BlogParaEdit(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const oldDoc = props.doc;
    const { currentPera, setCurrentPera, setLoadingBool } = props;
    const oldDesc = oldDoc?.description;
    const oldFiles = oldDoc?.files || [];
    const oldIsPublic = oldDoc?.isPublic;

    const file = useSelector((state) => state.file);
    const { createdFileIds } = file;

    const [currentFiles, setCurrentFiles] = useState([])
    const [removeFiles, setRemoveFiles] = useState([])
    const [description, setDescription] = useState(oldDesc)

    useEffect(() => {
        let files = [];
        oldFiles && oldFiles.map((file) => {
            files.push(file._id)
        })
        getFiles({ files })
            .then((filesData) => {
                console.log(filesData)
                setCurrentFiles(filesData)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if (currentPera === oldDoc?._id && createdFileIds.length > 0) {
            getFiles({ files: createdFileIds })
                .then((filesData) => {
                    let updatedFiles = [...currentFiles, ...filesData]
                    setCurrentFiles(updatedFiles)
                    console.log(filesData)
                    dispatch({ type: "FileUploadReset" });
                    setCurrentPera(null)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [createdFileIds])

    const update = async () => {
        setLoadingBool(true)
        if (removeFiles && removeFiles.length > 0) {
            await deleteFiles({ files: removeFiles })
                .then((data) => {
                    console.log(data)
                })
        }
        const fileIds = currentFiles.map(file => file?._id);
        const res = await Api.post('doc/simple/update', {
            _id: oldDoc._id,
            description,
            files: fileIds
        })
        setLoadingBool(false)
    }

    const removeFile = async (id) => {
        let removed = [...removeFiles, id]
        setRemoveFiles(removed)
        let updatedFiles = [];
        currentFiles.map((file) => {
            if (id !== file?._id) {
                updatedFiles.push(file)
            }
        })
        setCurrentFiles(updatedFiles)
    }



    return (
        <div className={classes.root} key={oldDoc?._id}>
            <DescriptionInput
                description={description}
                placeholder={"Para"}
                setDescription={setDescription}
            />
            <span
                onClick={() => {
                    dispatch({ type: "FileUploadReset" });
                    setCurrentPera(oldDoc?._id)
                }}
            >
                <FileUploadButton
                    parentType="Doc"
                    used={false}
                    parentId={null}
                    IconColor="white"
                    iconBig={true}
                    aditionalText={"Add file"}
                    attachIconStyle={classes.attachIconFont}
                    iconWithTextStyle={classes.iconWithTextStyle}
                />
            </span>
            <div className={classes.fileConts} >
                {currentFiles && currentFiles.map((file) => (
                    <div style={{ position: 'relative' }} >
                        <img src={file?.url} />
                        <HighlightOffIcon
                            className={classes.crossIcon}
                            onClick={() => { removeFile(file?._id) }}
                        />
                    </div>
                ))}
            </div>
            <div className={classes.saveContainer} >
                <div></div>
                <Button
                    onClick={() => { update() }}
                    variant="outlined"
                    color="primary"
                >Save</Button>
            </div>
        </div>
    );
}
