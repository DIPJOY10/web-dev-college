import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { InputLabel } from "@material-ui/core";
import { updateAnalysisReport } from "../api.call";
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FormTextField from "../FormTextField";
import OutlinedButton from "../OutlinedButton";
import InfoLabel from "./InfoLabel";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import useMortgage from "../hooks/useMortgage";
import DynamicMultiInput from "./DynamicMultiInput";
import { useDebounce } from "react-use";
import TextFieldNumberFormated from "../../styled/CommonComponents/TextFieldNumberFormated";


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
    // marginTop: "1rem",
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
  refinanceCost_container: {
    // margin: "0.5rem",
    // marginTop: "1.5rem",
  },
  refinanceCost_contents: {
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
  showDisplayFlex: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "10px 0px 25px 0px",
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
  optionCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    margin: "10px 0px 15px 0px",
    [theme.breakpoints.down('sm')]: {
      margin: "7px 0px 10px 0px",
    }
  },
  radiolabel: {
    fontSize: "16px",
    fontWeight: "510",
    [theme.breakpoints.down('xs')]: {
      fontSize: "12px",
      fontWeight: "500",
    }
  },
  input: {
    backgroundColor: "#FCFCFC",
  },
}));

export default function BRRRRRefinance({
  reportId,
  teamId,
  currentReport,
  setCurrentReport,
  setView,
  setItemType,
}) {
  const theme = useTheme();
  const classes = useStyles();

  //   Checked Buttons
  const [state, setState] = useState({
    checkedA: false,
    checkedB: true,
  });

  const [mortgageState, setMortgageState] = useState({
    mOn: false,
    mOff: true,
  });

  const [b1, setb1] = useState(true);
  const [b2, setb2] = useState(false);

  //form hooks
  const [refinanceTime, setRefinanceTime] = useState(currentReport?.refinanceTime || "");
  const [refinanceLoanType, setRefinanceLoanType] = useState(currentReport?.refinanceLoanType || "");
  const [refinanceLoanAmount, setRefinanceLoanAmount] = useState(currentReport?.refinanceLoanAmount || "");
  const [remainingEquity, setRemainingEquity] = useState(currentReport?.remainingEquity || "");
  const [refinanceInterestRate, setRefinanceInterestRate] = useState(currentReport?.refinanceInterestRate || "");
  const [refinanceLoanTerm, setRefinanceLoanTerm] = useState(currentReport?.refinanceLoanTerm || "");
  const [refinanceMortgageType, setRefinanceMortgageType] = useState(currentReport?.refinanceMortgageType || "Borrower-paid Mortgage Insurance(BPMI)");
  const [refinanceUpfront, setRefinanceUpfront] = useState(currentReport?.refinanceUpfront || "");
  const [refinanceRecurring, setRefinanceRecurring] = useState(currentReport?.refinanceRecurring || "");
  const [refinanceCostTotal, setRefinanceCostTotal] = useState(currentReport?.refinanceCostTotal || "");

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const updateReportWithDebounce = async () => {
    await updateAnalysisReport({
      reportData: {
        refinanceTime: refinanceTime,
        refinanceLoanType: refinanceLoanType,
        refinanceLoanTerm: refinanceLoanTerm,
        refinanceUpfront: refinanceUpfront,
        refinanceRecurring: refinanceRecurring,
        refinanceLoanAmount: refinanceLoanAmount,
        remainingEquity: remainingEquity,
        refinanceMortgageType: refinanceMortgageType,
        refinanceInterestRate: refinanceInterestRate,
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
    [refinanceTime, refinanceLoanType, refinanceLoanAmount,
      remainingEquity, refinanceInterestRate, refinanceLoanTerm,
      refinanceMortgageType, refinanceUpfront, refinanceRecurring]
  )


  useEffect(() => {
    if (Number(currentReport?.refinanceLoanTerm)) {
      setb2(true);
      setb1(false);
      setRefinanceLoanType("Amortizing")
    } else {
      setb1(true);
      setb2(false);
      setRefinanceLoanType("Interest Only")
    }
    if (Number(currentReport?.refinanceUpfront) || Number(currentReport?.refinanceRecurring)) {
      setMortgageState({ ...mortgageState, mOn: true });
    }
  }, []);

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <p className={classes.subLabel} >Refinance After(months)</p>
      <TextField
        id="outlined-start-adornment"
        type="number"
        value={refinanceTime}
        onChange={(e) => {
          setRefinanceTime(e.target.value);
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">Months</InputAdornment>,
          className: classes.input
        }}
        variant="outlined"
        style={{ width: "100%", margin: "10px 0px 25px 0px" }}
        size="small"
      />
      <InfoLabel
        nameClass={classes.subLabel}
        name={"Loan Type"}
        text={"Select Loan type - Amortizing/Interest Only"}
      />
      <FormControl
        component="fieldset"
        style={{ width: "100%", margin: "0px" }}
      >
        <RadioGroup
          className={classes.optionCont}
          aria-label="gender"
          name="gender1"
          value={refinanceLoanType}
          onChange={(e) => {
            let val = e.target.value;
            setRefinanceLoanType(val);
            if (val === "Amortizing") {
              setb1(true);
              setb2(false);
            } else {
              setb2(true);
              setb1(false);
              setRefinanceLoanTerm("")
              setRefinanceUpfront("")
              setRefinanceRecurring("")
            }
          }}
        >
          <FormControlLabel
            value="Amortizing"
            control={<Radio color="primary" />}
            label={<p className={classes.radiolabel} >Amortizing</p>}
          />
          <FormControlLabel
            value="Interest Only"
            control={<Radio color="primary" />}
            label={<p className={classes.radiolabel} >Interest Only</p>}
          />
        </RadioGroup>
      </FormControl>
      <div className={classes.showDisplayFlex} >
        <p className={classes.subLabel} >Custom Loan Amount</p>
        <Switch
          className={classes.control_switch}
          checked={state.checkedA}
          onChange={async (event) => {
            const val = event.target.checked;
            setState({ ...state, [event.target.name]: val });
            if (val === false) {
              setRefinanceLoanAmount("")
            }
          }}
          name="checkedA"
          color="primary"
        />
      </div>
      {state.checkedA ? (
        <>
          <p className={classes.subLabel} >Loan Amount</p>
          <TextFieldNumberFormated
            value={refinanceLoanAmount}
            onChange={(e) => {
              setRefinanceLoanAmount(e.target.value);
            }}
            variant={"outlined"}
            style={{ width: "100%", margin: "10px 0px 25px 0px" }}
            size={"small"}
            disabled={false}
          />
        </>
      ) : (
        <>
          <InfoLabel
            nameClass={classes.subLabel}
            name={"Remaining Equity (%)"}
            text={
              "Equity remaining after refinance. Remaining equity = 1 - LTV"
            }
          />
          <TextField
            type="number"
            id="outlined-start-adornment"
            value={remainingEquity}
            onChange={(e) => {
              setRemainingEquity(e.target.value);
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
              className: classes.input
            }}
            variant="outlined"
            style={{ width: "100%", margin: "10px 0px 25px 0px" }}
            size="small"
          />
        </>
      )}
      <InfoLabel
        nameClass={classes.subLabel}
        name={"Interest Rate (%)"}
        text={
          "The rate of interest charged by a bank on loan amount, compounded annually in case of amortizing loans"
        }
      />
      <TextField
        type="number"
        id="outlined-start-adornment"
        value={refinanceInterestRate}
        onChange={(e) => {
          setRefinanceInterestRate(e.target.value);
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
          className: classes.input
        }}
        variant="outlined"
        style={{ width: "100%", margin: "10px 0px 25px 0px" }}
        size="small"
      />
      {b1 === true ? (
        <>
          <InfoLabel
            nameClass={classes.subLabel}
            name={"Loan Term (years)"}
            text={
              "A loan term is the length of time it will take for a loan to be completely paid off when the borrower is making regular payments"
            }
          />
          <TextField
            type="number"
            id="outlined-start-adornment"
            value={refinanceLoanTerm}
            onChange={(e) => {
              setRefinanceLoanTerm(e.target.value);
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">Year(s)</InputAdornment>,
              className: classes.input
            }}
            variant="outlined"
            style={{ width: "100%", margin: "10px 0px 25px 0px" }}
            size="small"
          />
        </>
      ) : null}
      {b1 === true ? (
        <>
          <div className={classes.showDisplayFlex} >
            <InfoLabel
              nameClass={classes.subLabel}
              name={"Mortgage Insurance"}
              text={
                "Mortgage insurance is a type of insurance you might be required to pay for if you have a conventional loan. It is generally required by lenders if your down payment is less than 20% of the property value. \n ->Borrower-Paid Mortgage Insurance: BPMI comes in the form of an additional monthly fee that you pay with your mortgage payment. \n ->Single-Premium Mortgage Insurance: Also called single-payment mortgage insurance, here you pay mortgage insurance upfront in a lump sum. \n ->Split-Premium Mortgage Insurance: Here you pay part of the mortgage insurance as a lump sum upfront and part monthly."
              }
            />
            <Switch
              checked={mortgageState.mOn}
              onChange={async (event) => {
                setMortgageState({
                  ...mortgageState,
                  [event.target.name]: event.target.checked,
                });
                const val = event.target.checked;
                if (val === false) {
                  setRefinanceUpfront("")
                  setRefinanceRecurring("")
                }
              }}
              name="mOn"
              color="primary"
            />
          </div>
          {mortgageState.mOn === true ? (
            <>
              <p className={classes.subSubLabel} >Select Mortgage Type</p>
              <FormControl size="small" variant="outlined" style={{ width: "100%", margin: "10px 0px 25px 0px" }} >
                <Select
                  style={{ width: "100%", backgroundColor: "#FCFCFC" }}
                  labelId="propertyType-label"
                  id="pTypeId"
                  value={refinanceMortgageType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRefinanceMortgageType(val);
                  }}
                >
                  <MenuItem value="Borrower-paid Mortgage Insurance(BPMI)">
                    Borrower-paid Mortgage Insurance(BPMI)
                  </MenuItem>
                  <MenuItem value="Single-Premium Mortgage Insurance">
                    Single-Premium Mortgage Insurance
                  </MenuItem>
                  <MenuItem value="Split-Premium Mortgage Insurance">
                    Split-Premium Mortgage Insurance
                  </MenuItem>
                </Select>
              </FormControl>
              {refinanceMortgageType !== "Borrower-paid Mortgage Insurance(BPMI)" ? (
                <>
                  <p className={classes.subSubLabel} >Upfront (% of Loan)</p>
                  <TextField
                    type="number"
                    id="outlined-start-adornment"
                    value={refinanceUpfront}
                    onChange={(e) => {
                      setRefinanceUpfront(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      className: classes.input
                    }}
                    variant="outlined"
                    style={{ width: "100%", margin: "10px 0px 25px 0px" }}
                    size="small"
                  />
                </>
              ) : null}
              {refinanceMortgageType !== "Single-Premium Mortgage Insurance" ? (
                <>
                  <p className={classes.subSubLabel} >Recurring (% of Loan Per year)</p>
                  <TextField
                    type="number"
                    id="outlined-start-adornment"
                    value={refinanceRecurring}
                    onChange={(e) => {
                      setRefinanceRecurring(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      className: classes.input
                    }}
                    variant="outlined"
                    style={{ width: "100%", margin: "10px 0px 25px 0px" }}
                    size="small"
                  />
                </>
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
      <InfoLabel
        nameClass={classes.subLabel}
        name={"Refinance Costs"}
        text={
          "Refinance costs (aka closing costs) are expenses and fees associated with refinancing a property"
        }
      />
      <div style={{ width: "100%", margin: "10px 0px 25px 0px" }}  >
        <DynamicMultiInput
          items={currentReport?.refinanceCostsItemized}
          itemKeyType={"refinanceCostsItemized"}
          ItemType={"Refinance Cost"}
          currentReport={currentReport}
          setCurrentReport={setCurrentReport}
          total={refinanceCostTotal}
          setTotal={setRefinanceCostTotal}
          totalFieldKey={"refinanceCostTotal"}
          inputAdornment={"$"}
        />
      </div>
    </form>
  );
}
