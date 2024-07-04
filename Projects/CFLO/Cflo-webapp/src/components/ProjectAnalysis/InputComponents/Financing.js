import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { InputLabel } from "@material-ui/core";
import { updateAnalysisReport } from "../api.call";
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import InfoLabel from "./InfoLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from "@material-ui/core/Select";
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { useDebounce } from "react-use";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  control_switch: {
    marginLeft: "auto",
  },
  checked_component: {
    marginBottom: "20px",
    "& .MuiInputLabel-root": {
      display: "inline",
    },
    alignContent: "right",
    "& Button": {
      margin: "0.5rem",
    },
  },
  checked_controls: {
    marginLeft: "0.5rem",
  },
  onButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
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
    margin: "1rem 0rem",
  },
  showDisplayFlex: {
    width: "100%",
    [theme.breakpoints.down('sm')]: {
      marginBottom: "40px",
    }
  },
  showDisplayFlex50: {
    width: "calc(100% - 50px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "50px",
    [theme.breakpoints.down('sm')]: {
      width: "calc(100% - 25px)",
      marginLeft: "25px",
      marginBottom: "40px",
      flexDirection: 'column',
      alignItems: "flex-start"
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
  input: {
    backgroundColor: "#FCFCFC",
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
}));

export default function RentalFinance({
  reportId,
  teamId,
  currentReport,
  setCurrentReport,
  setView,
  setItemType,
  setFinancingDisable,
  financingDisable
}) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    root,
    control_switch,
    checked_component,
    checked_controls,
    onButton,
    rehabOn,
    mortgageOn,
    purchase_container,
    rehab_container,
    purchase_contents,
    rehab_contents,
    rehab_itemized,
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

  const [LoanType, setLoanType] = useState(currentReport?.LoanType || "");
  const [financeBool, setFinanceBool] = useState(currentReport?.isFinancing || false);
  const [DownPayment, setDownPayment] = useState(currentReport?.DownPayment || "");
  const [InterestRate, setInterestRate] = useState(currentReport?.InterestRate || "");
  const [LoanTerm, setLoanTerm] = useState(currentReport?.LoanTerm || "");
  const [RehabCostPercent, setRehabCostPercent] = useState(currentReport?.RehabCostPercent || "");
  const [financeMortgageType, setFinanceMortgageType] = useState(currentReport?.financeMortgageType || "Borrower-paid Mortgage Insurance(BPMI)");
  const [Upfront, setUpfront] = useState(currentReport?.Upfront || "");
  const [Recurring, setRecurring] = useState(currentReport?.Recurring || "");
  const [amortizingColor, setAmortizingColor] = useState("contained");
  const [interestColor, setInterestColor] = useState("outlined");

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const updateReportWithDebounce = async () => {
    const res = await updateAnalysisReport({
      reportData: {
        LoanType: LoanType,
        Recurring: Recurring,
        Upfront: Upfront,
        isFinancing: financeBool,
        DownPayment: DownPayment,
        InterestRate: InterestRate,
        LoanTerm: LoanTerm,
        RehabCostPercent: RehabCostPercent,
        financeMortgageType: financeMortgageType,
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
    [LoanType, financeBool, DownPayment,
      InterestRate, LoanTerm, RehabCostPercent,
      financeMortgageType, Upfront, Recurring
    ]
  )

  useEffect(() => {
    if (Number(DownPayment) && Number(InterestRate) && Number(LoanTerm)) {
      setFinancingDisable(true);
      console.log("purchasedisable is true now");
    } else {
      setFinancingDisable(false);
      console.log("purchasedisable is false now");
    }
  }, [DownPayment, InterestRate, LoanTerm]);

  useEffect(() => {
    if (Number(currentReport?.LoanTerm)) {
      setb1(true);
      setb2(false);
      setLoanType("Amortizing");
    } else {
      setAmortizingColor("outlined");
      setInterestColor("contained");
      setb2(true);
      setb1(false);
      setLoanType("Interest Only");
    }
    if (Number(currentReport?.DownPayment)) {
      setState({ ...state, checkedA: true });
    }
    if (Number(currentReport?.RehabCostPercent)) {
      setRehabState({ ...rehabState, checkedOn: true });
    }
    if (Number(currentReport?.Upfront) || Number(currentReport?.Recurring)) {
      setMortgageState({ ...mortgageState, mOn: true });
    }
  }, []);

  return (
    <form className={root} noValidate autoComplete="off">
      <div className={onButton}>
        <InputLabel className={classes.subheading} >Use Financing</InputLabel>
        <Switch
          className={control_switch}
          checked={financeBool}
          onChange={(event) => {
            setFinanceBool(event.target.checked)
          }}
          name="checkedA"
          color="primary"
        />
      </div>
      {financeBool ? (<>
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
            value={LoanType}
            onChange={(e) => {
              let val = e.target.value;
              setLoanType(val);
              if (val === "Amortizing") {
                setb1(true);
                setb2(false);
              } else {
                setb2(true);
                setb1(false);
                setLoanTerm("")
                setUpfront("");
                setRecurring("");
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
        <InfoLabel
          nameClass={classes.subLabel}
          name={"Down Payment (%)"}
          text={
            "Down payment on home loan is the upfront payment you make to a bank (as a percentage of property’s purchase price)"
          }
        />
        <TextField
          id="outlined-start-adornment"
          type="number"
          value={DownPayment}
          onChange={(e) => {
            setDownPayment(e.target.value);
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
          name={"Interest Rate (%)"}
          text={
            "The rate of interest charged by a bank on loan amount, compounded annually in case of amortizing loans"
          }
        />
        <TextField
          id="outlined-start-adornment"
          value={InterestRate}
          type="number"
          onChange={(e) => {
            setInterestRate(e.target.value);
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
              id="outlined-start-adornment"
              value={LoanTerm}
              type="number"
              onChange={(e) => {
                setLoanTerm(e.target.value);
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
        <div className={classes.onButton} >
          <InfoLabel
            nameClass={classes.subLabel}
            name={"Finance Rehab Costs"}
            text={
              "Finance a part/entire of rehab costs needed for the property"
            }
          />
          <Switch
            checked={rehabState.checkedOn}
            onChange={(event) => {
              setRehabState({
                ...rehabState,
                [event.target.name]: event.target.checked,
              });
              const val = event.target.checked;
              if (val === false) {
                setRehabCostPercent("")
              }
            }}
            name="checkedOn"
            color="primary"
          />
        </div>
        {rehabState.checkedOn === true ? (
          <>
            <InfoLabel
              nameClass={classes.subSubLabel}
              name={"Percentage (of Rehab Cost)"}
              text={
                "Percentage (of Rehab Cost)"
              }
            />
            <TextField
              id="outlined-start-adornment"
              value={RehabCostPercent}
              type="number"
              onChange={(e) => {
                setRehabCostPercent(e.target.value);
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
        {b1 === true ? (<>
          <div className={classes.onButton} style={{ margin: "10px 0px 25px 0px" }} >
            <InfoLabel
              nameClass={classes.subLabel}
              name={"Mortgage Insurance"}
              text={
                "Mortgage insurance is a type of insurance you might be required to pay for if you have a conventional loan. It is generally required by lenders if your down payment is less than 20% of the property value. \n ->Borrower-Paid Mortgage Insurance: BPMI comes in the form of an additional monthly fee that you pay with your mortgage payment. \n ->Single-Premium Mortgage Insurance: Also called single-payment mortgage insurance, here you pay mortgage insurance upfront in a lump sum. \n ->Split-Premium Mortgage Insurance: Here you pay part of the mortgage insurance as a lump sum upfront and part monthly."
              }
            />
            <Switch
              checked={mortgageState.mOn}
              onChange={(event) => {
                setMortgageState({
                  ...mortgageState,
                  [event.target.name]: event.target.checked,
                });
                const val = event.target.checked;
                if (val === false) {
                  setUpfront("")
                  setRecurring("")
                }
              }}
              name="mOn"
              color="primary"
            />
          </div>
          {mortgageState.mOn === true ? (
            <div>
              <p className={classes.subSubLabel} > Select Mortgage Type</p>
              <FormControl size="small" variant="outlined" style={{ width: "100%", margin: "10px 0px 25px 0px" }} >
                <Select
                  style={{ width: "100%", backgroundColor: "#FCFCFC" }}
                  labelId="propertyType-label"
                  id="pTypeId"
                  value={financeMortgageType}
                  onChange={(e) => {
                    setFinanceMortgageType(e.target.value);
                    setUpfront("")
                    setRecurring("")
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
              {financeMortgageType !==
                "Borrower-paid Mortgage Insurance(BPMI)" ? (
                <div className={classes.showDisplayFlex} >
                  <p className={classes.subSubLabel} >Upfront (% of Loan)</p>
                  <TextField
                    id="outlined-start-adornment"
                    type="number"
                    value={Upfront}
                    onChange={(e) => {
                      setUpfront(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      className: classes.input
                    }}
                    variant="outlined"
                    style={{ width: "100%", margin: "10px 0px 25px 0px" }}
                    size="small"
                  />
                </div>
              ) : null}
              {financeMortgageType !==
                "Single-Premium Mortgage Insurance" ? (
                <div className={classes.showDisplayFlex} >
                  <p className={classes.subSubLabel} >Recurring (% of Loan Per year)</p>
                  <TextField
                    type="number"
                    id="outlined-start-adornment"
                    value={Recurring}
                    onChange={(e) => {
                      setRecurring(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      className: classes.input
                    }}
                    variant="outlined"
                    style={{ width: "100%", margin: "10px 0px 25px 0px" }}
                    size="small"
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </>) : null}
      </>) : null}
    </form>
  );
}
