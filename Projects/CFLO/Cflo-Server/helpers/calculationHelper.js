const getMonthNumber = (monthText)=>{
    let monthNum = 1;
     switch(monthText) {
        case "January":
          monthNum = 1;
          break;
        case "February":
          monthNum = 2;
          break;
        case "March":
          monthNum = 3;
          break;
        case "April":
          monthNum = 4;
          break;
        case "May":
          monthNum = 5;
          break;
        case "June":
          monthNum = 6;
          break;
        case "July":
          monthNum = 7;
          break;
        case "August":
          monthNum = 8;
          break;
        case "September":
          monthNum = 9;
          break;
        case "October":
          monthNum = 10;
          break;
        case "November":
          monthNum = 11;
          break;
        case "December":
          monthNum = 12;
          break;
      }
   return(monthNum)
}

const getDayNumber = (dayText)=>{
    let dayNum = 1;
     switch(dayText) {
        case "Sunday":
            dayNum = 1;
          break;
        case "Monday":
            dayNum = 2;
          break;
        case "Tuesday":
            dayNum = 3;
          break;
        case "Wednesday":
            dayNum = 4;
          break;
        case "Thursday":
            dayNum = 5;
          break;
        case "Friday":
            dayNum = 6;
          break;
        case "Saturday":
            dayNum = 7;
          break;
      }
   return(dayNum)
}


const getWeekNumber = (weekText)=>{
    let weekNum = 1;
     switch(weekText) {
        case "First":
            weekNum = 1;
          break;
        case "Second":
            weekNum = 2;
          break;
        case "Third":
            weekNum = 3;
          break;
        case "Fourth":
            weekNum = 4;
          break;
        case "Last":
            weekNum = 5;
          break;
      }
   return(weekNum)
}




module.exports = {
    getMonthNumber,
    getDayNumber,
    getWeekNumber
};