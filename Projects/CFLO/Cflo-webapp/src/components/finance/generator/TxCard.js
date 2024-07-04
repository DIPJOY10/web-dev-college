import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import Tooltip from '@material-ui/core/Tooltip';
import { getTxByTemplateId, getTxByWallet, updateTx } from '../transaction/api';


const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "column",
  },
  txCard: {
    width: "300px",
    height: "150px",
    boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
    borderRadius: "10px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: "30px"
  },
  tableTC: {
    width: "270px"
  },
  trTC: {
    width: "100%",
  },
  tdTC: {
    textAlign: "left",
    paddingLeft: "15px"
  },
  thTC: {
    textAlign: "left",
    paddingLeft: "10px"
  },
  lastDiv: {
    width: "270px",
    display: "flex",
  },
  iconStyle: {
    fontSize: 30,
    color: "#3FA4F2",
  },
}));

export default function TxCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const { walletId } = useParams();

  const { allTxs, setAllTxs, templateId } = props;

  const {
    root, txCard, tableTC, trTC, tdTC, thTC, lastDiv, iconStyle
  } = classes;
  

  const deleteStatusChange = async (data)=>{
    const deleteStatus = data?.deleteStatus || false;
    await updateTx({
        _id : data._id,
        deleteStatus : !deleteStatus
    })
    await getTxByTemplateId({templateId : templateId}) // keep bill in an array 
    .then((AllTemData) =>{
      setAllTxs(AllTemData);
    })
    .catch((error) =>{
          console.log(error);
    })
  }



  return (
    <div className={root}>
      {allTxs.map((allTx) => (
        <div className={txCard} >
          <table className={tableTC} >
            <tr className={trTC} >
              <th className={thTC} >Invoice No</th>
              <th className={thTC} >Deu Date</th>
            </tr>
            <tr className={trTC} >
              {allTx?.type === "Invoice" ? <td className={tdTC} >{allTx?.invNo}</td> : null}
              {allTx?.type === "Bill" ? <td className={tdTC} >{allTx?.billNo}</td> : null}
              <td className={tdTC} >{new Date(allTx?.dueDate).getMonth()+1}/{new Date(allTx?.dueDate).getDate()}/{new Date(allTx?.dueDate).getFullYear()}</td>
            </tr>

            <tr className={trTC} >
              <th className={thTC} >LateFee Amount</th>
              <th className={thTC} >Amount</th>
            </tr>
            <tr className={trTC} >
              <td className={tdTC} >{allTx?.lateFeeAmount}</td>
              <td className={tdTC} >{allTx?.amount}</td>
            </tr>
          </table>
          <div className={lastDiv} >
            <table style={{ width: "40%" }} >
              <tr>
                <th className={thTC} >Date</th>
              </tr>
              <tr>
                <td className={tdTC} >{new Date(allTx?.createdAt).getMonth()+1}/{new Date(allTx?.createdAt).getDate()}/{new Date(allTx?.createdAt).getFullYear()}</td>
              </tr>
            </table>
            <div style={{ width: "60%" }} >
              <Tooltip title="Print" placement="top">
                <IconButton><PrintIcon className={iconStyle} /></IconButton>
              </Tooltip>
              <Tooltip title="Edit/View" placement="top">
                <IconButton
                  onClick={() => {
                    const path = `/admin/${walletId}/tx/${allTx._id}/edit`
                    history.push(path);
                  }}
                ><EditIcon className={iconStyle} /></IconButton>
              </Tooltip>


              <Tooltip title="Delete" placement="top">
                <IconButton><DeleteIcon
                  onClick={()=>{deleteStatusChange(allTx)}}
                 className={iconStyle} /></IconButton>
              </Tooltip>


            </div>
          </div>
        </div>
      ))}

    </div>
  );
}
