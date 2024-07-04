import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { useMediaQuery } from '@material-ui/core';
import { useParams, useHistory } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import { createItem, updateAnalysisReportById, fetchItems, deleteItem, updateItem } from "./api.call";
import { Paper } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import configObject from "../../config/index"
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { updateAnalysisReport, getReport } from "./api.call";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CircularProgress from "@material-ui/core/CircularProgress";
import LessText from "../styled/CommonComponents/LessText";
import TextFieldNumberFormated from "../styled/CommonComponents/TextFieldNumberFormated";
import CustomBtn from "../styled/CommonComponents/CustomBtn";
import AnalysisHeader from "../styled/CommonComponents/AnalysisHead";


const useStyles = makeStyles((theme) => ({


  root: {
    width: "100%",
    height: "100%",
  },
  headerBar: {
    backgroundColor: "white",
    height: '60px',
    display: 'flex',
    padding: '0px 20px',
    paddingLeft: "5px",
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '0px',
      paddingLeft: "5px",
    },
    [theme.breakpoints.down('xs')]: {
      height: '50px',
    },
  },
  leftSideBar: {
    display: "flex",
    alignItems: "center",
  },
  rightSideBar: {
    display: "flex",
    alignItems: "center",
  },
  mainCont: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "white",
    padding: `0px ${theme.sideMargin.fullScreen}`,
    [theme.breakpoints.down('md')]: {
      padding: `0px ${theme.sideMargin.mdScreen}`,
    },
    [theme.breakpoints.down('sm')]: {
      padding: `0px ${theme.sideMargin.smScreen}`,
    },
    [theme.breakpoints.down('xs')]: {
      padding: "0px 5px",
      padding: `0px ${theme.sideMargin.sxScreen}`,
    },
  },

  field_container: {
    display: "flex",
    flexDirection: "column",
    padding: "4rem",
    margin: "2rem",
    marginTop: "3rem",
    [theme.breakpoints.down('xs')]: {
      padding: "0.5rem",
      margin: "0.5rem",
      marginTop: "40px"
    }
  },
  field_contents: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "0.3rem 0px",
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column",
      marginTop: "20px"
    }
  },

  field_contentsBorder: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "15px",
    padding: "0.3rem 0px",
    borderTop: `1px solid ${theme.palette.primary.main}`,
  },

  deleteBtn: {
    cursor: "pointer",
    color: "red",
  },
  namefield: {
    width: "42% !important",
    [theme.breakpoints.down('sm')]: {
      width: "100% !important",
    }
  },

  totalLabel: {
    width: "42%",
    padding: "0px 12px",
    fontSize: "18px",
    fontWeight: "520",
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      width: "60%",
    }
  },

  totalValue: {
    width: "48%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0px 12px",
    fontSize: "18px",
    fontWeight: "520",
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      width: "30%",
    }
  },


  progress: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: "31px",
    opacity: "0.8",
    cursor: "pointer",
  },
  propertyNamesty: {
    marginLeft: "10px",
    fontSize: "20px",
    fontWeight: "510",
    [theme.breakpoints.down('sm')]: {
      fontSize: "16px",
      marginLeft: "0px",
    }
  },
  inputAndBtn: {
    width: "48%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
    }
  },
  nameBtnCont: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemsCont: {
    padding: "30px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    marginTop: "20px",
    borderRadius: "15px",
    "& p": {
      fontSize: "18px",
      fontWeight: "500",
      marginBottom: "5px"
    }
  },
  input: {
    backgroundColor: "#FCFCFC",
  },
}));

export default function Item(props) {
  const {
    setView, ItemType, additionalItems, isAdditionalItems,
    currentReport, setCurrentReport, itemendAdorn, period,
    additionalItemsCostOR, projectData
  } = props

  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { teamId } = useParams();
  const history = useHistory();

  const [items, setItems] = useState([]);
  const [arrayType, setArrayType] = useState("");
  const [totalFieldKey, setTotalFieldKey] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [changeState, setChangeState] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalWithPeriod, setTotalWithPeriod] = useState(0);
  const [tLink, setTLink] = useState("")

  const isExSmall = useMediaQuery(theme.breakpoints.down("xs"));



  useEffect(() => {
    if (currentReport?.reportType === "Rental") {
      setTLink(configObject?.tutorialLinks?.rentalLink)
    } else if (currentReport?.reportType === "BRRRR") {
      setTLink(configObject?.tutorialLinks?.brrrrLink)
    } else if (currentReport?.reportType === "Flip") {
      setTLink(configObject?.tutorialLinks?.flipLink)
    }
  }, [currentReport])

  useEffect(() => {
    setIsLoading(true);
    if (ItemType === "Purchase Cost") {
      setArrayType("purchaseCostsItemized");
      setTotalFieldKey("purchaseTotal")
      setItems(currentReport?.purchaseCostsItemized);
    } else if (ItemType === "Rehab Cost") {
      setArrayType("rehabCostsItemized");
      setItems(currentReport?.rehabCostsItemized);
      setTotalFieldKey("rehabTotal")
    } else if (ItemType === "Other Income") {
      setArrayType("otherIncomeItemized");
      setItems(currentReport?.otherIncomeItemized);
      setTotalFieldKey("otherIncomeTotal")
    } else if (ItemType === "Operating Expense") {
      setArrayType("operatingExpenseItemized");
      setItems(currentReport?.operatingExpenseItemized);
      setTotalFieldKey("operatingExpenseTotal")
    } else if (ItemType === "Refinance Cost") {
      setArrayType("refinanceCostsItemized");
      setItems(currentReport?.refinanceCostsItemized);
      setTotalFieldKey("refinanceCostTotal")
    } else if (ItemType === "Recurring Rehab Cost") {
      setArrayType("holdingCostsItemized");
      setItems(currentReport?.holdingCostsItemized);
      setTotalFieldKey("holdingTotal")
    } else if (ItemType === "Selling Cost") {
      setArrayType("sellingCostsItemized");
      setItems(currentReport?.sellingCostsItemized);
      setTotalFieldKey("sellingCostTotal")
    }
    setIsLoading(false);
  }, []);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    let locTotal = 0;
    items.map((item) => {
      locTotal += Number(item?.Amount)
    })

    if (isAdditionalItems === "taxAndInsurance") {
      additionalItems.map((item) => {
        locTotal += Number(item?.value)
      })
    }

    if (isAdditionalItems === "costOverrun") {
      additionalItemsCostOR.map((item) => {
        locTotal += Number(item?.value)
      })
    }

    setTotal(locTotal)

    if (period) {
      setTotalWithPeriod(period * locTotal)
    }
  }, [items])




  console.log(items)

  const createNewItem = async () => {
    setChangeState(!changeState)

    const newItemObj = {
      Name: "",
      Amount: "",
      ItemType: ItemType,
    }

    let oldItems = items
    oldItems.push(newItemObj)
    setItems(oldItems)

    await createItem({
      itemData: newItemObj,
      itemType: arrayType,
      reportId: currentReport?._id,
    }).
      then((data) => {
        console.log(data)
        if (data) {
          setCurrentReport(data)
        }
      })
      .catch((err) => {
        console.log()
      })

    setChangeState(!changeState)
  }


  const onChangeItem = (value, idx, key) => {
    setChangeState(!changeState)
    let inputDataArr = items;
    let editObj = {
      ...items[idx],
      [key]: value,
    }
    inputDataArr[idx] = editObj;
    setItems(inputDataArr)
    setChangeState(!changeState)
  }


  const saveFullData = async () => {
    setIsLoading(true);
    let currentTotal = 0
    let filteredItems = [];
    items.map((item) => {
      if (item?.Name && item.Amount > 0) {
        currentTotal = currentTotal + parseInt(item?.Amount)
        filteredItems.push(item)
      }
    })

    await updateAnalysisReportById({
      reportData: {
        _id: currentReport?._id,
        [arrayType]: filteredItems,
        [totalFieldKey]: currentTotal
      }
    })
      .then((data) => {
        setCurrentReport(data)
        let newTotal = data?.[totalFieldKey]
        setTotal(newTotal)
      })
      .catch((err) => {
        console.log(err)
      })

    setView("analysisReport");
    setIsLoading(false);
  }

  const deleteItem = async (itemId) => {
    const filteredItems = items.filter(item => item?._id != itemId)
    setItems(filteredItems)
  }

  let pathArr = [{
    text: "Project",
    onClick: () => {
      history.push(`/projects/${teamId}`)
    }
  },
  {
    text: "Analysis",
    onClick: () => {
      setView("default");
    }
  },
  {
    text: "Worksheet",
    onClick: () => {
      setView("worksheet");
    }
  },
  {
    text: isExSmall ? "Report" : "Report Analysis",
    onClick: () => {
      setView("analysisReport");
    }
  },
  {
    text: ItemType
  }]




  return (
    <>
      {loading ? (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className={classes.mainCont} >
            <AnalysisHeader
              pageTitle={`Add ${ItemType || "Item(s)"}`}
              pathArr={pathArr}
              imgSrc={projectData?.displayPicture?.url}
              propName={projectData?.displayName}
              isImgProps={true}
              propDetails={<>{projectData?.subCategory || "Nan"} \ {projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} BA \ {projectData?.roomNumbers || "Nan"} BR \ {`${projectData?.area || "Nan"} sqft`}</>}
              pageDesc={<>Use this page to edit the itemized costs, expenses or income. <a style={{ textDecoration: 'none' }} href={tLink} target="_blank" >View tutorial</a></>}
              rightBtns={<>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  onClick={() => { saveFullData() }}
                >
                  Save & Exit
                </Button>
              </>}
            />
            <div className={classes.nameBtnCont} >
              <div>
              </div>
              <CustomBtn
                text={"Add New"}
                onClick={() => { createNewItem() }}
                startPart={<AddIcon />}
              />
            </div>
            <div className={classes.itemsCont} >
              {isAdditionalItems === "taxAndInsurance" && additionalItems && additionalItems.length > 0 && additionalItems.map((item, idx) => (
                <div key={idx} className={classes.field_contents}>
                  <div className={classes.namefield} >
                    <p>Item</p>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      InputProps={{
                        className: classes.input
                      }}
                      placeholder={"Enter Item Name"}
                      variant="outlined"
                      size="small"
                      style={{ width: "100%" }}
                      value={item?.name}
                      disabled={true}
                    />
                  </div>
                  <div className={classes.inputAndBtn} >
                    <div style={{ width: "80%" }} >
                      <p>Amount</p>
                      <TextFieldNumberFormated
                        value={item?.value}
                        variant={"outlined"}
                        placeholder={"Enter Amount"}
                        size={"small"}
                        endAdorn={itemendAdorn}
                        onChange={(e) => { }}
                        style={{ width: "100%" }}
                        disabled={true}
                      />
                    </div>
                    <CustomBtn
                      text={"Delete"}
                      style={{ marginTop: "20px" }}
                      disabled={true}
                    />
                  </div>
                </div>
              ))}
              {items && items.length > 0 && items.map((item, idx) => (
                <div key={idx} className={classes.field_contents}>
                  <div className={classes.namefield} >
                    <p>Item</p>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      placeholder="Enter Item Name"
                      InputProps={{
                        className: classes.input
                      }}
                      value={item?.Name}
                      style={{ width: '100%' }}
                      onChange={(e) => { onChangeItem(e.target.value, idx, "Name") }}
                      disabled={false}
                    />
                  </div>
                  <div className={classes.inputAndBtn} >
                    <div style={{ width: "80%" }} >
                      <p>Amount</p>
                      <TextFieldNumberFormated
                        value={item?.Amount}
                        variant={"outlined"}
                        placeholder="Enter Amount"
                        size={"small"}
                        endAdorn={itemendAdorn}
                        onChange={(e) => { onChangeItem(e.target.value, idx, "Amount") }}
                        style={{ width: "100%" }}
                        disabled={false}
                      />
                    </div>
                    <CustomBtn
                      text={"Delete"}
                      style={{ marginTop: "20px" }}
                      onClick={() => { deleteItem(item?._id) }}
                    />
                  </div>
                </div>
              ))}
              {isAdditionalItems === "costOverrun" && additionalItemsCostOR && additionalItemsCostOR.length > 0 && additionalItemsCostOR.map((item, idx) => (
                <div key={idx} className={classes.field_contents}>
                  <div className={classes.namefield} >
                    <p>Item</p>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      placeholder="Enter Item Name"
                      InputProps={{
                        className: classes.input
                      }}
                      style={{ width: "100%" }}
                      value={item?.name}
                      disabled={true}
                    />
                  </div>
                  <div className={classes.inputAndBtn} >
                    <div style={{ width: "80%" }} >
                      <p>Amount</p>
                      <TextFieldNumberFormated
                        value={item?.value}
                        variant={"outlined"}
                        placeholder="Enter Amount"
                        size={"small"}
                        endAdorn={itemendAdorn}
                        onChange={(e) => { }}
                        style={{ width: "100%" }}
                        disabled={true}
                      />
                    </div>
                    <CustomBtn
                      text={"Delete"}
                      disabled={true}
                      style={{ marginTop: "20px" }}
                      onClick={() => { deleteItem(item?._id) }}
                    />
                  </div>
                </div>
              ))}
              {period ? (<>
                <div className={classes.field_contentsBorder}>
                  <div className={classes.totalLabel} >
                    Monthly Total
                  </div>
                  <div className={classes.totalValue} >
                    $ {numberWithCommas(total)}
                  </div>
                </div>
                <div className={classes.field_contentsBorder} style={{ border: "none" }} >
                  <div className={classes.totalLabel} >
                    Total Of {period} Months
                  </div>
                  <div className={classes.totalValue} >
                    $ {numberWithCommas(totalWithPeriod)}
                  </div>
                </div>
              </>) : (<>
                <div className={classes.field_contentsBorder}>
                  <div className={classes.totalLabel} >
                    Total
                  </div>
                  <div className={classes.totalValue} >
                    $ {numberWithCommas(total)}
                  </div>
                </div>
              </>)}
            </div>
          </div>
        </>
      )}
    </>
  );
}