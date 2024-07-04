import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import ReactToPrint from 'react-to-print';
import LessText from "../styled/CommonComponents/LessText";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getPropertyImages } from "./api.call";
import SalesComPdf from "./pdfView/SalesComPdf";
import RentComEstimatePdf from "./pdfView/RentComEstimatePdf";
import RentalReportPDF from "./pdfView/Rental.Report.Pdf";
import BRRRRReportPDF from "./pdfView/BRRRR.Report.Pdf";
import FlipReportPDF from "./pdfView/Flip.Report.Pdf";
import { useMediaQuery } from '@material-ui/core';
import RentalProjection from "./Projections/RentalProjection";
import BRRRRProjection from "./Projections/BRRRRProjection";
import FlipProjection from "./Projections/FlipProjection";
import CustomBtn from "../styled/CommonComponents/CustomBtn";

const useStyles = makeStyles((theme) => ({
    titleStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 15px",
    },
    dividers: {
        display: "flex",
        justifyContent: "center",
        "&::-webkit-scrollbar": {
            display: "none"
        },
        scrollbarWidth: "none",
        [theme.breakpoints.down('sm')]: {
            display: "block"
        }
    },
    mainCont: {
        width: "1200px",
    },
    coverCont: {
        width: "100%",
        height: "250px",
        overflowY: "hidden",
        border: "4px solid white",
        borderRadius: "5px",
    },
    coverImg: {
        width: "100%",
        height: "auto"
    },
    profileImg: {
        width: "250px",
        border: "3px solid white",
        borderRadius: "5px",
        marginLeft: "15px",
        marginTop: "-50px",
    },
    propName: {
        fontSize: "30px",
        fontWeight: "500",
        color: theme.palette.primary.main,
    },
    addressCont: {
        fontSize: "18px",
        opacity: "0.8",
        fontWeight: "500",
        margin: "5px 0px",
    },
    typeAreaCont: {
        fontSize: "16px",
        opacity: "0.8",
        fontWeight: "500",
        margin: "5px 0px",
    },
    purchaseCont: {
        fontSize: "20px",
        opacity: "0.8",
        fontWeight: "510",
        color: theme.palette.primary.main,
    },
    selectorCont: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: "15px"
    },
    title: {
        fontSize: "20px",
        marginLeft: "15px",
        fontWeight: "510",
        color: theme.palette.primary.main,
    },
    allDetailsCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 20px",
        paddingTop: "5px"
    },
    subAllDetailsCont: {
        width: "47%",
    },
    labelValue: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "10px 0px",
        fontSize: "13px",
        fontWeight: "500",
    },
    locationStyle: {
        width: "100%",
        height: "400px",
        padding: "0px 20px",
        overflow: "hidden",
    },
    imgMainCont: {
        overflow: "hidden",
    },
    title: {
        fontSize: "20px",
        marginLeft: "15px",
        fontWeight: "510",
        color: theme.palette.primary.main,
        [theme.breakpoints.down("xs")]: {
            fontSize: "17px",
        }
    },
    profileDetails: {
        display: "flex",
        justifyContent: "space-between",
    },
    detailsAndShare: {
        width: "calc(100% - 300px)",
        display: "flex",
        justifyContent: "space-between",
        [theme.breakpoints.down("sm")]: {
            width: "calc(100% - 200px)",
            flexDirection: "column",
        },
        [theme.breakpoints.down("sm")]: {
            width: "calc(100% - 100px)",
            flexDirection: "column",
        }
    },
    detailsCont: {
        marginLeft: "10px",
    },
    imgCont: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: "20px"
    },
    imgStyle: {
        width: "250px",
        height: "auto",
    },
    pageOne: {
        width: "100%",
        height: "1450px",
        backgroundColor: "green",
        overflow: "hidden",
    }
}));

export default function ReportPdf(props) {
    const pdfExportComponent = React.useRef(null);
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const {
        openDialog, setOpenDialog, currentReport, projectData,
        resultData, piePurchaseData, pieRehabData, pieIncomeData,
        pieExpenseData, incomePieChart, rehabOperatingCostsItemized,
        setProjectData, pieHoldingData, pieRefinanceData, pieSellingData
    } = props;

    const [openPDFDialog, setOpenPDFDialog] = useState(false)
    const [propMarker, setPropMarker] = useState([])
    const [imgsArr, setImgsArr] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [yearsArr, setYearsArr] = useState([])

    const [pageHight, setPageHight] = useState(1450)
    const [pageWidth, setPageWidth] = useState(1200)



    const isExSmall = useMediaQuery(theme.breakpoints.down("xs"));
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const isMdSmall = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        setOpenPDFDialog(openDialog)
    }, [openDialog])

    useEffect(() => {
        let obj = [{ latitude: projectData?.latitude, longitude: projectData?.longitude }]
        setPropMarker(obj)
    }, [projectData])

    const handleCloseShare = () => {
        setOpenPDFDialog(false)
        setOpenDialog(false)
    }

    const getProjectImgs = async (projectRes) => {
        setIsLoading(true);
        await getPropertyImages({ zpid: projectRes?.zpid, projectId: projectRes?._id })
            .then((data) => {
                if (data) {
                    setProjectData(data)
                    if (data?.images.length > 9) {
                        let allImgs = data?.images;
                        let len = allImgs.length;
                        let imgArr1 = allImgs.slice(0, 5);
                        let imgArr2 = allImgs.slice(len - 4, len);
                        let finalArr = [...imgArr1, ...imgArr2]
                        setImgsArr(finalArr)
                    } else {
                        setImgsArr(data?.images)
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
        setIsLoading(false);
    }

    useEffect(() => {
        if (projectData?.images && projectData?.images.length > 0) {
            if (projectData?.images.length > 9) {
                let allImgs = projectData?.images;
                let len = allImgs.length;
                let imgArr1 = allImgs.slice(0, 5);
                let imgArr2 = allImgs.slice(len - 4, len);
                let finalArr = [...imgArr1, ...imgArr2]
                setImgsArr(finalArr)
            } else {
                setImgsArr(projectData?.images)
            }
        } else {
            getProjectImgs(projectData)
        }
    }, [projectData])

    const getPageMargins = () => {
        return `@page { margin: 40px 10px 40px 10px !important; }`;
    };

    return (
        <Dialog
            open={openPDFDialog}
            onClose={handleCloseShare}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            PaperProps={{
                style: isExSmall ? {
                    borderRadius: "12px",
                    height: "70vh",
                    maxWidth: isMdSmall ? "1200px" : "1250px"
                } : {
                    borderRadius: "12px",
                    maxWidth: isMdSmall ? "1200px" : "1250px"
                },
            }}
        >
            <DialogTitle style={{ padding: "0px" }} >
                <div className={classes.titleStyle} >
                    <p
                        style={{
                            color: "black",
                            fontSize: "17px"
                        }}
                    >
                        Preview
                    </p>
                    <ClearIcon
                        style={{ color: "black", cursor: "pointer" }}
                        onClick={handleCloseShare}
                    />
                </div>
            </DialogTitle>
            <DialogContent className={classes.dividers} style={{ padding: "0px" }} >
                {(currentReport?._id && projectData?.area > 0 && projectData && currentReport && currentReport?.reportType === "Rental" && currentReport?.Appreciation && currentReport?.IncomeIncrease && currentReport?.SellingCosts && currentReport?.ExpenseIncrease && currentReport?.purchasePrice && currentReport?.ARV && currentReport?.propertyInsurance && currentReport?.propertyTax && currentReport?.GrossRent) ||
                    (currentReport?._id && projectData?.area > 0 && projectData && currentReport && currentReport?.reportType === "BRRRR" && currentReport?.Appreciation && parseInt(currentReport?.rehabPeriod) > 1 && currentReport?.IncomeIncrease && currentReport?.SellingCosts && currentReport?.ExpenseIncrease && currentReport?.purchasePrice && currentReport?.ARV && currentReport?.propertyInsurance && currentReport?.propertyTax && currentReport?.GrossRent) ||
                    (currentReport?._id && projectData?.area > 0 && projectData && currentReport && currentReport?.reportType === "Flip" && currentReport?.purchasePrice && parseInt(currentReport?.rehabPeriod) > 1 && currentReport?.ARV && currentReport?.propertyInsurance && currentReport?.propertyTax) ?
                    (<>
                        <div ref={pdfExportComponent}>
                            <style>{getPageMargins()}</style>
                            <div style={pageWidth ? { width: `${pageWidth}px`, overflow: "hidden" } : { width: "1200px" }} >
                                <div style={pageHight ? { height: `${pageHight}px`, width: "100%", overflow: "hidden" } : { height: "1450px", width: "100%", overflow: "hidden" }} >
                                    <div className={classes.coverCont}>
                                        <img
                                            src={projectData?.displayPicture?.url}
                                            className={classes.coverImg}
                                            alt="cover"
                                        />
                                    </div>
                                    <div className={classes.profileDetails} >
                                        <img
                                            src={projectData?.displayPicture?.url}
                                            alt="profile"
                                            className={classes.profileImg}
                                        />
                                        <div className={classes.detailsAndShare} >
                                            <div className={classes.detailsCont} >
                                                <p className={classes.propName} >
                                                    <LessText
                                                        limit={25}
                                                        string={projectData?.propName || "--------"}
                                                    />
                                                </p>
                                                <p className={classes.addressCont} >
                                                    <LessText
                                                        limit={45}
                                                        string={`${projectData?.address?.streetAddress}, ${projectData?.address?.city}, ${projectData?.address?.region}, ${projectData?.address?.zip}` || "---------"}
                                                    />
                                                </p>
                                                <p className={classes.typeAreaCont} >
                                                    <LessText
                                                        limit={55}
                                                        string={`${projectData?.category} / ${projectData?.subCategory} / ${projectData?.area} sqft` || "--------"}
                                                    />
                                                </p>
                                                <p className={classes.purchaseCont} >
                                                    <LessText
                                                        limit={40}
                                                        string={`$ ${currentReport?.purchasePrice} Purchase Price` || "--------"}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.selectorCont} >
                                        <h3 className={classes.title} >Property Description</h3>
                                        <div></div>
                                    </div>
                                    <div elevation={2} className={classes.allDetailsCont} >
                                        <div className={classes.subAllDetailsCont} >
                                            <div className={classes.labelValue} >
                                                <p>Lot Size</p>
                                                <p>{projectData?.lotSize || "Nan"} sqft</p>
                                            </div>
                                            <div className={classes.labelValue} >
                                                <p>Living Area</p>
                                                <p>{`${projectData?.area || "Nan"} sqft`}</p>
                                            </div>
                                            <div className={classes.labelValue} >
                                                <p>Category</p>
                                                <p>{projectData?.category || "Nan"}</p>
                                            </div>
                                            <div className={classes.labelValue} >
                                                <p>Sub Category</p>
                                                <p>{projectData?.subCategory || "Nan"}</p>
                                            </div>
                                        </div>
                                        <div className={classes.subAllDetailsCont} >
                                            <div className={classes.labelValue} >
                                                <p>Number of Bath</p>
                                                <p>{projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} </p>
                                            </div>
                                            <div className={classes.labelValue} >
                                                <p>Number of Bed</p>
                                                <p>{projectData?.roomNumbers || "Nan"}</p>
                                            </div>
                                            <div className={classes.labelValue} >
                                                <p>MLS Number:</p>
                                                <p>{projectData?.mls || "Nan"}</p>
                                            </div>
                                            <div className={classes.labelValue} >
                                                <p></p>
                                                <p></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.locationStyle} >
                                        {projectData?.description ? (
                                            <div style={{ marginTop: "10px" }} >
                                                <p>{projectData?.description}</p>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                {currentReport?.reportType === "Rental" ? (
                                    <>
                                        <RentalReportPDF
                                            pageHight={`${pageHight}px`}
                                            currentReport={currentReport}
                                            resultData={resultData}
                                            piePurchaseData={piePurchaseData}
                                            pieRehabData={pieRehabData}
                                            pieIncomeData={pieIncomeData}
                                            pieExpenseData={pieExpenseData}
                                            incomePieChart={incomePieChart}
                                            projectData={projectData}
                                            rehabOperatingCostsItemized={rehabOperatingCostsItemized}
                                        />
                                        <RentalProjection
                                            pageHight={`${pageHight}px`}
                                            currentReport={currentReport}
                                            resultData={resultData}
                                            expenseData={pieExpenseData}
                                            isViewOnly={true}
                                            yearsArr={yearsArr}
                                            setYearsArr={setYearsArr}
                                            projectData={projectData}
                                        />
                                    </>
                                ) : null}



                                {currentReport?.reportType === "BRRRR" ? (
                                    <>
                                        <BRRRRReportPDF
                                            pageHight={`${pageHight}px`}
                                            currentReport={currentReport}
                                            pieHoldingData={pieHoldingData}
                                            pieRefinanceData={pieRefinanceData}
                                            resultData={resultData}
                                            piePurchaseData={piePurchaseData}
                                            pieRehabData={pieRehabData}
                                            pieIncomeData={pieIncomeData}
                                            pieExpenseData={pieExpenseData}
                                            incomePieChart={incomePieChart}
                                            rehabOperatingCostsItemized={rehabOperatingCostsItemized}
                                            projectData={projectData}
                                        />
                                        <BRRRRProjection
                                            pageHight={`${pageHight}px`}
                                            currentReport={currentReport}
                                            resultData={resultData}
                                            expenseData={pieExpenseData}
                                            isViewOnly={true}
                                            yearsArr={yearsArr}
                                            setYearsArr={setYearsArr}
                                            projectData={projectData}
                                        />
                                    </>
                                ) : null}

                                {currentReport?.reportType === "Flip" ? (
                                    <>
                                        <FlipReportPDF
                                            pageHight={`${pageHight}px`}
                                            currentReport={currentReport}
                                            resultData={resultData}
                                            pieHoldingData={pieHoldingData}
                                            piePurchaseData={piePurchaseData}
                                            pieRehabData={pieRehabData}
                                            pieSellingData={pieSellingData}
                                            projectData={projectData}
                                            rehabOperatingCostsItemized={rehabOperatingCostsItemized}
                                        />
                                        <FlipProjection
                                            pageHight={`${pageHight}px`}
                                            currentReport={currentReport}
                                            yearsArr={yearsArr}
                                            setYearsArr={setYearsArr}
                                            resultData={resultData}
                                            isViewOnly={true}
                                            projectData={projectData}
                                        />
                                    </>
                                ) : null}


                                <div style={pageHight ? { height: `${pageHight}px`, width: "100%", overflow: "hidden" } : { height: "1450px", width: "100%", overflow: "hidden" }} >
                                    {projectData?.zpid ? (
                                        <SalesComPdf
                                            projectData={projectData}
                                            zpid={projectData?.zpid}
                                            setProjectData={setProjectData}
                                        />
                                    ) : null}
                                    {projectData?.zpid ? (
                                        <RentComEstimatePdf
                                            projectData={projectData}
                                            zpid={projectData?.zpid}
                                            setProjectData={setProjectData}
                                        />
                                    ) : null}
                                </div>


                                {imgsArr && imgsArr.length > 0 ? (
                                    <div className={classes.imgMainCont} >
                                        <div className={classes.selectorCont} >
                                            <h3 className={classes.title} >Property Photos</h3>
                                            <div></div>
                                        </div>
                                        <div className={classes.imgCont} >
                                            {imgsArr.map((img, i) => (
                                                <div>
                                                    <img
                                                        className={classes.imgStyle}
                                                        src={img?.url}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </>) : (<>
                        Loading...
                    </>)}
            </DialogContent>
            <DialogActions>
                <ReactToPrint
                    trigger={() => (
                        <CustomBtn
                            text={"Print"}
                        />
                    )}
                    content={() => pdfExportComponent.current}
                />
            </DialogActions>
        </Dialog>

    );
}