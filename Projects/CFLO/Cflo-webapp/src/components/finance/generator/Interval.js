import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import Paper from "@material-ui/core/Paper";
import MyAutocomplete from "../../styled/CommonComponents/MyAutoComplete";
import {
  days,
  daysMonth,
  daysOfWeek,
  intervalTypes,
  month,
  schedules,
  endDateType,
} from "./IntervalData.js";
import { findNextDate } from "./getNextDate.js";

const useStyles = makeStyles((theme) => ({
  mainPaperCont: {
    padding: "10px 0px",
    marginTop: "30px",
    width: "98%",
    [theme.breakpoints.down("md")]: {
      marginTop: "60px",
    },
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
    width: 150,
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
  autoCompleteCont170: {
    width: "170px",
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

export default function Interval(props) {
  const { scheduleValue, updateTxTemplate, txTemplate, setTxTemplate } = props;
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
    autoCompleteCont170,
    mainPaperCont,
  } = classes;

  const DateNow = new Date();

  const [textIntervalTypes, setTextIntervalTypes] = useState("");
  const [textDays, setTextDays] = useState("");
  const [textDaysMonth, setTextDaysMonth] = useState("");
  const [textDaysOfWeek, setTextDaysOfWeek] = useState("");
  const [textMonth, setTextMonth] = useState("");
  const [textEndType, setTextEndType] = useState("");

  const oldIntervalType =
    txTemplate?.schedulingData?.intervalType || intervalTypes[2];
  let checkedIntervalType;
  if (
    oldIntervalType === "MonthlyByDate" ||
    oldIntervalType === "DayOfWeekOfMonth"
  ) {
    checkedIntervalType = "Monthly";
  } else {
    checkedIntervalType = oldIntervalType;
  }
  const [intervalTypesValue, setIntervalTypesValue] = useState(
    checkedIntervalType
  );

  const oldIntervalTypeString =
    txTemplate?.schedulingData?.intervalType || "MonthlyByDate";
  const [intervalType, setIntervalType] = useState(oldIntervalTypeString);

  const oldDaysValue = txTemplate?.schedulingData?.dayOrWeekOfMonth || days[0];
  const [daysValue, setDaysValue] = useState(oldDaysValue);

  const oldAfterXDays = txTemplate?.schedulingData?.afterXDays || "0";
  const [afterXDays, setAfterXDays] = useState(oldAfterXDays);

  const oldAfterXWeeks = txTemplate?.schedulingData?.afterXWeeks || "0";
  const [afterXWeeks, setAfterXWeeks] = useState(oldAfterXWeeks);

  const oldDayOfWeek = txTemplate?.schedulingData?.dayOfWeek || "Monday";
  const [dayOfWeekValue, setDayOfWeekValue] = useState(oldDayOfWeek);

  const oldDayOfMonth = txTemplate?.schedulingData?.dayOfMonth || daysMonth[0];
  const [daysMonthValue, setDaysMonthValue] = useState(oldDayOfMonth);

  const oldMonthValue = txTemplate?.schedulingData?.month || month[0];
  const [monthValue, setMonthValue] = useState(oldMonthValue);

  const oldAfterXMonths = txTemplate?.schedulingData?.afterXMonth || "0";
  const [afterXMonth, setAfterXMonth] = useState(oldAfterXMonths);

  const oldStartDate = txTemplate?.schedulingData?.startDate || DateNow;
  const [startDate, setStartDate] = useState(oldStartDate);

  const oldEndDate = txTemplate?.schedulingData?.stopDate || DateNow;
  const [endDate, setEndDate] = useState(oldEndDate);

  const oldNumberOfOccurrences =
    txTemplate?.schedulingData?.NumberOfOccurrences || "0";
  const [numberOfOccurrences, setNumberOfOccurrences] = useState(
    oldNumberOfOccurrences
  );

  const oldEndType = txTemplate?.schedulingData?.endType || endDateType[0];
  const [endTypeValue, setEndTypeValue] = useState(oldEndType);

  const oldNextDate = txTemplate?.schedulingData?.nextDate || DateNow;
  const [nextDateFE, setNextDateFE] = useState(oldNextDate);

  const [textNextDate, setTextNextDate] = useState("");

  const [nextArr, setNextArr] = useState([]);

  const schedulingDataObj = {
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
    NumberOfOccurrences: numberOfOccurrences,
    endType: endTypeValue,
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

  const funGetNextDate = async () => {
    const nextDateArr = [];
    const newNextDate = findNextDate(schedulingDataObj, startDate);
    setNextDateFE(newNextDate);
    nextDateArr.push(newNextDate);
    const newNextDate2 = findNextDate(schedulingDataObj, newNextDate);
    nextDateArr.push(newNextDate2);
    const newNextDate3 = findNextDate(schedulingDataObj, newNextDate2);
    nextDateArr.push(newNextDate3);
    const newNextDate4 = findNextDate(schedulingDataObj, newNextDate3);
    nextDateArr.push(newNextDate4);
    const newNextDate5 = findNextDate(schedulingDataObj, newNextDate4);
    nextDateArr.push(newNextDate5);
    setNextArr(nextDateArr);
    console.log(nextDateArr);
  };

  const getOptionLabelSimple = (option) => {
    return option || " ";
  };

  const onIntervalTypeSelect = async (value) => {
    if (value === "Monthly" && daysValue === "Day") {
      setIntervalType("MonthlyByDate");
      await updateTxTemplate({
        _id: txTemplate?._id,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: "MonthlyByDate",
        },
      });

      const updatedTxTemplate = {
        ...txTemplate,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: "MonthlyByDate",
        },
      };
      setTxTemplate(updatedTxTemplate);
    } else if (value === "Monthly" && daysValue !== "Day") {
      setIntervalType("DayOfWeekOfMonth");
      await updateTxTemplate({
        _id: txTemplate?._id,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: "DayOfWeekOfMonth",
        },
      });

      const updatedTxTemplate = {
        ...txTemplate,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: "DayOfWeekOfMonth",
        },
      };
      setTxTemplate(updatedTxTemplate);
    } else {
      setIntervalType(value);
      await updateTxTemplate({
        _id: txTemplate?._id,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: value,
        },
      });

      const updatedTxTemplate = {
        ...txTemplate,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: value,
        },
      };
      setTxTemplate(updatedTxTemplate);
    }
    setIntervalTypesValue(value);
  };

  const onDaysSelect = async (value) => {
    if (value === "Day") {
      setIntervalType("MonthlyByDate");
      await updateTxTemplate({
        _id: txTemplate?._id,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: "MonthlyByDate",
          dayOrWeekOfMonth: value,
        },
      });

      const updatedTxTemplate = {
        ...txTemplate,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: "MonthlyByDate",
          dayOrWeekOfMonth: value,
        },
      };
      setTxTemplate(updatedTxTemplate);
    } else {
      setIntervalType("DayOfWeekOfMonth");
      await updateTxTemplate({
        _id: txTemplate?._id,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: "DayOfWeekOfMonth",
          dayOrWeekOfMonth: value,
        },
      });

      const updatedTxTemplate = {
        ...txTemplate,
        schedulingData: {
          ...schedulingDataObj,
          intervalType: "DayOfWeekOfMonth",
          dayOrWeekOfMonth: value,
        },
      };
      setTxTemplate(updatedTxTemplate);
    }
    setDaysValue(value);
  };

  const onDaysMonthSelect = async (value) => {
    console.log(value);
    await updateTxTemplate({
      _id: txTemplate?._id,
      schedulingData: {
        ...schedulingDataObj,
        dayOfMonth: value,
      },
    });

    const updatedTxTemplate = {
      ...txTemplate,
      schedulingData: {
        ...schedulingDataObj,
        dayOfMonth: value,
      },
    };
    setTxTemplate(updatedTxTemplate);
    setDaysMonthValue(value);
  };

  const onDaysOfWeekSelect = async (value) => {
    await updateTxTemplate({
      _id: txTemplate?._id,
      schedulingData: {
        ...schedulingDataObj,
        dayOfWeek: value,
      },
    });

    const updatedTxTemplate = {
      ...txTemplate,
      schedulingData: {
        ...schedulingDataObj,
        dayOfWeek: value,
      },
    };
    setTxTemplate(updatedTxTemplate);
    setDayOfWeekValue(value);
  };

  const onMonthSelect = async (value) => {
    await updateTxTemplate({
      _id: txTemplate?._id,
      schedulingData: {
        ...schedulingDataObj,
        month: value,
      },
    });

    const updatedTxTemplate = {
      ...txTemplate,
      schedulingData: {
        ...schedulingDataObj,
        month: value,
      },
    };
    setTxTemplate(updatedTxTemplate);
    setMonthValue(value);
  };
  const onEndTypeSelect = async (value) => {
    await updateTxTemplate({
      _id: txTemplate?._id,
      schedulingData: {
        ...schedulingDataObj,
        endType: value,
      },
    });

    const updatedTxTemplate = {
      ...txTemplate,
      schedulingData: {
        ...schedulingDataObj,
        endType: value,
      },
    };
    setTxTemplate(updatedTxTemplate);
    setEndTypeValue(value);
  };

  return (
    <div className={mainPaperCont}>
      {scheduleValue !== "Unschedule" ? (
        <div className={intervalCont}>
          <div>
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
                      await updateTxTemplate({
                        _id: txTemplate?._id,
                        schedulingData: {
                          ...schedulingDataObj,
                          afterXDays: days,
                        },
                      });

                      const updatedTxTemplate = {
                        ...txTemplate,
                        schedulingData: {
                          ...schedulingDataObj,
                          afterXDays: days,
                        },
                      };
                      setTxTemplate(updatedTxTemplate);
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
                      await updateTxTemplate({
                        _id: txTemplate?._id,
                        schedulingData: {
                          ...schedulingDataObj,
                          afterXWeeks: weeks,
                        },
                      });

                      const updatedTxTemplate = {
                        ...txTemplate,
                        schedulingData: {
                          ...schedulingDataObj,
                          afterXWeeks: weeks,
                        },
                      };
                      setTxTemplate(updatedTxTemplate);
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
                      onSelect={onDaysOfWeekSelect}
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
                          onSelect={onDaysMonthSelect}
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
                          await updateTxTemplate({
                            _id: txTemplate?._id,
                            schedulingData: {
                              ...schedulingDataObj,
                              afterXMonth: months,
                            },
                          });

                          const updatedTxTemplate = {
                            ...txTemplate,
                            schedulingData: {
                              ...schedulingDataObj,
                              afterXMonth: months,
                            },
                          };
                          setTxTemplate(updatedTxTemplate);
                        }}
                      />
                      <span
                        className={marginText}
                        style={{ marginLeft: "0px" }}
                      >
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
                              onSelect={onDaysOfWeekSelect}
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
                              await updateTxTemplate({
                                _id: txTemplate?._id,
                                schedulingData: {
                                  ...schedulingDataObj,
                                  afterXMonth: months,
                                },
                              });

                              const updatedTxTemplate = {
                                ...txTemplate,
                                schedulingData: {
                                  ...schedulingDataObj,
                                  afterXMonth: months,
                                },
                              };
                              setTxTemplate(updatedTxTemplate);
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
                      onSelect={onMonthSelect}
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
                      onSelect={onDaysMonthSelect}
                      setWidth={"95%"}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className={IntervalSubCont2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                value={startDate}
                className={datePicker}
                margin="normal"
                id="due-date-picker"
                label="Start Date"
                format="MM/dd/yyyy"
                onChange={async (date) => {
                  setStartDate(date);
                  await updateTxTemplate({
                    _id: txTemplate?._id,
                    schedulingData: {
                      ...schedulingDataObj,
                      startDate: date,
                    },
                  });

                  const updatedTxTemplate = {
                    ...txTemplate,
                    schedulingData: {
                      ...schedulingDataObj,
                      startDate: date,
                    },
                  };
                  setTxTemplate(updatedTxTemplate);
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <div className={autoCompleteCont130}>
              <MyAutocomplete
                isSmall={false}
                value={endTypeValue}
                text={textEndType}
                setText={setTextEndType}
                label={"End"}
                results={endDateType}
                getOptionLabel={getOptionLabelSimple}
                onSelect={onEndTypeSelect}
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
                      await updateTxTemplate({
                        _id: txTemplate?._id,
                        schedulingData: {
                          ...schedulingDataObj,
                          stopDate: date,
                        },
                      });

                      const updatedTxTemplate = {
                        ...txTemplate,
                        schedulingData: {
                          ...schedulingDataObj,
                          stopDate: date,
                        },
                      };
                      setTxTemplate(updatedTxTemplate);
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
                    await updateTxTemplate({
                      _id: txTemplate?._id,
                      schedulingData: {
                        ...schedulingDataObj,
                        NumberOfOccurrences: occurrences,
                      },
                    });

                    const updatedTxTemplate = {
                      ...txTemplate,
                      schedulingData: {
                        ...schedulingDataObj,
                        NumberOfOccurrences: occurrences,
                      },
                    };
                    setTxTemplate(updatedTxTemplate);
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
            <div className={autoCompleteCont170}>
              <Autocomplete
                id={"Next Date"}
                value={nextDateFE}
                size="small"
                options={nextArr}
                inputValue={textNextDate}
                getOptionLabel={getOptionLabelSimple}
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
                  setNextDateFE(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Next Date"}
                    variant="outlined"
                  />
                )}
                onInputChange={(event, newValue) => {
                  setTextNextDate(newValue);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
