import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import bg1 from '../../../Assets/TempHeadBg.jpg'
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { getTxTemplateByWallet, updateTxTemplate } from '../transaction/api';
import { calculateEndDate } from './getNextDate';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  cardContTC: {
    width: "300px",
    height: "305px",
    borderRadius: "10px",
    boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px"
  },
  headCont: {
    width: "100%",
    height: "70px",
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    backgroundImage: `url(${bg1})`
  },
  bodyCont: {
    width: "100%",
    height: "240px",
    paddingTop: "35px",
    position: "relative",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    position: "relative",
    top: "40px",
    left: "10px",
    backgroundColor: "white"
  },
  actionCont: {
    width: "170px",
    display: "flex",
    justifyContent: "space-between",
    position: "absolute",
    right: "50px",
  },
  iconStyle: {
    fontSize: 30,
    color: "#3FA4F2",
  },
  placeRow: {
    display: "flex",
    width: "100%",
    paddingRight: "20px",
    paddingLeft: "20px",
  },
  marginL: {
    marginLeft: "15px"
  },
  marginLL: {
    marginLeft: "20px"
  },
  tableTmC: {
    width: "300px"
  },
  tdTC: {
    textAlign: "left",
    width: "90px",
    fontSize: "13px",
    padding: "2px",
    margin: "0px",
    paddingLeft: "20px",
  },
  thTC: {
    textAlign: "left",
    width: "90px",
    fontSize: "13px",
    padding: "2px",
    margin: "0px",
    paddingLeft: "10px",
  },
}));

export default function TemplateCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const { walletId } = useParams();
  const { temData, txLen, setTxTemplates, setActivitySidebar } = props;

  const [data, setData] = useState({})

  useEffect(() => {
    setData(temData)
  }, [temData]);

  const {
    root, cardContTC, headCont, bodyCont, large, tableTmC, tdTC, thTC, actionCont, iconStyle, placeRow, marginL, marginLL
  } = classes;

  const deleteStatusChange = async (field) => {
    setActivitySidebar(false);
    const deleteStatus = data?.deleteStatus || false;
    const oldTemData = data;
    oldTemData.deleteStatus = !deleteStatus
    setData(oldTemData)
    await updateTxTemplate({
      _id: data._id,
      deleteStatus: !deleteStatus
    })
    await getTxTemplateByWallet({ walletId: walletId, type: data?.type }) // keep bill in an array 
      .then((AllTemData) => {
        setTxTemplates(AllTemData);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const runningStatusChange = async () => {
    const generatorRunning = data?.generatorRunning || false;
    const oldTemData = data;
    oldTemData.generatorRunning = !generatorRunning
    setData(oldTemData)
    await updateTxTemplate({
      _id: data._id,
      generatorRunning: !generatorRunning
    })
    await getTxTemplateByWallet({ walletId: walletId, type: data?.type }) // keep bill in an array 
      .then((AllTemData) => {
        setTxTemplates(AllTemData);
      })
      .catch((error) => {
        console.log(error);
      })
  }





  return (
    <div className={root} >
      <div className={cardContTC} >
        <div className={headCont} >
          <Avatar className={large} src={data?.secondParty?.parent?.displayPicture?.thumbUrl} />
        </div>
        <div className={bodyCont} >


          <table className={tableTmC} >
            <tr style={{ height: "20px" }} >
              <th className={thTC} >Template No</th>
              <th className={thTC} >Amount</th>
              <th className={thTC} >Late Fees</th>
            </tr>
            <tr style={{ height: "20px" }} >
              <td className={tdTC} >{data?.type === "Invoice" ? <span>{data?.invNo}</span> : data?.type === "Bill" ? <span>{data?.billNo}</span> : <span>-</span>}</td>
              <td className={tdTC} >{data?.amount}</td>
              <td className={tdTC} >{data?.lateFeeAmount}</td>
            </tr>
            <tr style={{ height: "20px" }} >
              <th className={thTC} >Start Date</th>
              <th className={thTC} >Next Date</th>
              <th className={thTC} >End Date</th>
            </tr>
            <tr style={{ height: "20px" }} >
              <td className={tdTC} >{new Date(data?.schedulingData?.startDate).getMonth() + 1}/{new Date(data?.schedulingData?.startDate).getDate()}/{new Date(data?.schedulingData?.startDate).getFullYear()}</td>
              <td className={tdTC} >{data?.schedulingData?.nextDate}</td>
              {data?.schedulingData?.endType === "By" ?
                <td className={tdTC} >{new Date(data?.schedulingData?.stopDate).getMonth() + 1}/{new Date(data?.schedulingData?.stopDate).getDate()}/{new Date(data?.schedulingData?.stopDate).getFullYear()}</td>
                : null}
              {data?.schedulingData?.endType === "After" ?
                <td className={tdTC} >{calculateEndDate(data)}</td>
                : null}






            </tr>
          </table>
          <table className={tableTmC} >
            <tr style={{ height: "20px" }} >
              <th className={thTC} >Number Of Transactions</th>
            </tr>
            <tr style={{ height: "20px" }} >
              <td className={tdTC} >{txLen}</td>
            </tr>
          </table>

          <div className={actionCont} >
            <Tooltip title="Print" placement="top">
              <IconButton
                onClick={() => { }}
              ><PrintIcon className={iconStyle} /></IconButton>
            </Tooltip>
            <Tooltip title="Edit/View" placement="top">
              <IconButton
                onClick={() => {
                  const path = `/admin/${walletId}/txtmplate/${data._id}/edit`
                  history.push(path);
                }}
              ><EditIcon className={iconStyle} /></IconButton>
            </Tooltip>

            <Tooltip title="Delete" placement="top">
              <IconButton
                onClick={() => { deleteStatusChange() }}
              ><DeleteIcon className={iconStyle} /></IconButton>
            </Tooltip>


            {data?.generatorRunning ?
              <Tooltip title="Stop" placement="top">
                <IconButton
                  onClick={() => { runningStatusChange() }}
                ><AlarmOffIcon className={iconStyle} /></IconButton>
              </Tooltip>
              :
              <Tooltip title="Start" placement="top">
                <IconButton
                  onClick={() => { runningStatusChange() }}
                ><AlarmOnIcon className={iconStyle} /></IconButton>
              </Tooltip>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
