const moment = require("moment");
const {getMonthNumber, getDayNumber, getWeekNumber} = require("../helpers/calculationHelper.js");
const Scheduler = require("../models/scheduler.model.js");

const findNextDateGenerator = (txTempObj, txStartDate) => {
    let nextDate = "";
    const txTempType = txTempObj?.schedulingData?.intervalType;

    const MyFormat = "MM/DD/YYYY";

    switch (txTempType) {
        case "MonthlyByDate":
            const months = parseInt(txTempObj?.schedulingData?.afterXMonth);
            const dayofM = txTempObj?.schedulingData?.dayOfMonth;
            const monthStr = moment(txStartDate, MyFormat).add(months, "months").format("M");
            const yearStr = moment(txStartDate, MyFormat).add(months, "months").format("YYYY");
            const dayStr = dayofM.slice(0, -2);
            nextDate = monthStr + "/" + dayStr + "/" + yearStr;
            break;
        case "DayOfWeekOfMonth":
            //month's nth monday
            const givenMonth = parseInt(txTempObj?.schedulingData?.afterXMonth);
            const dateAfterXMonths = moment(txStartDate, MyFormat).add(givenMonth, "months");
            const dateAfterXMonthsD = moment(txStartDate, MyFormat).add(givenMonth, "months").format("D");

            console.log(moment(dateAfterXMonths).format());

            const firstDayAfterXMonth = moment(dateAfterXMonths).subtract(dateAfterXMonthsD, "days");
            let dateAfterXWeeksDM;
            console.log(moment(firstDayAfterXMonth).format());
            const weekDM = txTempObj?.schedulingData?.dayOrWeekOfMonth;
            if (weekDM === "First") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(1, "days");
            } else if (weekDM === "Second") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(8, "days");
            } else if (weekDM === "Third") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(15, "days");
            } else if (weekDM === "Fourth") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(22, "days");
            } else if (weekDM === "Last") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(29, "days");
            }

            const dayStrWDM = moment(dateAfterXWeeksDM).format("dddd");

            let givenDayNumDM = getDayNumber(txTempObj?.schedulingData?.dayOfWeek);
            let afterXWeekDayNumDM = getDayNumber(dayStrWDM);

            let totalDayDM = 0;
            let nextDateMDM, nextDateDDM, nextDateYDM;
            if (givenDayNumDM === afterXWeekDayNumDM) {
                totalDayDM = 0;
                nextDateMDM = moment(dateAfterXWeeksDM).format("M");
                nextDateDDM = moment(dateAfterXWeeksDM).format("D");
                nextDateYDM = moment(dateAfterXWeeksDM).format("YYYY");
            } else if (afterXWeekDayNumDM > givenDayNumDM) {
                //substract
                totalDayDM = afterXWeekDayNumDM - givenDayNumDM;
                nextDateMDM = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days").format("M");
                nextDateDDM = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days").format("D");
                nextDateYDM = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days").format("YYYY");
                console.log("sub = " + nextDateDDM);
            } else {
                //adition
                totalDayDM = givenDayNumDM - afterXWeekDayNumDM;
                nextDateMDM = moment(dateAfterXWeeksDM).add(totalDayDM, "days").format("M");
                nextDateDDM = moment(dateAfterXWeeksDM).add(totalDayDM, "days").format("D");
                nextDateYDM = moment(dateAfterXWeeksDM).add(totalDayDM, "days").format("YYYY");
            }
            nextDate = nextDateMDM + "/" + nextDateDDM + "/" + nextDateYDM;
            console.log(nextDate);
            break;
        case "Yearly":
            const dayofMY = txTempObj?.schedulingData?.dayOfMonth;
            const dayStrY = dayofMY.slice(0, -2);
            const yearStrY = moment(txStartDate, MyFormat).add(1, "years").format("YYYY");
            const monthText = txTempObj?.schedulingData?.month;
            const monthNum = getMonthNumber(monthText);
            nextDate = monthNum + "/" + dayStrY + "/" + yearStrY;
            break;
        case "Weekly":
            const weekNum = parseInt(txTempObj?.schedulingData?.afterXWeeks);
            let dateAfterXWeeks = moment(txStartDate, MyFormat).add(weekNum, "weeks");
            const dayStrW = moment(txStartDate, MyFormat).add(weekNum, "weeks").format("dddd");
            let givenDayNum = getDayNumber(txTempObj?.schedulingData?.dayOfWeek);
            let afterXWeekDayNum = getDayNumber(dayStrW);
            let totalDay = 0;
            if (givenDayNum === afterXWeekDayNum) {
                totalDay = 0;
            } else if (afterXWeekDayNum > givenDayNum) {
                totalDay = 7 - afterXWeekDayNum + givenDayNum;
            } else {
                totalDay = givenDayNum - afterXWeekDayNum;
            }
            const nextDateM = moment(dateAfterXWeeks).add(totalDay, "days").format("M");
            const nextDateD = moment(dateAfterXWeeks).add(totalDay, "days").format("D");
            const nextDateY = moment(dateAfterXWeeks).add(totalDay, "days").format("YYYY");
            nextDate = nextDateM + "/" + nextDateD + "/" + nextDateY;
            break;
        case "Daily":
            const dayNum = parseInt(txTempObj?.schedulingData?.afterXDays);
            const monthStrD = moment(txStartDate, MyFormat).add(dayNum, "days").format("M");
            const dayStrD = moment(txStartDate, MyFormat).add(dayNum, "days").format("D");
            const yearStrD = moment(txStartDate, MyFormat).add(dayNum, "days").format("YYYY");
            nextDate = monthStrD + "/" + dayStrD + "/" + yearStrD;
            break;
    }

    return nextDate;
};

const findNextDateUpdate = (txTempObj, txStartDate) => {
    let nextDate = "";
    const txTempType = txTempObj?.schedulingData?.intervalType;

    switch (txTempType) {
        case "MonthlyByDate":
            const months = parseInt(txTempObj?.schedulingData?.afterXMonth);
            const dayofM = txTempObj?.schedulingData?.dayOfMonth;
            const monthStr = moment(txStartDate).add(months, "months").format("M");
            const yearStr = moment(txStartDate).add(months, "months").format("YYYY");
            const dayStr = dayofM.slice(0, -2);
            nextDate = monthStr + "/" + dayStr + "/" + yearStr;
            break;
        case "DayOfWeekOfMonth":
            const givenMonth = parseInt(txTempObj?.schedulingData?.afterXMonth);
            const dateAfterXMonths = moment(txStartDate).add(givenMonth, "months");
            const dateAfterXMonthsD = moment(txStartDate).add(givenMonth, "months").format("D");

            console.log(moment(dateAfterXMonths).format());

            const firstDayAfterXMonth = moment(dateAfterXMonths).subtract(dateAfterXMonthsD, "days");
            let dateAfterXWeeksDM;
            console.log(moment(firstDayAfterXMonth).format());
            const weekDM = txTempObj?.schedulingData?.dayOrWeekOfMonth;
            if (weekDM === "First") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(1, "days");
            } else if (weekDM === "Second") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(8, "days");
            } else if (weekDM === "Third") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(15, "days");
            } else if (weekDM === "Fourth") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(22, "days");
            } else if (weekDM === "Last") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(29, "days");
            }

            const dayStrWDM = moment(dateAfterXWeeksDM).format("dddd");

            let givenDayNumDM = getDayNumber(txTempObj?.schedulingData?.dayOfWeek);
            let afterXWeekDayNumDM = getDayNumber(dayStrWDM);

            let totalDayDM = 0;
            let nextDateMDM, nextDateDDM, nextDateYDM;
            if (givenDayNumDM === afterXWeekDayNumDM) {
                totalDayDM = 0;
                nextDateMDM = moment(dateAfterXWeeksDM).format("M");
                nextDateDDM = moment(dateAfterXWeeksDM).format("D");
                nextDateYDM = moment(dateAfterXWeeksDM).format("YYYY");
            } else if (afterXWeekDayNumDM > givenDayNumDM) {
                //substract
                totalDayDM = afterXWeekDayNumDM - givenDayNumDM;
                nextDateMDM = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days").format("M");
                nextDateDDM = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days").format("D");
                nextDateYDM = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days").format("YYYY");
                console.log("sub = " + nextDateDDM);
            } else {
                //adition
                totalDayDM = givenDayNumDM - afterXWeekDayNumDM;
                nextDateMDM = moment(dateAfterXWeeksDM).add(totalDayDM, "days").format("M");
                nextDateDDM = moment(dateAfterXWeeksDM).add(totalDayDM, "days").format("D");
                nextDateYDM = moment(dateAfterXWeeksDM).add(totalDayDM, "days").format("YYYY");
            }
            nextDate = nextDateMDM + "/" + nextDateDDM + "/" + nextDateYDM;
            console.log(nextDate);
            break;
        case "Yearly":
            const dayofMY = txTempObj?.schedulingData?.dayOfMonth;
            const dayStrY = dayofMY.slice(0, -2);
            const yearStrY = moment(txStartDate).add(1, "years").format("YYYY");
            const monthText = txTempObj?.schedulingData?.month;
            const monthNum = getMonthNumber(monthText);
            nextDate = monthNum + "/" + dayStrY + "/" + yearStrY;
            break;
        case "Weekly":
            const weekNum = parseInt(txTempObj?.schedulingData?.afterXWeeks);
            let dateAfterXWeeks = moment(txStartDate).add(weekNum, "weeks");
            const dayStrW = moment(txStartDate).add(weekNum, "weeks").format("dddd");
            let givenDayNum = getDayNumber(txTempObj?.schedulingData?.dayOfWeek);
            let afterXWeekDayNum = getDayNumber(dayStrW);
            let totalDay = 0;
            if (givenDayNum === afterXWeekDayNum) {
                totalDay = 0;
            } else if (afterXWeekDayNum > givenDayNum) {
                totalDay = 7 - afterXWeekDayNum + givenDayNum;
            } else {
                totalDay = givenDayNum - afterXWeekDayNum;
            }
            const nextDateM = moment(dateAfterXWeeks).add(totalDay, "days").format("M");
            const nextDateD = moment(dateAfterXWeeks).add(totalDay, "days").format("D");
            const nextDateY = moment(dateAfterXWeeks).add(totalDay, "days").format("YYYY");
            nextDate = nextDateM + "/" + nextDateD + "/" + nextDateY;
            break;
        case "Daily":
            const dayNum = parseInt(txTempObj?.schedulingData?.afterXDays);
            const monthStrD = moment(txStartDate).add(dayNum, "days").format("M");
            const dayStrD = moment(txStartDate).add(dayNum, "days").format("D");
            const yearStrD = moment(txStartDate).add(dayNum, "days").format("YYYY");
            nextDate = monthStrD + "/" + dayStrD + "/" + yearStrD;
            break;
    }

    return nextDate;
};

const findScheduleNextDateUpdate = async scheduleId => {
    let nextDate = "";
    const schedule = await Scheduler.findById(scheduleId);
    const txTempType = schedule?.intervalType;
    const startDate = schedule?.nextDate;
    let newNextDate = startDate;

    switch (txTempType) {
        case "MonthlyByDate":
            const months = parseInt(schedule?.afterXMonth);
            const dayofM = schedule?.dayOfMonth;
            const monthStr = moment(startDate).add(months, "months").format("M");
            const yearStr = moment(startDate).add(months, "months").format("YYYY");
            const dayStr = dayofM.slice(0, -2);
            newNextDate = moment(startDate).add(months, "months");

            nextDate = monthStr + "/" + dayStr + "/" + yearStr;
            // nextDate = yearStr + "/" + monthStr + "/" + dayStr;
            break;
        case "DayOfWeekOfMonth":
            const givenMonth = parseInt(schedule?.afterXMonth);
            const dateAfterXMonths = moment(startDate).add(givenMonth, "months");
            const dateAfterXMonthsD = moment(startDate).add(givenMonth, "months").format("D");

            console.log(moment(dateAfterXMonths).format());

            const firstDayAfterXMonth = moment(dateAfterXMonths).subtract(dateAfterXMonthsD, "days");
            let dateAfterXWeeksDM;
            console.log(moment(firstDayAfterXMonth).format());
            const weekDM = schedule?.dayOrWeekOfMonth;
            if (weekDM === "First") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(1, "days");
            } else if (weekDM === "Second") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(8, "days");
            } else if (weekDM === "Third") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(15, "days");
            } else if (weekDM === "Fourth") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(22, "days");
            } else if (weekDM === "Last") {
                dateAfterXWeeksDM = moment(firstDayAfterXMonth).add(29, "days");
            }

            const dayStrWDM = moment(dateAfterXWeeksDM).format("dddd");

            let givenDayNumDM = getDayNumber(schedule?.dayOfWeek);
            let afterXWeekDayNumDM = getDayNumber(dayStrWDM);

            let totalDayDM = 0;
            let nextDateMDM, nextDateDDM, nextDateYDM;
            if (givenDayNumDM === afterXWeekDayNumDM) {
                totalDayDM = 0;
                nextDateMDM = moment(dateAfterXWeeksDM).format("M");
                nextDateDDM = moment(dateAfterXWeeksDM).format("D");
                nextDateYDM = moment(dateAfterXWeeksDM).format("YYYY");
                newNextDate = moment(dateAfterXWeeksDM);
            } else if (afterXWeekDayNumDM > givenDayNumDM) {
                //substract
                totalDayDM = afterXWeekDayNumDM - givenDayNumDM;
                nextDateMDM = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days").format("M");
                nextDateDDM = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days").format("D");
                nextDateYDM = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days").format("YYYY");
                newNextDate = moment(dateAfterXWeeksDM).subtract(totalDayDM, "days");
                console.log("sub = " + nextDateDDM);
            } else {
                //adition
                totalDayDM = givenDayNumDM - afterXWeekDayNumDM;
                nextDateMDM = moment(dateAfterXWeeksDM).add(totalDayDM, "days").format("M");
                nextDateDDM = moment(dateAfterXWeeksDM).add(totalDayDM, "days").format("D");
                nextDateYDM = moment(dateAfterXWeeksDM).add(totalDayDM, "days").format("YYYY");
                newNextDate = moment(dateAfterXWeeksDM).add(totalDayDM, "days");
            }
            nextDate = nextDateMDM + "/" + nextDateDDM + "/" + nextDateYDM;
            // nextDate = nextDateYDM + "/" + nextDateMDM + "/" + nextDateDDM;
            // console.log(nextDate);
            break;
        case "Yearly":
            const dayofMY = schedule?.dayOfMonth;
            const dayStrY = dayofMY.slice(0, -2);
            const yearStrY = moment(startDate).add(1, "years").format("YYYY");
            const monthText = schedule?.month;
            const monthNum = getMonthNumber(monthText);
            newNextDate = moment(startDate).add(1, "years");

            // nextDate = monthNum + "/" + dayStrY + "/" + yearStrY;
            // nextDate = yearStrY + "/" + monthNum + "/" + dayStrY;
            break;
        case "Weekly":
            const weekNum = parseInt(schedule?.afterXWeeks);
            let dateAfterXWeeks = moment(startDate).add(weekNum, "weeks");
            const dayStrW = moment(startDate).add(weekNum, "weeks").format("dddd");
            let givenDayNum = getDayNumber(schedule?.dayOfWeek);
            let afterXWeekDayNum = getDayNumber(dayStrW);
            let totalDay = 0;
            if (givenDayNum === afterXWeekDayNum) {
                totalDay = 0;
            } else if (afterXWeekDayNum > givenDayNum) {
                totalDay = 7 - afterXWeekDayNum + givenDayNum;
            } else {
                totalDay = givenDayNum - afterXWeekDayNum;
            }
            const nextDateM = moment(dateAfterXWeeks).add(totalDay, "days").format("M");
            const nextDateD = moment(dateAfterXWeeks).add(totalDay, "days").format("D");
            const nextDateY = moment(dateAfterXWeeks).add(totalDay, "days").format("YYYY");
            newNextDate = moment(dateAfterXWeeks).add(totalDay, "days");

            // nextDate = nextDateM + "/" + nextDateD + "/" + nextDateY;
            // nextDate = nextDateY + "/" + nextDateM + "/" + nextDateD;
            break;
        case "Daily":
            const dayNum = parseInt(schedule?.afterXDays);
            const monthStrD = moment(startDate).add(dayNum, "days").format("M");
            const dayStrD = moment(startDate).add(dayNum, "days").format("D");
            const yearStrD = moment(startDate).add(dayNum, "days").format("YYYY");
            newNextDate = moment(startDate).add(dayNum, "days");
            nextDate = monthStrD + "/" + dayStrD + "/" + yearStrD;
            // nextDate = yearStrD + "/" + monthStrD + "/" + dayStrD;
            break;
        case "Minute":
            newNextDate = moment(newNextDate).add(1, "minutes");
    }
    // console.log({nextDate, myMoment: moment(nextDate, "MM/DD/YYYY")});
    return newNextDate.toISOString();
};

module.exports = {
    findNextDateUpdate,
    findNextDateGenerator,
    findScheduleNextDateUpdate,
};
