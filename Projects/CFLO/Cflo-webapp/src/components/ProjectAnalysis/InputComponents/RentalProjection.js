import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { InputLabel } from "@material-ui/core";
import { Paper, useMediaQuery } from '@material-ui/core';
import { updateAnalysisReport } from "../api.call";
import { useTheme } from "@material-ui/core/styles";
import FormTextField from "../FormTextField";
import InfoLabel from "./InfoLabel";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useDebounce } from "react-use";
import TextFieldNumberFormated from "../../styled/CommonComponents/TextFieldNumberFormated";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  onButton: {
    display: "flex",
    margin: "0.5rem",
    justifyContent: "space-between",
    alignItems: "center",
  },
  showDisplayFlex: {
    width: "100%",
    [theme.breakpoints.down('sm')]: {
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
      marginLeft: "15px",
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
  report_child: {
    "& h2": {
      color: "#1684ea",
      fontWeight: "normal",
      margin: "1rem 0 1rem 0",
    },
    margin: "0.5rem 2rem",
    padding: "1rem 1.5rem",
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
      padding: "20px 5px",
      paddingRight: "20px"
    }
  },
  input: {
    backgroundColor: "#FCFCFC"
  },
}));

export default function RentalProjection({
  reportId,
  teamId,
  currentReport,
  setCurrentReport,
  projectionDisable,
  setprojectionDisable,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const { root, onButton } = classes;

  const [state, setState] = useState({
    checkedA: true,
    checkedB: false,
  });

  const [disabler, setDisabler] = useState(true);
  const [Appreciation, setAppreciation] = useState(currentReport?.Appreciation || "");
  const [IncomeIncrease, setIncomeIncrease] = useState(currentReport?.IncomeIncrease || "");
  const [ExpenseIncrease, setExpenseIncrease] = useState(currentReport?.ExpenseIncrease || "");
  const [SellingCosts, setSellingCosts] = useState(currentReport?.SellingCosts || "");
  const [DepreciationPeriod, setDepreciationPeriod] = useState(currentReport?.DepreciationPeriod || "");
  const [LandValue, setLandValue] = useState(currentReport?.LandValue || "");

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const updateReportWithDebounce = async () => {
    await updateAnalysisReport({
      reportData: {
        Appreciation: Appreciation,
        IncomeIncrease: IncomeIncrease,
        ExpenseIncrease: ExpenseIncrease,
        SellingCosts: SellingCosts,
        DepreciationPeriod: DepreciationPeriod,
        LandValue: LandValue
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
    [Appreciation, IncomeIncrease, ExpenseIncrease,
      SellingCosts, DepreciationPeriod, LandValue]
  )

  useEffect(() => {
    if (Number(currentReport.DepreciationPeriod)) {
      setState({
        ...state,
        checkedB: true,
      });
    }
  }, []);

  useEffect(() => {
    if (Number(Appreciation) && Number(IncomeIncrease) && Number(ExpenseIncrease) && Number(SellingCosts)) {
      setprojectionDisable(true);
    } else {
      setprojectionDisable(false);
    }
  }, [disabler]);

  return (
    <form className={root} noValidate autoComplete="off">
      <InfoLabel
        nameClass={classes.subLabel}
        name={"Appreciation (% per year)"}
        text={"The expected annual increment in property’s market value"}
      />
      <TextField
        id="outlined-start-adornment"
        type="number"
        value={Appreciation}
        onChange={(e) => {
          setAppreciation(e.target.value);
          setDisabler(!disabler);
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
        name={"Income increase (% per year)"}
        text={
          "The expected annual increment in property’s rental income and other incomes"
        }
      />
      <TextField
        id="outlined-start-adornment"
        type="number"
        value={IncomeIncrease}
        onChange={(e) => {
          setIncomeIncrease(e.target.value);
          setDisabler(!disabler);
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
        name={"Expense increase (% per year)"}
        text={"The expected annual increment in property’s operating expenses"}
      />
      <TextField
        id="outlined-start-adornment"
        type="number"
        value={ExpenseIncrease}
        onChange={(e) => {
          setExpenseIncrease(e.target.value);
          setDisabler(!disabler);
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
        name={"Selling costs (% of sales price)"}
        text={
          "Selling cost (aka closing costs) are expenses and fees due at the closing of a real estate transaction while selling a property"
        }
      />
      <TextField
        id="outlined-start-adornment"
        type="number"
        value={SellingCosts}
        onChange={(e) => {
          setSellingCosts(e.target.value);
          setDisabler(!disabler);
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
          className: classes.input
        }}
        variant="outlined"
        style={{ width: "100%", margin: "10px 0px 25px 0px" }}
        size="small"
      />


      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0px 25px 0px" }} >
        <InfoLabel
          nameClass={classes.subLabel}
          name={"Add Depreciation Deduction"}
          text={
            "A type of tax deduction available to real estate investors. Yearly depreciation = (Purchase price + Purchase costs + Rehab costs - Land Value) / Depreciation Period"
          }
        />
        <Switch
          checked={state.checkedB}
          onChange={async (event) => {
            const val = event.target.checked;
            setState({ ...state, [event.target.name]: event.target.checked });
            if (val === false) {
              await updateAnalysisReport({
                reportData: { DepreciationPeriod: "", LandValue: "" },
                reportId,
                teamId,
              });
              setDepreciationPeriod("");
              setLandValue("");
            }
          }}
          name="checkedB"
          color="primary"
        />
      </div>



      {state.checkedB === true ? (
        <>
          <InfoLabel
            nameClass={classes.subSubLabel}
            name={"Depreciation Period (years)"}
            text={
              "The useful lifespan of a property, used to calculate depreciation deduction"
            }
          />
          <TextField
            id="outlined-start-adornment"
            type="number"
            value={DepreciationPeriod}
            onChange={(e) => {
              setDepreciationPeriod(e.target.value);
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">Year(s)</InputAdornment>,
              className: classes.input
            }}
            variant="outlined"
            style={{ width: "100%", margin: "10px 0px 25px 0px" }}
            size="small"
          />
          <InfoLabel
            nameClass={classes.subSubLabel}
            name={"Land Value ($)"}
            text={
              "The estimated value of the land on which the property/structure is built"
            }
          />
          <TextFieldNumberFormated
            value={LandValue}
            onChange={(e) => {
              setLandValue(e.target.value);
            }}
            variant={"outlined"}
            style={{ width: "100%", margin: "10px 0px 25px 0px" }}
            size={"small"}
            disabled={false}
          />
        </>
      ) : null}
    </form>
  );
}
