import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import { updateAnalysisReport } from "../api.call";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FormTextField from "../FormTextField";
import OutlinedButton from "../OutlinedButton";
import InfoLabel from "./InfoLabel";
import { useDebounce } from "react-use";
import DynamicMultiInput from "./DynamicMultiInput";
import InputAdornment from '@material-ui/core/InputAdornment';
import { TextField } from "@material-ui/core";
import TextFieldNumberFormated from "../../styled/CommonComponents/TextFieldNumberFormated";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
  itemized: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subheading: {
    color: "#1684ea",
    fontSize: "18px",
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
  showDisplayFlex: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: "flex-start",
      marginBottom: "40px"
    }
  },
  showDisplayFlex30: {
    width: "calc(100% - 30px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "30px",
    [theme.breakpoints.down('sm')]: {
      width: "calc(100% - 15px)",
      flexDirection: 'column',
      alignItems: "flex-start",
      marginBottom: "40px",
      marginLeft: "15px",
    }
  },
  subLabel: {
    fontSize: "15px",
    fontWeight: "510",
    opacity: "1",
    color: "black",
  },
  subSubLabel: {
    fontSize: "15px",
    fontWeight: "500",
    opacity: "0.8"
  },
  suggestionText: {
    width: "55%",
    fontSize: "15px",
    fontWeight: "500",
    opacity: "0.9",
    [theme.breakpoints.down('sm')]: {
      fontSize: "14px",
      paddingLeft: "10px",
      width: "100%",
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

export default function FlipRental({
  reportId,
  teamId,
  currentReport,
  setCurrentReport,
  setView,
  setItemType,
  taxpm,
  insurancepm,
  setSuggestionType,
  suggestionType
}) {
  const theme = useTheme();
  const classes = useStyles();

  const [rentalPeriod, setRentalPeriod] = useState(currentReport?.rentalPeriod || "");
  const [GrossRent, setGrossRent] = useState(currentReport?.GrossRent || "");
  const [Vacancy, setVacancy] = useState(currentReport?.Vacancy || "");
  const [sellingPrice, setSellingPrice] = useState(currentReport?.sellingPrice || "");
  const [otherIncomeTotal, setOtherTotal] = useState(currentReport?.otherIncomeTotal || "");
  const [operatingExpenseTotal, setOperatingExpenseTotal] = useState(currentReport?.operatingExpenseTotal || "");
  const [operatingTotal, setOperatingTotal] = useState("");
  const [additionalOperatingItemizeds, setAdditionalOperatingItemizeds] = useState([]);


  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));


  const updateReportWithDebounce = async (data) => {
    await updateAnalysisReport({
      reportData: {
        rentalPeriod: rentalPeriod,
        GrossRent: GrossRent,
        Vacancy: Vacancy,
        sellingPrice: sellingPrice
      },
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


  useDebounce(
    () => {
      updateReportWithDebounce();
    },
    1000,
    [rentalPeriod, GrossRent, Vacancy, sellingPrice]
  )

  useEffect(() => {
    let allItemizeds = []
    if (Number(taxpm)) {
      const taxObj = {
        Name: "Property Tax",
        Amount: taxpm,
        ItemType: "operatingExpenseItemized",
      }
      allItemizeds.push(taxObj)
    }
    if (Number(insurancepm)) {
      const insuranObj = {
        Name: "Property Insurance",
        Amount: insurancepm,
        ItemType: "operatingExpenseItemized",
      }
      allItemizeds.push(insuranObj)
    }
    setAdditionalOperatingItemizeds(allItemizeds)
  }, [insurancepm, taxpm])


  useEffect(() => {
    let opTot = 0;
    if (Number(taxpm)) opTot += Number(taxpm);
    if (Number(insurancepm)) opTot += Number(insurancepm);
    if (Number(operatingExpenseTotal)) {
      opTot += Number(operatingExpenseTotal);
    }
    setOperatingTotal(String(opTot));
  }, [taxpm, insurancepm, operatingExpenseTotal]);



  return (
    <form className={classes.root} noValidate autoComplete="off">
      <InputLabel className={classes.subLabel} >Rent</InputLabel>

      <p className={classes.subSubLabel} >Rental Period (months)</p>
      <TextField
        id="outlined-start-adornment"
        type="number"
        value={rentalPeriod}
        onChange={(e) => {
          setRentalPeriod(e.target.value);
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">Month(s)</InputAdornment>,
          className: classes.input
        }}
        variant="outlined"
        style={{ width: "100%", margin: "10px 0px 25px 0px" }}
        size="small"
      />

      <InfoLabel
        nameClass={classes.subSubLabel}
        name={"Gross Rent ($)"}
        text={"The total rent collected from tenants"}
      />
      <TextFieldNumberFormated
        value={GrossRent}
        onChange={(e) => {
          setGrossRent(e.target.value);
        }}
        variant={"outlined"}
        style={{ width: "100%", margin: "10px 0px 0px 0px" }}
        size={"small"}
        disabled={false}
      />
      <div className={classes.suggestionText} style={{ marginBottom: "25px" }} >
        <a
          className={classes.linkText}
          onClick={() => { setSuggestionType("rentSuggestion") }}
        >View recent rental comps</a> to help you determine the potential rent of this property.
      </div>
      <InfoLabel
        nameClass={classes.subSubLabel}
        name={"Vacancy (%)"}
        text={
          "The percentage of time you expect a property to remain vacant in a given period of time, excluding the rehab period, if any"
        }
      />
      <TextField
        id="outlined-start-adornment"
        type="number"
        value={Vacancy}
        onChange={(e) => {
          setVacancy(e.target.value);
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
          className: classes.input
        }}
        variant="outlined"
        style={{ width: "100%", margin: "10px 0px 25px 0px" }}
        size="small"
      />
      <InfoLabel
        nameClass={classes.subSubLabel}
        name={"Other Income ($)"}
        text={"Income from the property other than rent"}
      />
      <div style={{ width: "100%", margin: "10px 0px 25px 0px" }} >
        <DynamicMultiInput
          items={currentReport?.otherIncomeItemized}
          itemKeyType={"otherIncomeItemized"}
          ItemType={"Other Income"}
          currentReport={currentReport}
          setCurrentReport={setCurrentReport}
          total={otherIncomeTotal}
          setTotal={setOtherTotal}
          totalFieldKey={"otherIncomeTotal"}
          inputAdornment={"$"}
        />
      </div>

      <InfoLabel
        nameClass={classes.subLabel}
        name={"Operating Expenses ($)"}
        text={
          "All the expenses incurred while renting a property, excluding the loan payments"
        }
      />
      <div style={{ width: "100%", margin: "10px 0px 25px 0px" }} >
        <DynamicMultiInput
          items={currentReport?.operatingExpenseItemized}
          additionalItems={additionalOperatingItemizeds}
          otherTotal={operatingTotal}
          itemKeyType={"operatingExpenseItemized"}
          ItemType={"Operating Expense"}
          currentReport={currentReport}
          setCurrentReport={setCurrentReport}
          total={operatingExpenseTotal}
          setTotal={setOperatingExpenseTotal}
          totalFieldKey={"operatingExpenseTotal"}
          inputAdornment={"$/Month"}
        />
      </div>
      <p className={classes.subLabel} >Selling Price ($)</p>
      <TextFieldNumberFormated
        value={sellingPrice}
        onChange={(e) => {
          setSellingPrice(e.target.value);
        }}
        variant={"outlined"}
        style={{ width: "100%", margin: "10px 0px 25px 0px" }}
        size={"small"}
        disabled={false}
      />
    </form>
  );
}
