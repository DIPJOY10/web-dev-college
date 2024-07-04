import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { getReport, getPropertyImages } from "./api.call";
import SmallReportCard from "../ProjectAnalysis/SmallReportCard.js"
import SalesSuggestion from "./SalesSuggestion";
import RentSuggestion from "./RentSuggestion";
import ClearIcon from '@material-ui/icons/Clear';
import Dialog from "@material-ui/core/Dialog";
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import LocalHotelIcon from '@material-ui/icons/LocalHotel';
import BathtubIcon from '@material-ui/icons/Bathtub';
import ApartmentIcon from '@material-ui/icons/Apartment';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import RentEstimate from "./RentEstimate";
import config from "../../config/index";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Typography } from "@material-ui/core";
import subCategory from "../../Assets/subCategory.svg"
import ImageGallery from 'react-image-gallery';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ReportShareDialog from "./ReportShareDialog";
import LessText from "../styled/CommonComponents/LessText.js"
import CircularProgress from '@material-ui/core/CircularProgress';
import ReportPdf from "./ReportPdf";
import Footer from "../landing/footer/footer";
import GoogleMapComponent from "../styled/CommonComponents/Google.Map";
import RentalReport from "./Reports/RentalReport";
import BRRRRReport from "./Reports/BRRRRReport";
import FlipReport from "./Reports/FlipReport";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from '@material-ui/core';
import RentalProjection from "./Projections/RentalProjection";
import FlipProjection from "./Projections/FlipProjection";
import BRRRRProjection from "./Projections/BRRRRProjection";
import CustomBtn from "../styled/CommonComponents/CustomBtn";


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        padding: "1px 130px",
        [theme.breakpoints.down("md")]: {
            padding: "1px 10px",
        },
        [theme.breakpoints.down("xs")]: {
            padding: "1px 5px",
        }
    },
    selectorCont: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: "40px"
    },
    autoCont: {
        width: "200px",
        marginRight: "30px"
    },
    title: {
        fontSize: "28px",
        fontWeight: "510",
        color: "#00345D",
        [theme.breakpoints.down("xs")]: {
            fontSize: "17px",
        }
    },
    coverImg: {
        width: "100%",
        height: "auto"
    },
    mainCont: {
        marginTop: "30px",
        [theme.breakpoints.down("xs")]: {
            marginTop: "10px",
        }
    },
    coverCont: {
        height: "300px",
        overflowY: "hidden",
        border: "5px solid white",
        borderRadius: "10px",
        [theme.breakpoints.down("sm")]: {
            height: "220px",
        },
        [theme.breakpoints.down("xs")]: {
            height: "140px",
        }
    },
    profileDetails: {
        display: "flex",
        justifyContent: "space-between",
    },
    profileImg: {
        width: "300px",
        border: "4px solid white",
        borderRadius: "6px",
        marginLeft: "15px",
        marginTop: "-60px",
        [theme.breakpoints.down("sm")]: {
            width: "200px",
            marginTop: "-40px",
        },
        [theme.breakpoints.down("xs")]: {
            width: "100px",
            marginTop: "-20px",
            marginLeft: "10px",
        }
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
        marginLeft: "20px",
        [theme.breakpoints.down("sm")]: {
            marginBottom: "20px",
        },
        [theme.breakpoints.down("xs")]: {
            marginBottom: "0px",
            marginLeft: "5px",
        },
    },
    propName: {
        fontSize: "35px",
        fontWeight: "500",
        color: theme.palette.primary.main,
        [theme.breakpoints.down("sm")]: {
            fontSize: "25px",
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: "20px",
        },
    },
    addressCont: {
        fontSize: "18px",
        opacity: "0.8",
        fontWeight: "500",
        margin: "5px 0px",
        [theme.breakpoints.down("sm")]: {
            fontSize: "15px",
            margin: "0px",
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: "12px",
            margin: "0px",
        }
    },
    typeAreaCont: {
        fontSize: "16px",
        opacity: "0.8",
        fontWeight: "500",
        margin: "5px 0px",
        [theme.breakpoints.down("sm")]: {
            fontSize: "14px",
            margin: "0px",
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: "11px",
            margin: "0px",
        },
    },
    purchaseCont: {
        fontSize: "20px",
        opacity: "0.8",
        fontWeight: "510",
        color: theme.palette.primary.main,
        [theme.breakpoints.down("sm")]: {
            fontSize: "17px",
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: "13px",
        },
    },
    allDetailsCont: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        marginTop: "20px",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column"
        }
    },
    subAllDetailsCont: {
        width: "45%",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        }
    },
    labelValue: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "10px 0px",
        fontSize: "15px",
        fontWeight: "500",
        [theme.breakpoints.down("xs")]: {
            fontSize: "13px",
        }
    },
    descriptionCont: {
        padding: "30px",
        marginBottom: "60px",
        marginTop: "20px",
        fontSize: "16px",
        color: "#626060",
        borderRadius: "15px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        [theme.breakpoints.down("xs")]: {
            padding: "20px 10px",
            fontSize: "14px",
        }
    },
    imgCont: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        marginTop: "20px"
    },
    imgIconCont: {
        position: "relative",
        cursor: "zoom-in",
        marginLeft: "10px",
        [theme.breakpoints.down("xs")]: {
            marginLeft: "0px",
        }
    },
    imgStyle: {
        width: "300px",
        height: "auto",
        [theme.breakpoints.down("sm")]: {
            width: "200px",
        },
        [theme.breakpoints.down("xs")]: {
            width: "140px",
        },
    },
    titleStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 15px",
        backgroundColor: theme.palette.primary.main
    },
    iconText: {
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        marginLeft: "20px",
        cursor: "pointer",
        "& p": {
            margin: "0px 5px"
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: "12px"
        }
    },
    shareIcon: {
        [theme.breakpoints.down("xs")]: {
            fontSize: "16px"
        }
    },
    downloadIcon: {
        [theme.breakpoints.down("xs")]: {
            fontSize: "16px"
        }
    },
    shareDownload: {
        display: "flex",
        alignItems: "flex-end",
        [theme.breakpoints.down("sm")]: {
            marginTop: "25px"
        }
    },
    shareDownloadForSmall: {
        display: "none",
        alignItems: "flex-end",
        marginTop: "15px",
        [theme.breakpoints.down("xs")]: {
            display: "flex",
        }
    },
    bottomBtnCont: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "50px"
    },
    shareBtn: {
        marginRight: "30px"
    },
    progressCont: {
        width: "100%",
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    footerTop: {
        backgroundColor: "#2e73f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "15px 20px",
        marginTop: "60px",
        "& a": {
            textDecoration: "none",
            color: "white"
        }
    },
    details: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",
        width: '100%',
        height: "150px",
        marginTop: "20px",
        backgroundColor: "white",
        padding: "20px 35px",
        borderRadius: "10px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        [theme.breakpoints.down("md")]: {
            width: '100%',
            padding: "10px 25px",
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: "200px",
            padding: "10px 5px",
            alignItems: 'flex-start',
            flexDirection: 'column',
        }
    },
    dualFeatureCont: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-around",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "row",
        }
    },
    singleDetailCont: {
        width: "160px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        height: "50px",
        [theme.breakpoints.down('xs')]: {
            width: "145px",
        }
    },
    detailTitle: {
        fontSize: "14px",
        fontWeight: "550",
        color: "#808494",
        [theme.breakpoints.down('xs')]: {
            fontSize: "13px",
        }
    },
    featureStyle: {
        display: "flex",
        alignItems: "center",
        marginTop: "3px"
    },
    featureIconStyle: {
        fontSize: "22px",
        color: "#808494",
        marginRight: "5px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "17px",
        }
    },
    featureIconStyle: {
        fontSize: "22px",
        color: "#808494",
        marginRight: "5px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "17px",
        }
    },
    imgDetailsCont: {
        display: "flex",
        "& img": {
            width: "300px",
            maxHeight: "180px",
            borderRadius: "15px",
        },
        [theme.breakpoints.down('md')]: {
            flexDirection: "column"
        }
    },
    detailsCont: {
        width: 'calc(100% - 340px)',
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginLeft: "40px",
        [theme.breakpoints.down('md')]: {
            width: '100%',
            marginLeft: "0px",
            marginTop: "15px"
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
        }
    },
    namePriceAddress: {
        "& h3": {
            fontSize: "26px",
            color: "#000929",
            marginBottom: "15px"
        },
        "& p": {
            fontSize: "17px",
            color: "#808494"
        },
        "& h4": {
            color: theme.palette.primary.main,
            fontSize: "18px",
            marginTop: "15px"
        },
        [theme.breakpoints.down('sm')]: {
            "& h3": {
                fontSize: "22px",
                marginBottom: "5px",
                fontWeight: "510"
            },
            "& p": {
                fontSize: "14px",
            },
            "& h4": {
                color: theme.palette.primary.main,
                fontSize: "18px",
                marginTop: "15px",
                fontWeight: "500"
            }
        }
    }
}));

export default function GuestReportView(props) {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme()
    const { reportId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [currentReport, setCurrentReport] = useState(null);
    const [rehabOperatingCostsItemized, setRehabOperatingCostsItemize] = useState()
    const [piePurchaseData, setPiePurchaseData] = useState([])
    const [pieRehabData, setPieRehabData] = useState([])
    const [pieIncomeData, setPieIncomeData] = useState([])
    const [pieRefinanceData, setPieRefinanceData] = useState([])
    const [pieSellingData, setPieSellingData] = useState([])
    const [pieExpenseData, setExpenseData] = useState([]);
    const [pieHoldingData, setHoldingData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [yearsArr, setYearsArr] = useState([]);
    const [propMarker, setPropMarker] = useState([])
    const [imgsArr, setImgsArr] = useState([])
    const [imgsObjArr, setImgsObjArr] = useState([])
    const [selectedImg, setSelectedImg] = useState(0);
    const [openPhoto, setOpenPhoto] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [incomePieChart, setIncomePieChart] = useState([]);

    const isExSmall = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        let localPieIncomeData = [...pieIncomeData]
        let grossObj = new Object({
            name: "Gross_Rent",
            value: Number(parseFloat(resultData?.GrossRentPerMonth).toFixed(2))
        })
        localPieIncomeData.push(grossObj)
        setIncomePieChart(localPieIncomeData)
    }, [pieIncomeData, resultData])

    const handleClosePhoto = () => {
        setOpenPhoto(false)
    }

    const getProjectImgs = async (projectRes) => {
        await getPropertyImages({ zpid: projectRes?.zpid, projectId: projectRes?._id })
            .then((data) => {
                if (data) {
                    setProjectData(data)
                    setImgsArr(data?.images)
                    const imgurlArr = data?.images
                    let imgObjArr = []
                    imgurlArr.map((img) => {
                        imgObjArr.push({
                            original: img?.url,
                            thumbnail: img?.url,
                        })
                    })
                    setImgsObjArr(imgObjArr)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        setIsLoading(true);
        getReport(reportId)
            .then(async (data) => {

                console.log(data)

                setCurrentReport(data);
                const projectRes = data?.teamData?.parent;
                setProjectData(projectRes);

                let obj = [{
                    latitude: projectRes?.latitude,
                    longitude: projectRes?.longitude,
                    label: projectRes?.displayName,
                    character: projectRes?.displayName ? projectRes.displayName.charAt(0) : "P",
                    marker_color: "FF5F1F",
                    marker_text_color: "ffffff",
                }]
                setPropMarker(obj)

                if (projectRes?.images && projectRes?.images.length > 0) {
                    setImgsArr(projectRes?.images)
                    let imgObjArr = []
                    const imgurlArr = projectRes?.images
                    imgurlArr.map((img) => {
                        imgObjArr.push({
                            original: img?.url,
                            thumbnail: img?.url,
                        })
                    })
                    setImgsObjArr(imgObjArr)
                } else {
                    await getProjectImgs(projectRes)
                }

                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [reportId])



    return (
        <div style={{ backgroundColor: "white" }} >
            {isLoading ? (
                <div className={classes.progressCont} >
                    <CircularProgress />
                </div>
            ) : (<>
                {(currentReport?._id && projectData?.area > 0 && projectData && currentReport && currentReport?.reportType === "Rental" && currentReport?.Appreciation && currentReport?.IncomeIncrease && currentReport?.SellingCosts && currentReport?.ExpenseIncrease && currentReport?.purchasePrice && currentReport?.ARV && currentReport?.propertyInsurance && currentReport?.propertyTax && currentReport?.GrossRent) ||
                    (currentReport?._id && projectData?.area > 0 && projectData && currentReport && currentReport?.reportType === "BRRRR" && currentReport?.Appreciation && parseInt(currentReport?.rehabPeriod) > 1 && currentReport?.IncomeIncrease && currentReport?.SellingCosts && currentReport?.ExpenseIncrease && currentReport?.purchasePrice && currentReport?.ARV && currentReport?.propertyInsurance && currentReport?.propertyTax && currentReport?.GrossRent) ||
                    (currentReport?._id && projectData?.area > 0 && projectData && currentReport && currentReport?.reportType === "Flip" && currentReport?.purchasePrice && parseInt(currentReport?.rehabPeriod) > 1 && currentReport?.ARV && currentReport?.propertyInsurance && currentReport?.propertyTax) ?
                    (<>
                        <div className={classes.root} >
                            <SmallReportCard
                                currentReport={currentReport}
                                projectData={projectData}
                                setResultData={setResultData}
                                setRehabOperatingCostsItemize={setRehabOperatingCostsItemize}
                                setPiePurchaseData={setPiePurchaseData}
                                setPieRehabData={setPieRehabData}
                                setPieIncomeData={setPieIncomeData}
                                setPieRefinanceData={setPieRefinanceData}
                                setPieSellingData={setPieSellingData}
                                setExpenseData={setExpenseData}
                                setHoldingData={setHoldingData}
                            />
                            <div className={classes.mainCont} >
                                <div style={{ display: "flex", justifyContent: "flex-start", margin: "10px 0px 25px" }} >
                                    <a style={isExSmall ? { color: "#065cf4", fontSize: "12px" } : { color: "#065cf4", fontSize: "16px" }} href={`${config?.BASE_URL}investment/analysis/new`} target="_blank" >
                                        Analyze any investment property with ContractFlo
                                        <OpenInNewIcon style={{ display: 'inline', fontSize: "18px", marginBottom: "-4px" }} />
                                    </a>
                                </div>
                                <div className={classes.imgDetailsCont} >
                                    <img src={projectData?.displayPicture?.url} />
                                    <div className={classes.detailsCont} >
                                        <div className={classes.namePriceAddress} >
                                            <h3>
                                                <LessText
                                                    limit={18}
                                                    string={projectData?.propName || "--------"}
                                                />
                                            </h3>
                                            <p>
                                                <LessText
                                                    limit={33}
                                                    string={`${projectData?.address?.streetAddress}, ${projectData?.address?.city}, ${projectData?.address?.region}, ${projectData?.address?.zip}` || "---------"}
                                                />
                                            </p>
                                            <p>
                                                <LessText
                                                    limit={40}
                                                    string={`${projectData?.category} / ${projectData?.subCategory} / ${projectData?.area} sqft` || "--------"}
                                                />
                                            </p>
                                            <h4>
                                                <LessText
                                                    limit={28}
                                                    string={`$ ${currentReport?.purchasePrice} Purchase Price` || "--------"}
                                                />
                                            </h4>
                                        </div>
                                        <div className={classes.shareDownload} >
                                            <CustomBtn
                                                text={isExSmall ? "" : "Share"}
                                                onClick={() => { setOpenShareDialog(true) }}
                                                startPart={<ScreenShareIcon />}
                                                style={isExSmall ? { paddingRight: "0px", paddingLeft: "13px", marginRight: "10px" } : { marginRight: "10px" }}
                                            />
                                            <CustomBtn
                                                text={isExSmall ? "" : "Download PDF"}
                                                onClick={() => { setOpenDialog(true); }}
                                                startPart={<CloudDownloadIcon />}
                                                style={isExSmall ? { paddingRight: "0px", paddingLeft: "13px" } : {}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div className={classes.selectorCont} >
                                <h3 className={classes.title} >Property Description</h3>
                                <div></div>
                            </div>
                            <div className={classes.details}>
                                <div className={classes.dualFeatureCont} >
                                    <div className={classes.singleDetailCont} >
                                        <Typography className={classes.detailTitle} variant="subtitle2">Living Area</Typography>
                                        <div className={classes.featureStyle} >
                                            <ZoomOutMapIcon className={classes.featureIconStyle} />
                                            <Typography className={classes.featureValueStyle} >{`${projectData?.area || "Nan"} sqft`}</Typography>
                                        </div>
                                    </div>
                                    <div className={classes.singleDetailCont} >
                                        <Typography className={classes.detailTitle} variant="subtitle2">Lot Size</Typography>
                                        <div className={classes.featureStyle} >
                                            <ZoomOutMapIcon className={classes.featureIconStyle} />
                                            <Typography className={classes.featureValueStyle} >{projectData?.lotSize || "Nan"} sqft</Typography>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.dualFeatureCont} >
                                    <div className={classes.singleDetailCont} >
                                        <Typography className={classes.detailTitle} variant="subtitle2">Category</Typography>
                                        <div className={classes.featureStyle} >
                                            <ApartmentIcon className={classes.featureIconStyle} />
                                            <Typography className={classes.featureValueStyle} >{projectData?.category || "Nan"}</Typography>
                                        </div>
                                    </div>
                                    <div className={classes.singleDetailCont} >
                                        <Typography className={classes.detailTitle} variant="subtitle2">Sub Category</Typography>
                                        <div className={classes.featureStyle} >
                                            <img src={subCategory} style={{ height: "22px", marginRight: "6px" }} />
                                            <Typography className={classes.featureValueStyle} >{projectData?.subCategory || "Nan"}</Typography>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.dualFeatureCont} >
                                    <div className={classes.singleDetailCont} >
                                        <Typography className={classes.detailTitle} variant="subtitle2">Number of Bath</Typography>
                                        <div className={classes.featureStyle} >
                                            <BathtubIcon className={classes.featureIconStyle} />
                                            <Typography className={classes.featureValueStyle} >{projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} </Typography>
                                        </div>
                                    </div>
                                    <div className={classes.singleDetailCont} >
                                        <Typography className={classes.detailTitle} variant="subtitle2">Number of Bed</Typography>
                                        <div className={classes.featureStyle} >
                                            <LocalHotelIcon className={classes.featureIconStyle} />
                                            <Typography className={classes.featureValueStyle} >{projectData?.roomNumbers || "Nan"}</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {projectData?.latitude && projectData?.longitude ? (
                                <>
                                    <div className={classes.selectorCont} >
                                        <h3 className={classes.title} >Property Location</h3>
                                        <div></div>
                                    </div>
                                    <div style={{ marginTop: "20px" }} >
                                        <GoogleMapComponent
                                            marks={propMarker}
                                            MakerType={"maker"}
                                            height={330}
                                            redius={800}
                                        />
                                    </div>
                                </>
                            ) : null}
                            {currentReport && currentReport?.reportType === "Rental" && resultData && rehabOperatingCostsItemized && piePurchaseData && pieRehabData && pieIncomeData && pieExpenseData ? (
                                <>
                                    <div className={classes.selectorCont} >
                                        <h3 className={classes.title} >Property Analysis</h3>
                                        <div></div>
                                    </div>
                                    <RentalReport
                                        currentReport={currentReport}
                                        resultData={resultData}
                                        isViewOnly={true}
                                        rehabOperatingCostsItemized={rehabOperatingCostsItemized}
                                        piePurchaseData={piePurchaseData}
                                        pieRehabData={pieRehabData}
                                        pieIncomeData={pieIncomeData}
                                        pieExpenseData={pieExpenseData}
                                        projectData={projectData}
                                    />
                                    <RentalProjection
                                        currentReport={currentReport}
                                        resultData={resultData}
                                        expenseData={pieExpenseData}
                                        yearsArr={yearsArr}
                                        setYearsArr={setYearsArr}
                                        isViewOnly={true}
                                        projectData={projectData}
                                    />
                                </>
                            ) : null}
                            {currentReport && currentReport?.reportType === "BRRRR" && resultData && rehabOperatingCostsItemized && piePurchaseData && pieRehabData && pieIncomeData && pieExpenseData && pieHoldingData && pieRefinanceData ? (
                                <>
                                    <div className={classes.selectorCont} >
                                        <h3 className={classes.title} >Property Analysis</h3>
                                        <div></div>
                                    </div>
                                    <BRRRRReport
                                        currentReport={currentReport}
                                        resultData={resultData}
                                        isViewOnly={true}
                                        rehabOperatingCostsItemized={rehabOperatingCostsItemized}
                                        piePurchaseData={piePurchaseData}
                                        pieRehabData={pieRehabData}
                                        pieIncomeData={pieIncomeData}
                                        pieExpenseData={pieExpenseData}
                                        pieHoldingData={pieHoldingData}
                                        pieRefinanceData={pieRefinanceData}
                                        projectData={projectData}
                                    />
                                    <BRRRRProjection
                                        currentReport={currentReport}
                                        resultData={resultData}
                                        yearsArr={yearsArr}
                                        setYearsArr={setYearsArr}
                                        isViewOnly={true}
                                        expenseData={pieExpenseData}
                                        projectData={projectData}
                                    />
                                </>
                            ) : null}
                            {currentReport && currentReport?.reportType === "Flip" && resultData && rehabOperatingCostsItemized && piePurchaseData && pieRehabData && pieHoldingData && pieSellingData ? (
                                <>
                                    <div className={classes.selectorCont} >
                                        <h3 className={classes.title} >Property Analysis</h3>
                                        <div></div>
                                    </div>
                                    <FlipReport
                                        currentReport={currentReport}
                                        resultData={resultData}
                                        isViewOnly={true}
                                        rehabOperatingCostsItemized={rehabOperatingCostsItemized}
                                        piePurchaseData={piePurchaseData}
                                        pieRehabData={pieRehabData}
                                        pieHoldingData={pieHoldingData}
                                        pieSellingData={pieSellingData}
                                        projectData={projectData}
                                    />
                                    <FlipProjection
                                        currentReport={currentReport}
                                        resultData={resultData}
                                        yearsArr={yearsArr}
                                        setYearsArr={setYearsArr}
                                        isViewOnly={true}
                                        projectData={projectData}
                                    />
                                </>
                            ) : null}
                            <div style={{ marginTop: "60px" }} ></div>
                            {projectData && projectData?.zpid && currentReport && currentReport?._id && currentReport?.teamId ? (
                                <SalesSuggestion
                                    projectData={projectData}
                                    zpid={projectData?.zpid}
                                    setCurrentReport={setCurrentReport}
                                    reportId={currentReport?._id}
                                    viewOnly={true}
                                    currentReport={currentReport}
                                    teamId={currentReport?.teamId}
                                    setSuggestionType={null}
                                    setProjectData={setProjectData}
                                />
                            ) : null}
                            <div style={{ marginTop: "60px" }} ></div>
                            {projectData ? (
                                <>
                                    {projectData?.homeStatus === "FOR_RENT" ? (
                                        <>
                                            {projectData && projectData?.zpid && currentReport && currentReport?._id && currentReport?.teamId ? (
                                                <RentSuggestion
                                                    projectData={projectData}
                                                    zpid={projectData?.zpid}
                                                    setCurrentReport={setCurrentReport}
                                                    currentReport={currentReport}
                                                    reportId={currentReport?._id}
                                                    teamId={currentReport?.teamId}
                                                    setSuggestionType={null}
                                                    setProjectData={setProjectData}
                                                />
                                            ) : null}
                                        </>
                                    ) : (
                                        <>
                                            {projectData && projectData?.zpid && currentReport && currentReport?._id && currentReport?.teamId ? (
                                                <RentEstimate
                                                    projectData={projectData}
                                                    zpid={projectData?.zpid}
                                                    setCurrentReport={setCurrentReport}
                                                    currentReport={currentReport}
                                                    reportId={currentReport?._id}
                                                    viewOnly={true}
                                                    teamId={currentReport?.teamId}
                                                    setSuggestionType={null}
                                                    setProjectData={setProjectData}
                                                />
                                            ) : null}
                                        </>
                                    )}
                                </>
                            ) : null}
                            {projectData?.description ? (
                                <>
                                    <div className={classes.selectorCont} >
                                        <h3 className={classes.title} >Property Short Description</h3>
                                        <div></div>
                                    </div>
                                    <div className={classes.descriptionCont} >
                                        {projectData?.description}
                                    </div>
                                </>
                            ) : null}
                            {imgsArr && imgsArr.length > 0 ? (
                                <>
                                    <div className={classes.selectorCont} >
                                        <h3 className={classes.title} >Property Photos</h3>
                                        <div></div>
                                    </div>
                                    <div className={classes.imgCont} >
                                        {imgsArr.map((img, i) => (
                                            <div
                                                className={classes.imgIconCont}
                                                onClick={() => {
                                                    setSelectedImg(i)
                                                    setOpenPhoto(true)
                                                }}
                                            >
                                                <img
                                                    className={classes.imgStyle}
                                                    src={img?.url}

                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Dialog
                                        open={openPhoto}
                                        onClose={handleClosePhoto}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle style={{ padding: "0px" }} >
                                            <div className={classes.titleStyle} >
                                                <p
                                                    style={{
                                                        color: "white",
                                                        fontSize: "17px"
                                                    }}
                                                >
                                                    Photos
                                                </p>
                                                <ClearIcon
                                                    style={{ color: "white", cursor: "pointer" }}
                                                    onClick={handleClosePhoto}
                                                />
                                            </div>
                                        </DialogTitle>
                                        <DialogContent dividers>
                                            {imgsObjArr.length > 0 ? (
                                                <ImageGallery
                                                    items={imgsObjArr}
                                                    startIndex={selectedImg}
                                                />
                                            ) : null}
                                        </DialogContent>
                                    </Dialog>
                                </>
                            ) : null}
                        </div>
                        <div className={classes.bottomBtnCont} >
                            <CustomBtn
                                style={{ marginRight: "10px" }}
                                text={"Share"}
                                startPart={<ScreenShareIcon />}
                                onClick={() => { setOpenShareDialog(true) }}
                            />

                            <CustomBtn
                                text={"Download PDF"}
                                startPart={<CloudDownloadIcon />}
                                onClick={() => { setOpenDialog(true); }}
                            />
                        </div>
                        <div className={classes.footerTop} >
                            <a href={`${config?.BASE_URL}investment/analysis/new`} target="_blank" >
                                Analyze any investment property with ContractFlo
                                <OpenInNewIcon style={{ display: 'inline', fontSize: "18px", marginBottom: "-4px" }} />
                            </a>
                        </div>
                        <Footer
                            position={"relative"}
                        />
                        <ReportShareDialog
                            report={currentReport}
                            projectData={projectData}
                            resultData={resultData}
                            pieExpenseData={pieExpenseData}
                            openShareDialog={openShareDialog}
                            setOpenShareDialog={setOpenShareDialog}
                            piePurchaseData={piePurchaseData}
                            pieRehabData={pieRehabData}
                            setProjectData={setProjectData}
                            pieIncomeData={pieIncomeData}
                            rehabOperatingCostsItemized={rehabOperatingCostsItemized}
                            pieHoldingData={pieHoldingData}
                            pieRefinanceData={pieRefinanceData}
                            pieSellingData={pieSellingData}
                            incomePieChart={incomePieChart}
                        />
                        <ReportPdf
                            openDialog={openDialog}
                            setOpenDialog={setOpenDialog}
                            currentReport={currentReport}
                            projectData={projectData}
                            resultData={resultData}
                            piePurchaseData={piePurchaseData}
                            pieRehabData={pieRehabData}
                            incomePieChart={incomePieChart}
                            pieExpenseData={pieExpenseData}
                            pieIncomeData={pieIncomeData}
                            rehabOperatingCostsItemized={rehabOperatingCostsItemized}
                            setProjectData={setProjectData}
                            pieHoldingData={pieHoldingData}
                            pieRefinanceData={pieRefinanceData}
                            pieSellingData={pieSellingData}
                        />
                    </>) : (
                        <div className={classes.progressCont} >
                            No Data Found !
                        </div>
                    )}
            </>)}
        </div>
    );
}
