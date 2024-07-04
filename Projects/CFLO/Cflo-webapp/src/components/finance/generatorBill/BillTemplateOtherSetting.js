import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { DescriptionInput } from '../styles';
import TxSecondParty from '../transaction/secondParty';
import TxBillListEdit from '../transaction/tx.bill.list.edit';
import TxLateFee from '../transaction/lateFee';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DialogBillNo from '../bill/DialogBillNo';
import TextField from '@material-ui/core/TextField';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import {
    constrcutArrayOfBillNo, getTxTemplateByWallet, updateTxTemplate,
    updateTxTemplateScheduleData, createFileDocs, deleteFileDocs,
    updateDeleteFlagForManyFiles
} from '../transaction/api';
import Interval from '../generator/Interval';
import Paper from '@material-ui/core/Paper';
import { schedules } from '../generator/IntervalData';
import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CommonAppBar from '../../styled/CommonComponents/Commont.AppBar';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import DocUploadComponent from '../../styled/CommonComponents/DocUploadComponent';
import FilesViewer from '../../file/Viewer/FilesViewer';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
    root: {


    },
    iconButtonStyle: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: "-10px"
        },
    },
    memoStyle: {
        marginTop: '2rem',
        maxWidth: '30rem',
    },
    top: {
        marginTop: '2rem',
        marginBottom: '1rem',
    },
    col: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: "50px"
    },
    alignCenter: {
        alignItems: 'center',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    datePicker: {
        width: 150,
    },

    alignSwitch: {
        width: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    alignSwitchShow: {
        width: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down('xs')]: {
            display: "none"
        }
    },
    hederText: {
        fontSize: "19px",
        fontWeight: "550",
        [theme.breakpoints.down('md')]: {
            width: "105px",
            fontSize: "10px",
        },
    },
    jNameAndMemoCont: {
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'column',
        },
    },
    mainCont: {
        marginLeft: "40px",
        marginTop: "40px",
        [theme.breakpoints.down('md')]: {
            marginLeft: "10px",
        },
    },
    nextIcon: {
        transform: 'rotate(180deg)',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    allDocsCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "40px",
        flexWrap: "wrap",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            justifyContent: "center",
        }
    },
    docsAndTitleCont: {
        width: "45%",
        border: "1px solid gray",
        marginBottom: "20px",
        [theme.breakpoints.down('sm')]: {
            width: "95%",
        }
    },
    subAddressCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
    },
    allDocsContPaper: {
        width: "98%",
        marginTop: "30px",
        padding: "15px"
    },
    templateHeader: {
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down('xs')]: {
            flexDirection: "column",
        }
    },
    switchCont: {
        width: "98%",
        display: "none",
        alignItems: "center",
        justifyContent: "space-between",
        marginBotton: "20px",
        marginTop: "-20px",
        [theme.breakpoints.down('xs')]: {
            display: "flex"
        }
    }
}));

export default function BillTemplateOtherSetting(props) {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const dispatch = useDispatch();

    const {
        txTemplate, setTxTemplate, walletId, setPageLevel, setLoadingBool
    } = props;
    const {
        col, memoStyle, topScheduling, scheduleCond,
        nameCl, InputBox, marginText, alignSwitch,
        hederText, KeyboardBackspaceIconSty, mainCont,
        scheduleText, schedulPaperSty, nextIcon
    } = classes;

    const { user } = useSelector((state) => state.auth);
    const { createdFileIds } = useSelector((state) => state.file);
    const oldlateFeeApplicable = txTemplate?.lateFeeApplicable || false;
    const [showGL, setShowGL] = useState(oldlateFeeApplicable);
    const [open, setOpen] = useState(false);
    const [txTemplateBillNos, setTxTemplateBillNos] = useState([]);
    const [textSchedule, setScheduleText] = useState("");

    const oldTemlateName = txTemplate?.name || "";
    const [templateName, setTemplateName] = useState(oldTemlateName);

    const oldScheduleValue = txTemplate?.scheduleType || schedules[0];
    const [scheduleValue, setScheduleValue] = useState(oldScheduleValue)

    const oldScheduleDays = txTemplate?.scheduleDaysInAdvance || '0';
    const [scheduleDays, setScheduleDays] = useState(oldScheduleDays)

    const oldScheduleReminderDays = txTemplate?.reminderBeforeDays || '0';
    const [scheduleReminder, setScheduleReminder] = useState(oldScheduleReminderDays)

    const oldSwitchState = txTemplate?.generatorRunning || false;
    const [switchState, setSwitchState] = useState(oldSwitchState)

    const [maxNo, setMaxNo] = useState()
    const [docName, setDocName] = useState("Receipt Copy")

    const handleClose = () => {
        setOpen(false);
    }
    const onNew = () => {
        setOpen(true);
    };

    const getOptionLabel = (option) => {
        return option || " ";
    };

    const onScheduleSelect = async (value) => {
        await updateTxTemplate({
            _id: txTemplate?._id,
            scheduleType: value
        })
        setScheduleValue(value)
    }

    useEffect(() => {
        getTxTemplateByWallet({ walletId: walletId, type: "Bill" }) // keep bill in an array 
            .then((data) => {
                if (data.length > 0) {
                    constrcutArrayOfBillNo(data, "billNo")
                        .then((newArr) => {
                            setTxTemplateBillNos(newArr);
                            console.log(newArr);

                            let maxNoff = 1
                            newArr.map((number) => {
                                if (parseInt(number) > maxNoff) {
                                    maxNoff = parseInt(number)
                                }
                            })
                            setMaxNo(maxNoff)

                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);



    useEffect(() => {
        if (createdFileIds.length > 0) {
            createNewDocs(createdFileIds)
        }
    }, [createdFileIds])


    const createNewDocs = async (fileIds) => {
        setLoadingBool(true)
        await createFileDocs({
            title: docName,
            description: "Invoice Uploaded File",
            files: fileIds,
            profile: user?.profile,
            user: user?._id,
        })
            .then(async (data) => {
                const txDocs = txTemplate?.attachedFiles || []
                let docIds = []
                txDocs.length > 0 && txDocs.map((txDoc) => {
                    docIds.push(txDoc?._id)
                })

                let newDocsArr = [...docIds, data._id]

                await updateTxTemplate({
                    _id: txTemplate?._id,
                    attachedFiles: newDocsArr,
                }).then((data12) => {
                    txDocs.push(data)

                    let updatedTx = {
                        ...txTemplate,
                        attachedFiles: txDocs
                    }

                    setTxTemplate(updatedTx)
                })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err);
            })

        dispatch({ type: "FileUploadReset" });
        setDocName("Receipt Copy")

        setLoadingBool(false)
    }



    const deleteDocAndUpdate = async (selectedDoc) => {
        setLoadingBool(true)

        let fileIDs = selectedDoc?.files
        let tIdProofDocs = txTemplate?.attachedFiles

        const filteredFileIds = tIdProofDocs.filter(doc => doc?._id != selectedDoc?._id);

        let updatedTx = {
            ...txTemplate,
            attachedFiles: filteredFileIds
        }
        setTxTemplate(updatedTx)

        let updatedFileIds = []

        filteredFileIds.length > 0 && filteredFileIds.map((doc) => {
            updatedFileIds.push(doc?._id)
        })

        await updateTxTemplate({
            _id: txTemplate?._id,
            attachedFiles: updatedFileIds
        }).then((data) => {

            deleteFileDocs({ docId: selectedDoc?._id })
                .then((deletedDoc) => {

                    updateDeleteFlagForManyFiles({ fileIds: fileIDs })
                        .then((data) => {
                            console.log(data)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        })
            .catch((err) => {
                console.log(err)
            })
        setLoadingBool(false)
    }



    return (
        <div className={col}>
            <CommonAppBar
                leftItems={[
                    (
                        <IconButton className={classes.iconButtonStyle} onClick={() => {
                            history.goBack()

                        }}>
                            <KeyboardBackspaceIcon className={KeyboardBackspaceIconSty} />
                        </IconButton>
                    ),
                    (
                        <Typography className={hederText} >
                            BILL GENERATOR #{txTemplate?.billNo}
                        </Typography>
                    ),
                    (
                        <IconButton color="primary" onClick={() => onNew()} ><EditIcon /></IconButton>
                    )
                ]}
                rightItems={[
                    (
                        txTemplate?.secondParty ? (
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<span className={nextIcon} ><KeyboardBackspaceIcon /></span>}
                                onClick={() => { setPageLevel("paymentSettings") }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<span className={nextIcon} ><KeyboardBackspaceIcon /></span>}
                                disabled
                            >
                                Next
                            </Button>
                        )
                    )
                ]}
            />
            <DialogBillNo
                open={open}
                handleClose={handleClose}
                txNos={txTemplateBillNos}
                tx={txTemplate}
                setTx={setTxTemplate}
                type={"BillTemplate"}
                maxNo={maxNo}
                setMaxNo={setMaxNo}
                walletId={walletId}
                setLoadingBool={setLoadingBool}
            />

            <div className={mainCont} >
                <TxSecondParty
                    tx={txTemplate}
                    setTx={setTxTemplate}
                    updateApi={updateTxTemplate}
                    walletId={walletId}
                    setLoadingBool={setLoadingBool}
                />

                <div className={memoStyle}>
                    <DescriptionInput
                        text={txTemplate?.memo}
                        setText={(memoNew) => {

                        }}
                        placeholder='Memo'
                    />
                </div>

                {/* for late fee from */}
                <TxLateFee
                    tx={txTemplate}
                    setTx={setTxTemplate}
                    setShowGL={setShowGL}
                    walletId={walletId}
                    updateApi={updateTxTemplate}
                />
                {/* for late fee to */}

                {/* full form with grandTotal from */}
                <TxBillListEdit
                    tx={txTemplate}
                    setTx={setTxTemplate}
                    showGL={showGL}
                    updateApi={updateTxTemplate}
                    setLoadingBool={setLoadingBool}
                />
                {/* full form with grandTotal to */}

                <Paper style={{ marginTop: "30px", padding: "15px" }} >
                    <DocUploadComponent
                        setDocName={setDocName}
                        docName={docName}
                    />
                    <div className={classes.allDocsCont}>
                        {txTemplate?.attachedFiles && txTemplate?.attachedFiles?.length > 0 && txTemplate?.attachedFiles.map((doc) => (
                            <div className={classes.docsAndTitleCont} >
                                <div className={classes.subAddressCont}>
                                    <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }} >
                                        <InsertDriveFileIcon style={{ color: "#2193EF" }} />
                                        <Typography
                                            style={{
                                                fontSize: "17px",
                                                color: "#2193EF",
                                                marginLeft: "10px"
                                            }}
                                        >
                                            {doc?.title}
                                        </Typography>
                                    </div>
                                    <IconButton
                                        onClick={() => { deleteDocAndUpdate(doc) }}
                                    >
                                        <CloseIcon
                                            style={{
                                                color: "red",
                                                cursor: "pointer"
                                            }}
                                        />
                                    </IconButton>
                                </div>

                                <FilesViewer
                                    fileIds={doc?.files}
                                    styleBody={{
                                        width: '80%',
                                        height: 'auto',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </Paper>
            </div>
        </div>
    );
}
