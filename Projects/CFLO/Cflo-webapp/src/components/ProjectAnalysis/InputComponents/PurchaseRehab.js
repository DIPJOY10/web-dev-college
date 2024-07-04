import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { InputLabel, Typography } from "@material-ui/core";
import { updateAnalysisReport } from "../api.call";
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FormTextField from "../FormTextField";
import OutlinedButton from "../OutlinedButton";
import Tooltip from "@material-ui/core/Tooltip";
import { Fade } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import InfoLabel from "./InfoLabel";
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { createItem, fetchItems, deleteItem, updateItem } from "../api.call";
import DynamicMultiInput from "./DynamicMultiInput";
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextFieldNumberFormated from "../../styled/CommonComponents/TextFieldNumberFormated";
import { useDebounce } from "react-use";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  control_switch: {
    marginLeft: "auto",
  },
  checked_component: {
    "& .MuiInputLabel-root": {
      display: "inline",
    },
    marginTop: "1rem",
    alignContent: "right",
    "& Button": {
      margin: "0.5rem",
    },
  },
  checked_controls: {
    marginLeft: "0.5rem",
  },
  onButton: {
    margin: "0.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rehabOn: {
    marginRight: "2.5rem",
    marginLeft: "0.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mortgageOn: {
    marginRight: "2.5rem",
    marginLeft: "0.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  purchase_container: {
    marginTop: "1.5rem",
  },
  purchase_contents: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rehab_container: {
    // marginTop: "0.5rem",
    // marginTop: "1rem",
  },
  rehab_contents: {
    display: "flex",
    flexDirection: "column",
  },
  rehab_itemized: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  holding_container: {
    margin: "0.5rem",
    marginTop: "1rem",
  },
  holding_contents: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    marginTop: "1rem",
  },
  subheading: {
    color: "#1684ea",
    fontSize: "20px",
    fontWeight: "520",
    margin: "30px 0px 15px",
    [theme.breakpoints.down('sm')]: {
      margin: "20px 0px 10px",
    }
  },
  totalLabel: {
    fontSize: "0.8rem",
    color: "#fafafa",
    marginLeft: "0.5rem",
  },
  shifted_label: {
    marginLeft: "1rem",
    fontSize: "0.8rem",
  },
  displayFlexCont: {
    width: "100%",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
      marginBottom: "40px"
    }
  },

  multiInputCont: {
    width: "calc(100% - 10px)"
  },
  mainLable: {

  },
  subLabel: {
    fontSize: "14px",
    fontWeight: "510",
    opacity: "1",
    color: "black",
    [theme.breakpoints.down('sm')]: {
      fontSize: "13px",
    }
  },
  subSubLabel: {
    fontSize: "15px",
    fontWeight: "500",
    opacity: "0.8",
    [theme.breakpoints.down('sm')]: {
      fontSize: "14px",
    }
  },
  report_child: {
    "& h2": {
      color: "#1684ea",
      fontWeight: "normal",
      margin: "1rem 0 1rem 0",
    },
    margin: "0.5rem 2rem",
    padding: "0.5rem",
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
      margin: "1rem 10px",
      padding: "30px 10px",
      paddingRight: "20px"
    },
    [theme.breakpoints.down('xs')]: {
      margin: "1rem 5px",
      padding: "20px 0px",
      paddingRight: "20px"
    }
  },
  suggestionText: {
    fontSize: "15px",
    fontWeight: "500",
    opacity: "0.9",
    [theme.breakpoints.down('sm')]: {
      fontSize: "14px",
      marginLeft: "10px",
    }
  },
  linkText: {
    textDecoration: "none",
    color: "blue",
    cursor: "pointer",
  },
  input: {
    backgroundColor: "#FCFCFC",
  },
}));

export default function RentalFinance({
  reportId,
  teamId,
  currentReport,
  setCurrentReport,
  setpurchaseDisable,
  taxpm,
  setTaxpm,
  insurancepm,
  setInsurancepm,
  setSuggestionType,
  suggestionType
}) {
  const theme = useTheme();
  const classes = useStyles();
  const {
    root,
    rehab_container,
    label,
    subheading,
  } = classes;
  const [state, setState] = useState({
    checkedA: false,
    checkedB: true,
  });
  const [rehabState, setRehabState] = useState({
    checkedOn: false,
    checkedOff: true,
  });
  const [mortgageState, setMortgageState] = useState({
    mOn: false,
    mOff: true,
  });
  const [b1, setb1] = useState(true);
  const [b2, setb2] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState(
    currentReport?.purchasePrice || ""
  );
  const [ARV, setARV] = useState(currentReport?.ARV || "");
  const [propertyTax, setPropertyTax] = useState(
    currentReport?.propertyTax || ""
  );
  const [propertyInsurance, setPropertyInsurance] = useState(
    currentReport?.propertyInsurance || ""
  );
  const [costOverrun, setCostOverrun] = useState(
    currentReport?.costOverrun || ""
  );
  const [rehabPeriod, setRehabPeriod] = useState(
    currentReport?.rehabPeriod || ""
  );
  const [purchaseTotal, setPurchaseTotal] = useState(
    currentReport?.purchaseTotal || ""
  );
  const [rehabTotal, setRehabTotal] = useState(currentReport?.rehabTotal || "");
  const [holdingTotal, setHoldingTotal] = useState(
    currentReport?.holdingTotal || ""
  );
  const [recurringTotal, setRecurringTotal] = useState("");
  const [additionalHoldingItemizeds, setAdditionalHoldingItemizeds] = useState([]);

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));


  useEffect(() => {
    let allItemizeds = []

    if (taxpm) {
      const taxObj = {
        Name: "Property Tax",
        Amount: taxpm,
        ItemType: "holdingCostsItemized",
      }

      allItemizeds.push(taxObj)
    }

    if (insurancepm) {
      const insuranObj = {
        Name: "Property Insurance",
        Amount: insurancepm,
        ItemType: "holdingCostsItemized",
      }
      allItemizeds.push(insuranObj)
    }

    setAdditionalHoldingItemizeds(allItemizeds)

  }, [insurancepm, taxpm])



  const updateReport = async (data) => {
    const res = await updateAnalysisReport({
      reportData: data,
      reportId,
      teamId,
    })
      .then((data) => {
        setCurrentReport(data)
      })
      .catch((err) => {
        console.log(err)
      })
  };

  const updateReportWithDebounce = async () => {
    const res = await updateAnalysisReport({
      reportData: {
        purchasePrice: purchasePrice,
        ARV: ARV,
        propertyTax: propertyTax,
        propertyInsurance: propertyInsurance,
        costOverrun: costOverrun,
        rehabPeriod: rehabPeriod
      },
      reportId,
      teamId,
    })
      .then((data) => {
        console.log("get call")
        setCurrentReport(data)
      })
      .catch((err) => {
        console.log(err)
      })
  };


  useDebounce(
    () => {
      updateReportWithDebounce();
    },
    1000,
    [purchasePrice,
      ARV,
      propertyTax,
      propertyInsurance,
      costOverrun,
      rehabPeriod]
  )

  const [disabler, setDisabler] = useState(true);
  useEffect(() => {
    if (Number(purchasePrice) && Number(ARV) && Number(propertyInsurance) && Number(propertyTax)) {
      setpurchaseDisable(true);
      console.log("purchasedisable is true now");
    } else {
      setpurchaseDisable(false);
      console.log("purchasedisable is false now");
    }
  }, [disabler]);

  useEffect(() => {
    if (Number(currentReport?.LoanTerm)) {
      setb1(true);
      setb2(false);
      updateReport({ LoanType: "Amortizing" });
    } else {
      setb2(true);
      setb1(false);
      updateReport({ LoanType: "Interest Only" });
    }

    if (Number(currentReport?.DownPayment)) {
      setState({ ...state, checkedA: true });
    } else {
      updateReport({ LoanType: "" });
    }

    if (Number(currentReport?.RehabCostPercent)) {
      setRehabState({ ...rehabState, checkedOn: true });
    }

    if (Number(currentReport?.Upfront)) {
      setMortgageState({ ...mortgageState, mOn: true });
    }

    if (Number(currentReport?.ARV) && Number(currentReport?.propertyTax)) {
      setTaxpm(
        Math.round((Number(currentReport.propertyTax) * Number(ARV)) / 1200)
      );
    }

    if (Number(currentReport?.propertyInsurance)) {
      setInsurancepm(Math.round(Number(currentReport?.propertyInsurance) / 12));
    }
  }, []);

  useEffect(() => {
    let recTot = 0;
    if (Number(ARV) && Number(propertyTax)) {
      let tax = Math.round((Number(propertyTax) * Number(ARV)) / 1200);
      setTaxpm(tax);
      recTot += tax;
    } else {
      setTaxpm("");
    }
    if (Number(propertyInsurance)) {
      let insurance = Math.round(Number(propertyInsurance) / 12);
      setInsurancepm(insurance);
      recTot += insurance;
    } else {
      setInsurancepm("");
    }
    if (Number(holdingTotal)) {
      recTot += Number(holdingTotal);
    }
    setRecurringTotal(String(recTot));
  }, [ARV, propertyTax, propertyInsurance, holdingTotal]);


  return (
    <form className={root} noValidate autoComplete="off">
      <InputLabel className={subheading}>Purchase costs</InputLabel>
      <InfoLabel
        name={"Purchase(Offer) Price($)"}
        text={"The amount that you are paying to buy a property"}
        nameClass={classes.subLabel}
        idRequired={true}
      />
      <TextFieldNumberFormated
        value={purchasePrice}
        onChange={(e) => {
          setPurchasePrice(e.target.value);
          setDisabler(!disabler);
        }}
        variant={"outlined"}
        style={{ width: "100%", margin: "10px 0px 25px 0px" }}
        size={"small"}
        disabled={false}
      />
      <InfoLabel
        name={"After Repair Value ($)"}
        text={
          "The (estimated) market value of the property after rehab is done"
        }
        nameClass={classes.subLabel}
        idRequired={true}
      />
      <TextFieldNumberFormated
        value={ARV}
        onChange={(e) => {
          setARV(e.target.value);
          setDisabler(!disabler);
        }}
        variant={"outlined"}
        style={{ width: "100%", margin: "10px 0px 0px 0px", backgroundColor: "#FCFCFC" }}
        size={"small"}
        disabled={false}
      />
      <p className={classes.suggestionText} style={{ marginBottom: "25px" }} >
        <a
          className={classes.linkText}
          onClick={() => { setSuggestionType("saleSuggestion") }}
        >View recent sales comps</a> to help you determine the after repair value of this property.
        If no repairs are necessary, the after repair value is the same as the current market value.
      </p>
      <InfoLabel
        name={"Purchase Costs"}
        text={
          "Purchase cost (aka closing costs) are expenses and fees due at the closing of a real estate transaction while buying a property, in addition to the property's purchase price"
        }
        nameClass={classes.subLabel}
      />
      <div style={{ width: "100%", margin: "10px 0px 50px 0px" }} >
        <DynamicMultiInput
          items={currentReport?.purchaseCostsItemized}
          itemKeyType={"purchaseCostsItemized"}
          ItemType={"Purchase Cost"}
          currentReport={currentReport}
          setCurrentReport={setCurrentReport}
          total={purchaseTotal}
          setTotal={setPurchaseTotal}
          totalFieldKey={"purchaseTotal"}
          inputAdornment={"$"}
        />
      </div>
      <InputLabel className={subheading}>Tax & Insurance</InputLabel>
      <InfoLabel
        name={"Property Tax (% of ARV annually)"}
        text={"Property Tax (a percentage of ARV) to be paid annually"}
        nameClass={classes.subLabel}
      />
      <TextField
        id="outlined-start-adornment"
        type="number"
        value={propertyTax}
        onChange={(e) => {
          setPropertyTax(e.target.value);
          setDisabler(!disabler);
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
          className: classes.input
        }}
        variant="outlined"
        style={{ width: "100%", margin: "10px 0px 25px 0px", backgroundColor: "#FCFCFC" }}
        size="small"
      />
      <InfoLabel
        name={"Property Insurance ($ annually)"}
        text={
          "A fixed amount to be paid annually as insurance of the property"
        }
        nameClass={classes.subLabel}
      />
      <TextFieldNumberFormated
        value={propertyInsurance}
        onChange={(e) => {
          const val = e.target.value;
          setPropertyInsurance(e.target.value);
          setDisabler(!disabler);
        }}
        variant={"outlined"}
        style={{ width: "100%", margin: "10px 0px 25px 0px", backgroundColor: "#FCFCFC" }}
        size={"small"}
        disabled={false}
      />
      <InputLabel className={subheading}>Rehab Costs</InputLabel>
      <InfoLabel
        name={"Rehab Capital Costs"}
        text={
          "Costs and expenses (one time) associated with repairs and rehab of a property"
        }
        nameClass={classes.subLabel}
      />
      <div
        style={{ width: "100%", margin: "10px 0px 20px 0px" }}
      >
        <DynamicMultiInput
          items={currentReport?.rehabCostsItemized}
          itemKeyType={"rehabCostsItemized"}
          ItemType={"Rehab Cost"}
          currentReport={currentReport}
          setCurrentReport={setCurrentReport}
          total={rehabTotal}
          setTotal={setRehabTotal}
          totalFieldKey={"rehabTotal"}
          inputAdornment={"$"}
        />
      </div>
      <InfoLabel
        name={"Cost Overrun (%)"}
        text={
          "Cost overrun involves unexpected costs incurred during rehab of the property"
        }
        nameClass={classes.subLabel}
      />
      <TextField
        id="outlined-start-adornment"
        type="number"
        value={costOverrun}
        onChange={(e) => {
          setCostOverrun(e.target.value);
          setDisabler(!disabler);
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
          className: classes.input
        }}
        variant="outlined"
        style={{ width: "100%", margin: "10px 0px 25px 0px", backgroundColor: "#FCFCFC" }}
        size="small"
      />
      <InfoLabel
        name={"Rehab Period (months)"}
        text={
          "Rehab period is the expected period during which rehab/repair works of the property will be completed"
        }
        nameClass={classes.subLabel}
        idRequired={currentReport?.reportType != "Rental" ? true : false}
      />
      <TextField
        id="outlined-start-adornment"
        value={rehabPeriod}
        type="number"
        onChange={(e) => {
          setRehabPeriod(e.target.value);
          setDisabler(!disabler);
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">Month(s)</InputAdornment>,
          className: classes.input
        }}
        variant="outlined"
        style={{ width: "100%", margin: "10px 0px 25px 0px", backgroundColor: "#FCFCFC" }}
        size="small"
      />
      <InfoLabel
        name={"Rehab Operating Costs"}
        text={
          "Monthly operating costs during rehab (like property tax, insurance, electricity, water supply costs, etc), excluding loan payments"
        }
        nameClass={classes.subLabel}
      />
      <div
        style={{ width: "100%", margin: "10px 0px 25px 0px" }}
      >
        <DynamicMultiInput
          items={currentReport?.holdingCostsItemized}
          additionalItems={additionalHoldingItemizeds}
          otherTotal={recurringTotal}
          itemKeyType={"holdingCostsItemized"}
          ItemType={"Rehab Operating Cost"}
          currentReport={currentReport}
          setCurrentReport={setCurrentReport}
          total={holdingTotal}
          setTotal={setHoldingTotal}
          totalFieldKey={"holdingTotal"}
          inputAdornment={"$/Month"}
        />
      </div>
    </form>
  );
}
