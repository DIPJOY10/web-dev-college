import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import balance_sheet from '../../../Assets/balanceSheet.png';
import loss_Profit from '../../../Assets/Loss_Profit.png';
import ProfitAndLoss from './profit_and_loss';
import BalanceSheet from './balance_sheet';
import PdfShowDialog from './pdfDialog';
import ProfitAndLossPDF from './profit_and_loss/pdf';
import BalanceSheetPDF from './balance_sheet/pdf';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        [theme.breakpoints.down('lg')]: {
            
          },
    },
    relationCard: {
        width: "300px",
        height: "100px",
        border: "1px solid #E1E2E5",
        marginBottom: "10px",
        padding: "10px",
        display: "flex",
        justifyContent: "space-around",
    },
    imgCont: {
        width: "30%",
        heigth: "100%",
    },
    imageStyle: {
        width: "auto",
        height: "100%"
    },
    infoCont: {
        width: "60%",
        heigth: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
    },
    infoTitle: {
        fontSize: "18px",
        fontWeight: "550"
    },
    actBtns: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    }
}));

export default function AllReports(props) {
    const { walletId } = useParams();
    const { accts } = props;
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const {
        root, relationCard, imgCont, imageStyle,
        infoCont, infoTitle, actBtns
    } = classes;

    const [page, setPage] = useState("OptionPage")
    const [reportPage, setReportPage] = useState(null)

    return (
        <>
            {page === "OptionPage" ? (
                <div className={root}>
                    <div className={relationCard} >
                        <div
                            className={imgCont}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setPage("ReportSheetPage")
                                setReportPage("Profit_Loss")
                            }}
                        >
                            <img className={imageStyle} src={loss_Profit} alt={"loss_profit"} />
                        </div>
                        <div className={infoCont} >
                            <Typography
                                className={infoTitle}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setPage("ReportSheetPage")
                                    setReportPage("Profit_Loss")
                                }}
                            >
                                Profit And Loss
                            </Typography>
                            <div className={actBtns} >
                                <div></div>
                                <div>
                                    <PdfShowDialog
                                        PDFReport={
                                            <ProfitAndLossPDF
                                                walletId={walletId}
                                                accts={accts}
                                            />
                                        }
                                        walletId={walletId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={relationCard} >
                        <div
                            className={imgCont}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setPage("ReportSheetPage")
                                setReportPage("Balance_Sheet")
                            }}
                        >
                            <img className={imageStyle} src={balance_sheet} alt={"balance_sheet"} />
                        </div>
                        <div className={infoCont} >
                            <Typography
                                className={infoTitle}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setPage("ReportSheetPage")
                                    setReportPage("Balance_Sheet")
                                }}
                            >
                                Balance Sheet
                            </Typography>
                            <div className={actBtns} >
                                <div></div>
                                <div>
                                <PdfShowDialog
                                        PDFReport={
                                            <BalanceSheetPDF
                                                walletId={walletId}
                                                accts={accts}
                                            />
                                        }
                                        walletId={walletId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {reportPage === "Profit_Loss" && <ProfitAndLoss setPage={setPage} setReportPage={setReportPage} walletId={walletId} accts={accts} />}
                    {reportPage === "Balance_Sheet" && <BalanceSheet setPage={setPage} setReportPage={setReportPage} walletId={walletId} accts={accts} />}
                </div>
            )}
        </>
    );
}
