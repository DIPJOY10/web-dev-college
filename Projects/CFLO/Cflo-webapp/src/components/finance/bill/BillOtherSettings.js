import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import TopBar from '../newactivity/topbar';
import { useDebounce } from 'react-use';
import { useGetTx } from '../hooks';
import Paper from '@material-ui/core/Paper';
import { DescriptionInput, NewInputBase } from '../styles';
import TxSecondParty from '../transaction/secondParty';
import BillListEdit from '../BillList/bill.list.edit';
import TxBillListEdit from '../transaction/tx.bill.list.edit';
import TxLateFee from '../transaction/lateFee';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import DialogBillNo from './DialogBillNo';
import { getTxByWallet, constrcutArrayOfBillNo, createFileDocs, deleteFileDocs, updateDeleteFlagForManyFiles } from '../transaction/api';
import CommonAppBar from '../../styled/CommonComponents/Commont.AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DocUploadComponent from '../../styled/CommonComponents/DocUploadComponent';
import FilesViewer from '../../file/Viewer/FilesViewer';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {


  },

  memoStyle: {
    marginTop: '2rem',
    maxWidth: '30rem',
  },

  top: {
    marginTop: '2rem',
    marginBottom: '1rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
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
  billEditBody: {
    marginTop: "40px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  nextIcon: {
    transform: 'rotate(180deg)',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  hederText: {
    fontSize: "20px",
    fontWeight: "550",
    marginLeft: "20px",
    [theme.breakpoints.down('sm')]: {
      width: "85px",
      fontSize: "16px",
      marginLeft: "10px",
    },
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
}));

export default function BillOtherSettings(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();

  const {
    tx, setTx, updateApi, walletId, setPageLevel, setLoadingBool
  } = props;
  const {
    col, memoStyle, billEditBody, nextIcon, hederText
  } = classes;

  const { user } = useSelector((state) => state.auth);
  const { createdFileIds } = useSelector((state) => state.file);
  const oldlateFeeApplicable = tx?.lateFeeApplicable || false;
  const [showGL, setShowGL] = useState(oldlateFeeApplicable);
  const [open, setOpen] = useState(false);
  const [txBillNos, setTxBillNos] = useState([]);

  const oldMemo = tx?.memo || ""

  const [memoText, setMemoText] = useState(oldMemo);
  const [maxNo, setMaxNo] = useState()
  const [docName, setDocName] = useState("Receipt Copy")

  const handleClose = () => {
    setOpen(false);
  }
  const onNew = () => {
    setOpen(true);
  };
  useEffect(() => {
    getTxByWallet({ walletId: walletId, type: "Bill" }) // keep bill in an array 
      .then((data) => {
        if (data.length > 0) {
          constrcutArrayOfBillNo(data, "billNo")
            .then((newArr) => {
              setTxBillNos(newArr);
              console.log(txBillNos);

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


  const update = async (obj) => {
    setLoadingBool(true)

    await updateApi(obj)
    setTx({
      ...tx,
      ...obj
    })

    setLoadingBool(false)
  }


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
        const txDocs = tx?.attachedFiles || []
        let docIds = []
        txDocs.length > 0 && txDocs.map((txDoc) => {
          docIds.push(txDoc?._id)
        })

        let newDocsArr = [...docIds, data._id]

        await updateApi({
          _id: tx?._id,
          attachedFiles: newDocsArr,
        }).then((data12) => {
          txDocs.push(data)

          let updatedTx = {
            ...tx,
            attachedFiles: txDocs
          }

          setTx(updatedTx)
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
    let tIdProofDocs = tx?.attachedFiles

    const filteredFileIds = tIdProofDocs.filter(doc => doc?._id != selectedDoc?._id);

    let updatedTx = {
      ...tx,
      attachedFiles: filteredFileIds
    }
    setTx(updatedTx)

    let updatedFileIds = []

    filteredFileIds.length > 0 && filteredFileIds.map((doc) => {
      updatedFileIds.push(doc?._id)
    })

    await updateApi({
      _id: tx?._id,
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
              <KeyboardBackspaceIcon style={{ fontSize: 30, color: theme.palette.primary }} />
            </IconButton>
          ),
          (
            <Typography className={hederText} >
              {walletId === tx?.firstPartyWallet._id ? (<>Expense</>) : (<>Receipt</>)}
              #{tx?.billNo}
            </Typography>
          ),
          (
            <IconButton style={{ marginLeft: "25px" }} color="primary" onClick={() => onNew()} ><EditIcon /></IconButton>
          )
        ]}
        rightItems={[
          (
            tx?.secondParty ? (
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
        txNos={txBillNos}
        tx={tx}
        setTx={setTx}
        type={"Bill"}
        maxNo={maxNo}
        setMaxNo={setMaxNo}
        walletId={walletId}
        setLoadingBool={setLoadingBool}
      />

      <div className={billEditBody} >

        <div style={{ width: "95%" }} >

          <TxSecondParty
            tx={tx}
            setTx={setTx}
            updateApi={updateApi}
            walletId={walletId}
            setLoadingBool={setLoadingBool}
          />

          <div className={memoStyle}>
            <TextField
              id="outlined-multiline-static"
              variant="outlined"
              label="Memo"
              multiline
              rows={2}
              value={memoText}
              onChange={(e) => {
                setMemoText(e.target.value);
                update({
                  _id: tx?._id,
                  memo: e.target.value,
                });
              }}
              style={{ width: "100%" }}
            />
          </div>

          {/* for late fee from */}

          {tx?.type === "Bill" ?
            <></>
            :
            <TxLateFee
              tx={tx}
              setTx={setTx}
              updateApi={updateApi}
              setShowGL={setShowGL}
              walletId={walletId}
            />
          }
          {/* for late fee to */}

          {/* full form with grandTotal from */}
          <TxBillListEdit
            tx={tx}
            setTx={setTx}
            updateApi={updateApi}
            showGL={showGL}
            setLoadingBool={setLoadingBool}
          />
          {/* full form with grandTotal to */}


          <Paper style={{ marginTop: "30px", padding: "15px" }} >
            <DocUploadComponent
              setDocName={setDocName}
              docName={docName}
            />

            <div className={classes.allDocsCont}>
              {tx?.attachedFiles && tx?.attachedFiles?.length > 0 && tx?.attachedFiles.map((doc) => (
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
    </div>
  );
}
