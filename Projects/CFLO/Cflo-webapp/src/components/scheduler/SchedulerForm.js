import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import { Paper, Typography, Switch, FormControlLabel } from "@material-ui/core";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import moment from "moment";
import MyAutocomplete from "../styled/CommonComponents/MyAutoComplete";
import LoadingButton from "../styled/actionBtns/loading.btn";
import {
  days,
  daysMonth,
  daysOfWeek,
  intervalTypes,
  month,
  schedules,
  endDateType,
} from "../finance/generator/IntervalData.js";
import {
  findNextDate,
  findNextDateArr,
} from "../finance/generator/getNextDate.js";
import Api from "../../helpers/Api";
// import { schedules } from "../finance/generator/IntervalData";

const useStyles = makeStyles((theme) => ({
  mainPaperCont: {
    padding: "10px 0px",
    // marginTop: "30px",
    width: "98%",
    backgroundColor: "white",
    padding: "10px 40px",
    // minHeight: "100vh",
    // minWidth: "100%",
    [theme.breakpoints.down("md")]: {
      marginTop: "60px",
    },
  },
  chartAccountTitle: {
    fontSize: "18px",
    fontWeight: "550",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
  },
  topScheduling: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      width: "100%",
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
  InputBoxEndDays: {
    width: "40px",
    height: "40px",
    marginRight: "8px",
    marginLeft: "25px",
    fontSize: "18px",
    marginTop: "12px",
    textAlign: "center",
  },
  marginText: {
    marginLeft: "15px",
    fontSize: "16px",
    fontWeight: "550",
    [theme.breakpoints.down("xs")]: {
      margin: "0px",
    },
  },
  datePicker: {
    // width: 150,
  },
  intervalCont: {
    marginTop: "20px",
    marginBottom: "25px",
  },
  IntervalSubCont2: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      width: "100%",
      marginBottom: "10px",
    },
  },
  autoCompleteCont250: {
    width: "250px",
    [theme.breakpoints.down("md")]: {
      width: "90%",
      marginRight: "30px",
      marginBottom: "10px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "250px",
      marginRight: "10px",
      marginBottom: "10px",
      marginLeft: "-7px",
    },
  },
  autoCompleteCont150: {
    width: "150px",
    marginLeft: "-9px",
    [theme.breakpoints.down("md")]: {
      width: "95%",
      marginRight: "10px",
      marginBottom: "10px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "250px",
      marginRight: "10px",
      marginBottom: "10px",
      marginLeft: "-3px",
    },
  },
  autoCompleteCont140: {
    width: "140px",
    [theme.breakpoints.down("md")]: {
      width: "90%",
      marginRight: "25px",
      marginBottom: "10px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "250px",
      marginRight: "10px",
      marginBottom: "10px",
      marginLeft: "-7px",
    },
  },
  autoCompleteCont130: {
    width: "130px",
    marginTop: "10px",
    [theme.breakpoints.down("md")]: {
      width: "95%",
      marginRight: "60px",
      marginBottom: "10px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "250px",
      marginRight: "10px",
      marginBottom: "10px",
      marginLeft: "-7px",
    },
  },
  autoCompleteCont100: {
    width: "120px",
    [theme.breakpoints.down("md")]: {
      width: "95%",
      marginRight: "10px",
      marginBottom: "10px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "250px",
      marginRight: "10px",
      marginBottom: "10px",
      marginLeft: "-7px",
    },
  },
}));

export default function SchedulerForm(props) {
  const {
    parent,
    parentModelName,
    data,
    dataModel,
    scheduler: schedulerProp = {},
    setScheduler = () => { },
    createByDefault = false,
  } = props;
  const classes = useStyles();
  const {
    topScheduling,
    InputBox,
    marginText,
    datePicker,
    intervalCont,
    IntervalSubCont2,
    autoCompleteCont150,
    autoCompleteCont100,
    autoCompleteCont140,
    autoCompleteCont130,
    autoCompleteCont250,
    mainPaperCont,
  } = classes;

  const DateNow = new Date();

  const [scheduleValue, setScheduleValue] = useState(
    schedulerProp?.scheduleType || schedules[0]
  );
  const [textSchedule, setTextSchedule] = useState("");
  const [textIntervalTypes, setTextIntervalTypes] = useState("");
  const [textDays, setTextDays] = useState("");
  const [textDaysMonth, setTextDaysMonth] = useState("");
  const [textDaysOfWeek, setTextDaysOfWeek] = useState("");
  const [textMonth, setTextMonth] = useState("");
  const [textEndType, setTextEndType] = useState("");
  const [intervalTypesValue, setIntervalTypesValue] = useState("Monthly");
  const [intervalType, setIntervalType] = useState(
    schedulerProp?.intervalType || "MonthlyByDate"
  );
  const [daysValue, setDaysValue] = useState(
    schedulerProp?.dayOrWeekOfMonth || days[0]
  );
  const [afterXDays, setAfterXDays] = useState(
    schedulerProp?.afterXDays || "0"
  );
  const [afterXWeeks, setAfterXWeeks] = useState(
    schedulerProp?.afterXWeeks || "0"
  );
  const [dayOfWeekValue, setDayOfWeekValue] = useState(
    schedulerProp?.dayOfWeek || "Monday"
  );
  const [daysMonthValue, setDaysMonthValue] = useState(
    schedulerProp?.dayOfMonth || daysMonth[0]
  );
  const [monthValue, setMonthValue] = useState(
    schedulerProp?.month || month[0]
  );
  const [afterXMonth, setAfterXMonth] = useState(
    schedulerProp?.afterXMonth || "0"
  );
  const [startDate, setStartDate] = useState(
    schedulerProp?.startDate || moment().format("YYYY-MM-DDTHH:mm")
  );
  const [endDate, setEndDate] = useState(schedulerProp?.stopDate || DateNow);
  const [numberOfOccurrences, setNumberOfOccurrences] = useState(
    schedulerProp?.numberOfOccurrences || "0"
  );
  const [endTypeValue, setEndTypeValue] = useState(
    schedulerProp?.endType || endDateType[0]
  );
  const [nextDateFE, setNextDateFE] = useState(DateNow);
  const [textNextDate, setTextNextDate] = useState("");
  const [nextArr, setNextArr] = useState([]);
  const [recurring, setRecurring] = useState(schedulerProp?.recurring || true);
  const [scheduled, setScheduled] = useState(schedulerProp?.scheduled || false);
  const [loading, setLoading] = useState(false);

  const schedulingDataObj = {
    scheduleType: scheduleValue,
    intervalType: intervalType,
    dayOrWeekOfMonth: daysValue,
    afterXDays: afterXDays,
    afterXWeeks: afterXWeeks,
    dayOfWeek: dayOfWeekValue,
    month: monthValue,
    dayOfMonth: daysMonthValue,
    afterXMonth: afterXMonth,
    startDate: startDate,
    stopDate: endDate,
    numberOfOccurrences: numberOfOccurrences,
    endType: endTypeValue,
    recurring,
    scheduled,
    parent,
    parentModelName,
    data,
    dataModel,
  };

  useEffect(() => {
    funGetNextDate();
  }, [
    intervalType,
    daysValue,
    afterXDays,
    afterXWeeks,
    dayOfWeekValue,
    monthValue,
    daysMonthValue,
    afterXMonth,
    startDate,
    endDate,
    numberOfOccurrences,
    endTypeValue,
  ]);

  useEffect(() => {
    //create new schdeule if createByDefault is true and there doesn't exists any schdeuler already
    if (createByDefault && !schedulerProp?._id) createScheduler();
  }, [createByDefault]);

  const funGetNextDate = async () => {
    setNextArr(findNextDateArr(schedulingDataObj, startDate));
  };

  const formatDate = (date) => {
    return moment(date).format("MM/DD/YYYY, h:mm A");
  };

  const getOptionLabelSimple = (option) => {
    return option || " ";
  };

  const onIntervalTypeSelect = async (value) => {
    if (value === "Monthly" && daysValue === "Day") {
      setIntervalType("MonthlyByDate");
    } else if (value === "Monthly" && daysValue !== "Day") {
      setIntervalType("DayOfWeekOfMonth");
    } else {
      setIntervalType(value);
    }
    setIntervalTypesValue(value);
  };

  const onDaysSelect = async (value) => {
    if (value === "Day") {
      setIntervalType("MonthlyByDate");
    } else {
      setIntervalType("DayOfWeekOfMonth");
    }
    setDaysValue(value);
  };

  const onSelectHandler = (setState) => {
    return (value) => {
      console.log("onSelect", value);
      setState(value);
    };
  };

  async function createScheduler() {
    setLoading(true);
    const schedulerRes = await Api.post("scheduler/create", schedulingDataObj);
    console.log("schedulerRes", schedulerRes);
    if (typeof setScheduler === "function" && schedulerRes?.data?._id)
      setScheduler(schedulerRes?.data);
    setLoading(false);
  }

  async function updateSchdeuler() {
    setLoading(true);
    const schedulerRes = await Api.post("scheduler/update", {
      ...schedulingDataObj,
      _id: schedulerProp?._id,
    });
    console.log("schedulerRes Updated", schedulerRes);
    if (typeof setScheduler === "function" && schedulerRes?.data?._id)
      setScheduler(schedulerRes?.data);
    setLoading(false);
  }

  const handleSublmit = createByDefault ? updateSchdeuler : createScheduler;

  return (
    <Paper className={mainPaperCont}>
      <div className={classes.heading}>
        <div className={classes.chartAccountTitle}>
          <span style={{ marginRight: "10px" }}>
            <EventAvailableIcon
              style={{ color: "#4CACEF", fontSize: "30px", marginTop: "6px" }}
            />
          </span>
          Scheduling
        </div>
      </div>
      <div className={intervalCont}>
        <div>
          <div style={{ marginBottom: "20px" }}>
            <MyAutocomplete
              isSmall={false}
              value={scheduleValue}
              text={textSchedule}
              setText={setTextSchedule}
              placeholder={"Type"}
              results={schedules}
              getOptionLabel={getOptionLabelSimple}
              onSelect={onSelectHandler(setScheduleValue)}
              label={"Schedule"}
              setWidth={"250px"}
              setMarginLeft={"0px"}
            />
          </div>
          <div className={topScheduling}>
            <div className={autoCompleteCont150}>
              <div className={autoCompleteCont150}>
                <MyAutocomplete
                  isSmall={false}
                  value={intervalTypesValue}
                  text={textIntervalTypes}
                  setText={setTextIntervalTypes}
                  label={"Interval Type"}
                  results={intervalTypes}
                  getOptionLabel={getOptionLabelSimple}
                  onSelect={onIntervalTypeSelect}
                  setWidth={"95%"}
                />
              </div>
            </div>
            {intervalTypesValue === "Daily" ? (
              <>
                {" "}
                <span className={marginText}>every</span>
                <input
                  type="text"
                  className={InputBox}
                  value={afterXDays}
                  onChange={async (event) => {
                    const days = event.target.value;
                    setAfterXDays(days);
                  }}
                />
                <span className={marginText}>day(s)</span>
              </>
            ) : null}
            {intervalTypesValue === "Weekly" ? (
              <div className={topScheduling}>
                <span className={marginText}>every</span>
                <input
                  type="text"
                  className={InputBox}
                  value={afterXWeeks}
                  onChange={async (event) => {
                    const weeks = event.target.value;
                    setAfterXWeeks(weeks);
                  }}
                />
                <span className={marginText}>week(s) on</span>
                <div className={autoCompleteCont150}>
                  <MyAutocomplete
                    isSmall={false}
                    value={dayOfWeekValue}
                    text={textDaysOfWeek}
                    setText={setTextDaysOfWeek}
                    label={"Days Of Week"}
                    results={daysOfWeek}
                    getOptionLabel={getOptionLabelSimple}
                    // onSelect={onDaysOfWeekSelect}
                    onSelect={onSelectHandler(setDayOfWeekValue)}
                    setWidth={"95%"}
                  />
                </div>
              </div>
            ) : null}
            {intervalTypesValue === "Monthly" ? (
              <div className={topScheduling}>
                <span className={marginText}>on</span>
                <div className={autoCompleteCont140}>
                  <MyAutocomplete
                    isSmall={false}
                    value={daysValue}
                    text={textDays}
                    setText={setTextDays}
                    label={"Days"}
                    results={days}
                    getOptionLabel={getOptionLabelSimple}
                    onSelect={onDaysSelect}
                    setWidth={"95%"}
                  />
                </div>
                {daysValue === "Day" && intervalTypesValue === "Monthly" ? (
                  <div className={topScheduling}>
                    <div className={autoCompleteCont100}>
                      <MyAutocomplete
                        isSmall={false}
                        value={daysMonthValue}
                        text={textDaysMonth}
                        setText={setTextDaysMonth}
                        label={"Days Of Month"}
                        results={daysMonth}
                        getOptionLabel={getOptionLabelSimple}
                        // onSelect={onDaysMonthSelect}
                        onSelect={onSelectHandler(setDaysMonthValue)}
                        setWidth={"95%"}
                      />
                    </div>
                    <span className={marginText}>of every</span>
                    <input
                      type="text"
                      className={InputBox}
                      value={afterXMonth}
                      onChange={async (event) => {
                        const months = event.target.value;
                        setAfterXMonth(months);
                      }}
                    />
                    <span className={marginText} style={{ marginLeft: "0px" }}>
                      months
                    </span>
                  </div>
                ) : (
                  <>
                    {(daysValue === "First" ||
                      daysValue === "Second" ||
                      daysValue === "Third" ||
                      daysValue === "Fourth" ||
                      daysValue === "Last") &&
                      intervalTypesValue === "Monthly" ? (
                      <div className={topScheduling}>
                        <div className={autoCompleteCont150}>
                          <MyAutocomplete
                            isSmall={false}
                            value={dayOfWeekValue}
                            text={textDaysOfWeek}
                            setText={setTextDaysOfWeek}
                            label={"Days Of Week"}
                            results={daysOfWeek}
                            getOptionLabel={getOptionLabelSimple}
                            // onSelect={onDaysOfWeekSelect}
                            onSelect={onSelectHandler(setDayOfWeekValue)}
                            setWidth={"95%"}
                          />
                        </div>
                        <span className={marginText}>of every</span>
                        <input
                          type="text"
                          className={InputBox}
                          value={afterXMonth}
                          onChange={async (event) => {
                            const months = event.target.value;
                            setAfterXMonth(months);
                          }}
                        />
                        <span
                          className={marginText}
                          style={{ marginLeft: "0px" }}
                        >
                          months
                        </span>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}
            {intervalTypesValue === "Yearly" ? (
              <div className={topScheduling}>
                <span className={marginText}>every</span>
                <div className={autoCompleteCont150}>
                  <MyAutocomplete
                    isSmall={false}
                    value={monthValue}
                    text={textMonth}
                    setText={setTextMonth}
                    label={"Month"}
                    results={month}
                    getOptionLabel={getOptionLabelSimple}
                    // onSelect={onMonthSelect}
                    onSelect={onSelectHandler(setMonthValue)}
                    setWidth={"95%"}
                  />
                </div>
                <div className={autoCompleteCont100}>
                  <MyAutocomplete
                    isSmall={false}
                    value={daysMonthValue}
                    text={textDaysMonth}
                    setText={setTextDaysMonth}
                    label={"Days of Month"}
                    results={daysMonth}
                    getOptionLabel={getOptionLabelSimple}
                    // onSelect={onDaysMonthSelect}
                    onSelect={onSelectHandler(setDaysMonthValue)}
                    setWidth={"95%"}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className={IntervalSubCont2}>
          <TextField
            id="datetime-local"
            label="Start Date"
            type="datetime-local"
            // defaultValue="2017-05-24T10:30"
            value={startDate}
            className={datePicker}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={async (event) => {
              console.log("date is: ", event.target.value);
              setStartDate(event.target.value);
            }}
          />
          <div className={autoCompleteCont130}>
            <MyAutocomplete
              isSmall={false}
              value={endTypeValue}
              text={textEndType}
              setText={setTextEndType}
              label={"End"}
              results={endDateType}
              getOptionLabel={getOptionLabelSimple}
              //   onSelect={onEndTypeSelect}
              onSelect={onSelectHandler(setEndTypeValue)}
              setWidth={"95%"}
            />
          </div>
          {endTypeValue === "By" ? (
            <div style={{ marginLeft: "30px" }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  value={endDate}
                  className={datePicker}
                  margin="normal"
                  id="due-date-picker"
                  label="End Date"
                  format="MM/dd/yyyy"
                  onChange={async (date) => {
                    setEndDate(date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>{" "}
            </div>
          ) : null}
          {endTypeValue === "After" ? (
            <div>
              {" "}
              <input
                type="text"
                className={classes.InputBoxEndDays}
                value={numberOfOccurrences}
                onChange={async (event) => {
                  const occurrences = event.target.value;
                  setNumberOfOccurrences(occurrences);
                }}
              />{" "}
              occurrences
            </div>
          ) : null}
        </div>
        <div
          className={topScheduling}
          style={{
            color: "green",
            fontSize: "18px",
            marginTop: "20px",
          }}
        >
          Expected Next Dates
          <div className={autoCompleteCont250}>
            <Autocomplete
              id={"Next Date"}
              value={formatDate(nextDateFE)}
              size="small"
              options={nextArr}
              inputValue={textNextDate}
              getOptionLabel={formatDate}
              getOptionSelected={(option) => {
                return option == nextDateFE;
              }}
              style={{
                color: "green",
                width: "100%",
                marginLeft: "18px",
                marginTop: "5px",
              }}
              onChange={(event, value) => {
                // console.log("onChange", value);
                setNextDateFE(value);
              }}
              renderInput={(params) => (
                <TextField {...params} label={"Next Date"} variant="outlined" />
              )}
              onInputChange={(event, newValue) => {
                setTextNextDate(newValue);
              }}
            />
          </div>
        </div>
        <div className={classes.submitBox}>
          <FormControlLabel
            control={
              <Switch
                checked={recurring}
                onChange={(event) => setRecurring(event.target.checked)}
                name="recurring"
                color="primary"
              />
            }
            label="Recurring"
            labelPlacement="start"
          />
          <FormControlLabel
            value="end"
            control={
              <Switch
                checked={scheduled}
                onChange={(event) => setScheduled(event.target.checked)}
                color="primary"
              />
            }
            label="Want to turn on?"
            labelPlacement="start"
          />
          <LoadingButton
            loading={loading}
            onClick={handleSublmit}
            text={createByDefault ? "Update" : "Submit"}
          />
        </div>
      </div>
    </Paper>
  );
}
