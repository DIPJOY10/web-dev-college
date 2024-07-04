import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Paper, useMediaQuery } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import { updateAnalysisReport } from "../api.call";
import { Typography } from "@material-ui/core";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FormTextField from "../FormTextField";
import OutlinedButton from "../OutlinedButton";
import DynamicMultiInput from "./DynamicMultiInput";
import InfoLabel from "./InfoLabel";
import TextField from '@material-ui/core/TextField';
import { useDebounce } from "react-use";
import InputAdornment from '@material-ui/core/InputAdornment';
import TextFieldNumberFormated from "../../styled/CommonComponents/TextFieldNumberFormated";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  itemized: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    marginTop: "1rem",
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
    [theme.breakpoints.down('sm')]: {
      marginBottom: "40px"
    }
  },
  subLabel: {
    fontSize: "15px",
    fontWeight: "510",
    opacity: "1",
    color: "black",
    [theme.breakpoints.down('sm')]: {
      fontSize: "15px",
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
  report_child: {
    "& h2": {
      color: "#1684ea",
      fontWeight: "normal",
      margin: "1rem 0 1rem 0",
    },
    margin: "0rem 2rem",
    padding: "0rem 1.5rem",
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
      margin: "0rem 10px",
      padding: "0px 10px",
      paddingRight: "20px"
    },
    [theme.breakpoints.down('sm')]: {
      margin: "1rem 5px",
      padding: "20px 5px",
      paddingRight: "20px"
    }
  },
  input: {
    backgroundColor: "#FCFCFC"
  },
}));

export default function RentalExpense({
  reportId,
  teamId,
  currentReport,
  setCurrentReport,
  setView,
  setItemType,
  rentalDisable,
  setrentalDisable,
  taxpm,
  insurancepm,
  setSuggestionType,
  suggestionType
}) {
  const theme = useTheme();
  const classes = useStyles();

  const [GrossRent, setGrossRent] = useState(currentReport?.GrossRent || "");
  const [Period, setPeriod] = useState(currentReport?.Period || "Per Month");
  const [Vacancy, setVacancy] = useState(currentReport?.Vacancy || "");
  const [otherIncomeTotal, setOtherTotal] = useState(currentReport?.otherIncomeTotal || "");
  const [operatingExpenseTotal, setOperatingExpenseTotal] = useState(currentReport?.operatingExpenseTotal || "");
  const [additionalHoldingItemizeds, setAdditionalHoldingItemizeds] = useState([]);
  const [operatingTotal, setOperatingTotal] = useState("");

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));


  const updateReportWithDebounce = async () => {
    await updateAnalysisReport({
      reportData: {
        Period: Period,
        GrossRent: GrossRent,
        Vacancy: Vacancy
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
    [GrossRent, Period, Vacancy]
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
    setAdditionalHoldingItemizeds(allItemizeds)
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

  useEffect(() => {
    if (Number(GrossRent)) {
      setrentalDisable(true);
    } else {
      setrentalDisable(false);
    }
  }, [GrossRent]);

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <p className={classes.subLabel} >Period</p>
      <FormControl variant="outlined" style={{ width: "100%", margin: "10px 0px 25px 0px" }} size="small" >
        <Select
          labelId="demo-simple-select-outlined-label"
          style={{ width: "100%", backgroundColor: "#FCFCFC" }}
          id="demo-simple-select-outlined"
          value={Period}
          onChange={async (e) => {
            setPeriod(e.target.value);
          }}
        >
          <MenuItem value={"Per Day"}>Per Day</MenuItem>
          <MenuItem value={"Per Week"}>Per Week</MenuItem>
          <MenuItem value={"Per Month"}>Per Month</MenuItem>
          <MenuItem value={"Per Quarter"}>Per Quarter</MenuItem>
          <MenuItem value={"Per Year"}>Per Year</MenuItem>
        </Select>
      </FormControl>
      <InfoLabel
        nameClass={classes.subLabel}
        name={"Gross Rent ($)"}
        text={"The total rent collected from tenants"}
        idRequired={true}
      />
      <TextFieldNumberFormated
        value={GrossRent}
        onChange={(e) => {
          setGrossRent(e.target.value);
          if (GrossRent) {
            setrentalDisable(true);
          } else {
            setrentalDisable(false);
          }
        }}
        variant={"outlined"}
        style={{ width: "100%", margin: "10px 0px 0px 0px" }}
        size={"small"}
        disabled={false}
      />
      <p className={classes.suggestionText} style={{ marginBottom: "25px" }} >
        <a
          className={classes.linkText}
          onClick={() => { setSuggestionType("rentSuggestion") }}
        >View recent rental comps</a> to help you determine the potential rent of this property.
      </p>
      <InfoLabel
        nameClass={classes.subLabel}
        name={"Vacancy (%)"}
        text={
          "The percentage of time you expect a property to remain vacant in a given period of time, excluding the rehab period, if any"
        }
      />
      <TextField
        type="number"
        id="outlined-start-adornment"
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
        nameClass={classes.subLabel}
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
          additionalItems={additionalHoldingItemizeds}
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
    </form>
  );
}
