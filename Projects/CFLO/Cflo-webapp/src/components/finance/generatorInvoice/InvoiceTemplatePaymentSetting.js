import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import { Button, useMediaQuery } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import {
  constrcutArrayOfBillNo,
  getTxTemplateByWallet,
  updateTxTemplate,
  updateTxTemplateScheduleData,
} from "../transaction/api";
import Typography from "@material-ui/core/Typography";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import CommonAppBar from "../../styled/CommonComponents/Commont.AppBar";
import DialogBillNo from "../bill/DialogBillNo";
import MyAutocomplete from "../../styled/CommonComponents/MyAutoComplete";
import { schedules } from "../generator/IntervalData";
import Interval from "../generator/Interval";
import { getIncomeChartAccounts } from "../offering/utils";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ChartAccountCreateForBank from "../invoice/ChartAccountCreateForBank";
import MyNavBar from "../../styled/CommonComponents/MyNavBar";
import StripeAccountOptions from "../invoice/StripeAccountOptions";
import DwollaAccountOptions from "../invoice/DwollaAccountOptions";
import dwollaLogo from "../../../Assets/dwolla.png";
import stripeText from "../../../Assets/stripeText.png";
import stripeLogo from "../../../Assets/stripeLogo.png";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import SchedulerForm from "../../scheduler/SchedulerForm";
import Api from "../../../helpers/Api";

const useStyles = makeStyles((theme) => ({
  iconButtonStyle: {
    [theme.breakpoints.down("sm")]: {
      marginLeft: "-10px",
    },
  },
  hederText: {
    fontSize: "19px",
    fontWeight: "550",
    [theme.breakpoints.down("md")]: {
      width: "105px",
      fontSize: "10px",
    },
  },
  alignSwitch: {
    width: "150px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  nextIcon: {
    transform: "rotate(180deg)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mainCont: {
    marginLeft: "40px",
    marginTop: "110px",
    [theme.breakpoints.down("md")]: {
      marginLeft: "10px",
    },
  },
  schedulPaperSty: {
    marginTop: "30px",
    width: "98%",
    padding: "5px",
    paddingBottom: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
  },
  topScheduling: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      width: "95%",
    },
  },
  scheduleCond: {
    display: "flex",
    alignItems: "center",
    width: "400px",
    marginLeft: "12px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
      width: "300px",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
      width: "250px",
    },
  },
  nameCl: {
    marginTop: "5px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "15px",
      marginBottom: "10px",
    },
  },
  InputBox: {
    width: "40px",
    height: "40px",
    marginRight: "8px",
    marginLeft: "8px",
    fontSize: "18px",
    marginTop: "5px",
    textAlign: "center",
  },
  marginText: {
    marginLeft: "5px",
    fontSize: "18px",
  },
  scheduleText: {
    marginLeft: "15px",
    fontSize: "18px",
    [theme.breakpoints.down("sm")]: {
      width: "150px",
      fontSize: "13px",
    },
  },
  schedulePaperCont: {
    width: "98%",
    padding: "15px 25px",
  },
  scheduleTitle: {
    fontSize: "18px",
    fontWeight: "520",
    marginBottom: "20px",
  },
  chartAccountTitle: {
    fontSize: "18px",
    fontWeight: "550",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
  },
  templateHeader: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InvoiceTemplatePaymentSetting(props) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

  const {
    setPageLevel,
    txTemplate,
    setTxTemplate,
    walletId,
    setLoadingBool,
  } = props;
  const { hederText, alignSwitch, nextIcon } = classes;
  const DateNow = new Date();

  const { user } = useSelector((state) => state.auth);
  const oldSwitchState = txTemplate?.generatorRunning || false;
  const [switchState, setSwitchState] = useState(oldSwitchState);
  const [txTemplateInvoiceNos, setTemplateTxInvoiceNos] = useState([]);
  const [maxNo, setMaxNo] = useState();
  const [open, setOpen] = useState(false);

  const [scheduler, setScheduler] = useState(txTemplate?.schedulingData || {});
  const oldTemlateName = txTemplate?.name || "";
  const [templateName, setTemplateName] = useState(oldTemlateName);

  const oldScheduleValue = txTemplate?.scheduleType || schedules[0];
  const [scheduleValue, setScheduleValue] = useState(oldScheduleValue);

  const [textSchedule, setScheduleText] = useState("");

  const oldScheduleDays = txTemplate?.scheduleDaysInAdvance || "0";
  const [scheduleDays, setScheduleDays] = useState(oldScheduleDays);

  const oldScheduleReminderDays = txTemplate?.reminderBeforeDays || "0";
  const [scheduleReminder, setScheduleReminder] = useState(
    oldScheduleReminderDays
  );

  const oldChartAccount = txTemplate?.BankChartAccount || null;
  const [selectedChartAccount, setSelectedChartAccount] = useState(
    oldChartAccount
  );

  const [chartAccountText, setChartAccountText] = useState("");

  const [chartAccounts, setChartAccounts] = useState([]);

  const [openChartAcc, setOpenChartAcc] = useState(false);

  const [show, setShow] = useState("stripe");

  const [selectedDwollaAcc, setSelectedDwollaAcc] = useState(null);
  const [selectedStripeAcc, setSelectedStripeAcc] = useState(null);

  const [openErr, setOpenErr] = useState(false);
  const [submitionFailMsg, setSubmitionFailMsg] = useState("");

  useEffect(() => {
    const type = { classification: "Bank", wallet: walletId };
    getIncomeChartAccounts({ type })
      .then((accounts) => {
        console.log(accounts);

        const addObject = {
          _id: "New",
          name: "+ Add New",
          numDays: "0",
        };
        const newFiltered = [addObject, ...accounts];

        setChartAccounts(newFiltered);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [walletId]);

  useEffect(() => {
    async function joinScheduler() {
      if (scheduler?._id) {
        const txTemplateRes = await Api.post("txtemplate/update", {
          ...txTemplate,
          schedulingData: scheduler?._id,
        });

        console.log("txTemplate Updated", txTemplateRes);
        if (txTemplateRes) setTxTemplate(txTemplateRes?.data);
      }
    }

    joinScheduler();
  }, [scheduler?._id]);

  useEffect(() => {
    if (typeof scheduler === "object" && !Array.isArray(scheduler)) {
      setTxTemplate({
        ...txTemplate,
        schedulingData: { ...scheduler },
      });
      console.log("updated txTemplate", {
        ...txTemplate,
        schedulingData: { ...scheduler },
      });
    }
  }, [scheduler]);

  const update = async (obj, isBankChartUpdate = false) => {
    setLoadingBool(true);

    if (isBankChartUpdate) {
      const newObj = {
        _id: obj?._id,
        BankChartAccount: obj?.BankChartAccount?._id,
      };
      await updateTxTemplate(newObj);
      setTxTemplate({
        ...txTemplate,
        BankChartAccount: obj?.BankChartAccount,
      });
    } else {
      await updateTxTemplate(obj);
      setTxTemplate({
        ...txTemplate,
        ...obj,
      });
    }

    setLoadingBool(false);
  };

  const onStripeBankAccountSelect = async (value) => {
    setSelectedStripeAcc(value);
    console.log(value);

    await update({
      _id: txTemplate?._id,
      stripeConfig: {
        receiverStripeAcc: value?.stripeConnectAccountId,
      },
    });
  };

  const onBankAccountSelect = async (value) => {
    console.log(value);
    setSelectedDwollaAcc(value);

    await update({
      _id: txTemplate?._id,
      dwollaConfig: {
        receiverDwollaBankAcc: value?.url,
      },
    });
  };

  const onNew = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getOptionLabel = (option) => {
    return option || " ";
  };

  const getOptionLabelObj = (option) => {
    return option.name || " ";
  };

  const onScheduleSelect = async (value) => {
    await update({
      _id: txTemplate?._id,
      scheduleType: value,
    });
    setScheduleValue(value);
  };

  //check in invoice
  const onSelectChartAccount = async (value) => {
    console.log("selected" + value);
    setSelectedChartAccount(value);

    await update(
      {
        _id: txTemplate?._id,
        BankChartAccount: value,
      },
      true
    );
  };

  const onNewChartAccount = () => {
    setOpenChartAcc(true);
  };

  const chartAccountCreateDialog = async (value) => {
    console.log(value);
    setOpenChartAcc(value);

    const type = { classification: "Bank", wallet: walletId };

    getIncomeChartAccounts({ type })
      .then(async (accounts) => {
        const addObject = {
          _id: "New",
          name: "+ Add New",
          numDays: "0",
        };

        const newFiltered = [addObject, ...accounts];
        const len = accounts?.length;
        setChartAccounts(newFiltered);
        setSelectedChartAccount(accounts[len - 1]);

        await update(
          {
            _id: txTemplate?._id,
            BankChartAccount: accounts[len - 1],
          },
          true
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTxTemplateByWallet({ walletId: walletId, type: "Invoice" }) // keep bill in an array
      .then((data) => {
        if (data.length > 0) {
          constrcutArrayOfBillNo(data, "invNo")
            .then((newArr) => {
              setTemplateTxInvoiceNos(newArr);

              let maxNoff = 1;
              newArr.map((number) => {
                if (parseInt(number) > maxNoff) {
                  maxNoff = parseInt(number);
                }
              });
              setMaxNo(maxNoff);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCloseErrBox = () => {
    setOpenErr(false);
  };

  const turnOnGenerator = async () => {
    setLoadingBool(true);

    let taxItemBool = false;
    let isItemMissChart = false;

    let items = txTemplate?.billList?.items;
    if (!txTemplate?.secondParty || !txTemplate?.secondPartyWallet) {
      setSubmitionFailMsg("Customer is missing! Please select a customer");
      setOpenErr(true);
      return;
    }

    items.length > 0 &&
      items.map((item) => {
        if (item?.tax) {
          taxItemBool = true;
        }

        if (!item?.chartAccount?._id) {
          isItemMissChart = true;
        }
      });

    if (isItemMissChart) {
      setSubmitionFailMsg(
        "item Chart Account is missing! Please select category in item carefully"
      );
      setOpenErr(true);
      return;
    }

    if (
      txTemplate?.billList?.tax?.enabled &&
      taxItemBool &&
      !txTemplate?.billList?.taxRelationModel?.chartAccount?._id
    ) {
      setSubmitionFailMsg("Tax Chart Account is missing! Please select a tax");
      setOpenErr(true);
      return;
    }

    if (
      txTemplate?.billList?.discount?.enabled &&
      !txTemplate?.billList?.discountRelationModel?.chartAccount?._id
    ) {
      setSubmitionFailMsg(
        "Discount Chart Account is missing! Please select a discount"
      );
      setOpenErr(true);
      return;
    }

    await updateTxTemplate({
      _id: txTemplate?._id,
      generatorRunning: true,
    });

    const updatedTxTemplate = {
      ...txTemplate,
      generatorRunning: true,
    };
    setTxTemplate(updatedTxTemplate);

    setLoadingBool(false);
  };

  return (
    <div>
      <CommonAppBar
        leftItems={[
          <IconButton
            className={classes.iconButtonStyle}
            onClick={() => {
              setPageLevel("otherSettings");
            }}
          >
            <KeyboardBackspaceIcon />
          </IconButton>,
          <div className={classes.templateHeader}>
            <Typography className={hederText}>INVOICE GENERATOR</Typography>
            <Typography className={hederText} style={{ marginLeft: "3px" }}>
              #{txTemplate?.invNo}
            </Typography>
          </div>,
          <IconButton color="primary" onClick={() => onNew()}>
            <EditIcon />
          </IconButton>,
        ]}
        rightItems={[
          <div className={alignSwitch}>
            {switchState ? (
              <p style={{ color: "red" }}>want to turn off?</p>
            ) : (
              <p style={{ color: "green" }}>want to turn on?</p>
            )}
            <Switch
              checked={switchState}
              onChange={async () => {
                let oldState = switchState;
                switchState ? setSwitchState(false) : setSwitchState(true);

                if (!oldState) {
                  await turnOnGenerator();
                } else {
                  await updateTxTemplate({
                    _id: txTemplate?._id,
                    generatorRunning: false,
                  });

                  const updatedTxTemplate = {
                    ...txTemplate,
                    generatorRunning: false,
                  };
                  setTxTemplate(updatedTxTemplate);
                }
              }}
              label="Normal"
              name="checkedB"
              color="primary"
            />
          </div>,
        ]}
      />

      <DialogBillNo
        open={open}
        handleClose={handleClose}
        txNos={txTemplateInvoiceNos}
        tx={txTemplate}
        setTx={setTxTemplate}
        type={"InvoiceTemplate"}
        maxNo={maxNo}
        setMaxNo={setMaxNo}
        walletId={walletId}
        setLoadingBool={setLoadingBool}
      />

      <div className={classes.mainCont}>
        {/* <Paper elevation={1} className={classes.schedulePaperCont}>
          <div className={classes.chartAccountTitle}>
            <span style={{ marginRight: "10px" }}>
              <EventAvailableIcon
                style={{ color: "#4CACEF", fontSize: "30px", marginTop: "6px" }}
              />
            </span>
            Scheduling
          </div>

          <div className={classes.topScheduling}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Name"
              value={templateName}
              size="small"
              className={classes.nameCl}
              onChange={async (event) => {
                const name = event.target.value;
                setTemplateName(name);
                await updateTxTemplate({
                  _id: txTemplate?._id,
                  name: name,
                });

                const updatedTxTemplate = {
                  ...txTemplate,
                  name: name,
                };
                setTxTemplate(updatedTxTemplate);
              }}
            />

            <div style={{ marginLeft: "-4px" }}>
              <MyAutocomplete
              isSmall={false}
                value={scheduleValue}
                text={textSchedule}
                setText={setScheduleText}
                placeholder={"Type"}
                results={schedules}
                getOptionLabel={getOptionLabel}
                onSelect={onScheduleSelect}
                label={"Schedule"}
                setWidth={"250px"}
              />
            </div>

            {scheduleValue === "Schedule" ? (
              <div className={classes.scheduleCond}>
                <span className={classes.marginText}>Create</span>
                <input
                  type="text"
                  className={classes.InputBox}
                  value={scheduleDays}
                  onChange={async (event) => {
                    const days = event.target.value;
                    setScheduleDays(days);
                    await updateTxTemplate({
                      _id: txTemplate?._id,
                      scheduleDaysInAdvance: days,
                    });

                    const updatedTxTemplate = {
                      ...txTemplate,
                      scheduleDaysInAdvance: days,
                    };
                    setTxTemplate(updatedTxTemplate);
                  }}
                />
                <div className={classes.scheduleText}>days in advance</div>
              </div>
            ) : null}
            {scheduleValue === "Reminder" ? (
              <div className={classes.scheduleCond}>
                <span className={classes.marginText}>Remind</span>
                <input
                  type="text"
                  className={classes.InputBox}
                  value={scheduleReminder}
                  onChange={async (event) => {
                    const days = event.target.value;
                    setScheduleReminder(days);
                    await updateTxTemplate({
                      _id: txTemplate?._id,
                      reminderBeforeDays: days,
                    });

                    const updatedTxTemplate = {
                      ...txTemplate,
                      reminderBeforeDays: days,
                    };
                    setTxTemplate(updatedTxTemplate);
                  }}
                />
                <div className={classes.scheduleText}>
                  days before the transaction date
                </div>
              </div>
            ) : null}
            {scheduleValue === "Unschedule" ? (
              <div className={classes.scheduleCond}>
                <div style={{ width: "300px" }}>
                  Unscheduled transactions don’t have timetables; you use them
                  as needed from the Recurring Transactions list.
                </div>
              </div>
            ) : null}
          </div>

          <Interval
            scheduleValue={scheduleValue}
            updateTxTemplate={updateTxTemplateScheduleData}
            txTemplate={txTemplate}
            setTxTemplate={setTxTemplate}
          />
        </Paper> */}
        <SchedulerForm
          createByDefault
          scheduler={scheduler}
          setScheduler={setScheduler}
          parent={txTemplate?._id}
          parentModelName="TxTemplate"
        />

        <Paper
          elevation={1}
          className={classes.schedulePaperCont}
          style={{ marginTop: "40px" }}
        >
          <div className={classes.chartAccountTitle}>
            <span style={{ marginRight: "10px" }}>
              <AccountBalanceIcon
                style={{ color: "#4CACEF", fontSize: "30px", marginTop: "6px" }}
              />
            </span>
            Choose the bank account where the amount will added after the
            payment done
          </div>

          <div style={{ marginLeft: "-20px" }}>
            <MyAutocomplete
              isSmall={false}
              value={selectedChartAccount}
              text={chartAccountText}
              setText={setChartAccountText}
              placeholder={"Chart Account"}
              results={chartAccounts}
              getOptionLabel={getOptionLabelObj}
              onSelect={onSelectChartAccount}
              label={"Chart Account"}
              onNew={onNewChartAccount}
              setWidth={"300px"}
            />
          </div>

          <ChartAccountCreateForBank
            walletId={walletId}
            openDialog={openChartAcc}
            setOpenChart={chartAccountCreateDialog}
          />
        </Paper>

        <Paper
          elevation={1}
          className={classes.schedulePaperCont}
          style={{ marginTop: "40px", marginBottom: "50px" }}
        >
          <div className={classes.chartAccountTitle}>
            <span style={{ marginRight: "10px" }}>
              <MonetizationOnIcon
                style={{ color: "#4CACEF", fontSize: "30px", marginTop: "6px" }}
              />
            </span>
            Payment
          </div>

          <MyNavBar
            title={""}
            show={show}
            setShow={setShow}
            walletId={walletId}
            Component={null}
            isMenu={false}
            options={[
              {
                value: "stripe",
                label: "Stripe",
                Component: (
                  <div>
                    <StripeAccountOptions
                      setSelectedStripeAcc={setSelectedStripeAcc}
                      selectedStripeAcc={selectedStripeAcc}
                      onBankAccountSelect={onStripeBankAccountSelect}
                      userprofile={user?.profile}
                      walletId={user?.wallet}
                      user={user}
                      tx={txTemplate}
                      stripeText={stripeText}
                      stripeLogo={stripeLogo}
                    />
                  </div>
                ),
              },
              {
                value: "dwolla",
                label: "Dwolla",
                Component: (
                  <div>
                    <DwollaAccountOptions
                      setSelectedDwollaAcc={setSelectedDwollaAcc}
                      selectedDwollaAcc={selectedDwollaAcc}
                      onBankAccountSelect={onBankAccountSelect}
                      userprofile={user?.profile}
                      walletId={user?.wallet}
                      user={user}
                      tx={txTemplate}
                      dwollaLogo={dwollaLogo}
                    />
                  </div>
                ),
              },
            ]}
          />
        </Paper>
      </div>

      <Dialog
        open={openErr}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseErrBox}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" style={{ color: "red" }}>
          {submitionFailMsg}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseErrBox} color="primary">
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
