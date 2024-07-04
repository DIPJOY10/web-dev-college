import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, useMediaQuery, useTheme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import InfoLabel from "./InputComponents/InfoLabel";
import glossaryDict from "./Glossary.Obj.js";
import './tableStyle.css'


const useStyles = makeStyles({
  parent_container: {
    marginBottom: "30px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    padding: "0px 0px 25px 10px",
    borderRadius: "18px"
  },
  label_text: {
    display: "flex",
    alignItems: "center",
  }
});

export default function ProjectionTable({
  reportType, tablePrefix, tableHead,
  tableData, tableSuffix, iterations,
  isNew = false, isOnlyExpense = false,
  isNewTableSuffix = false, pageHight,
  indexArr, currentReport
}) {
  const classes = useStyles();
  const theme = useTheme();

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [rows, setRows] = useState([]);
  const [itr, setItr] = useState([]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    let grid = [];

    if (isNew) {
      Object.keys(tableData).forEach((key) => {

        let temp = [key];
        for (let i = 0; i < iterations; i++) {
          if (tableData[key][i] == "-") {
            temp.push("-");
          } else {
            temp.push(tablePrefix[key] + numberWithCommas(parseFloat(tableData[key][i]).toFixed(2)) + tableSuffix);
          }
        }
        grid.push(temp);
      });
    } else if (isNewTableSuffix) {

      Object.keys(tableData).forEach((key) => {

        let temp = [key];
        for (let i = 0; i < iterations; i++) {
          if (tableData[key][i] == "-") {
            temp.push("-");
          } else {
            temp.push(tablePrefix + numberWithCommas(parseFloat(tableData[key][i]).toFixed(2)) + tableSuffix[key]);
          }
        }
        grid.push(temp);
      });

    } else if (isOnlyExpense) {
      Object.keys(tableData).forEach((key) => {
        let temp = [key];
        for (let i = 0; i < iterations; i++) {
          if (tableData[key][i] == "-") {
            temp.push("-");
          } else {
            if (key === "Operating Expenses") {
              temp.push("=" + "\xa0\xa0\xa0" + "$" + numberWithCommas(parseFloat(tableData[key][i]).toFixed(2)) + tableSuffix);
            } else {
              temp.push("+" + "\xa0\xa0\xa0" + "$" + numberWithCommas(parseFloat(tableData[key][i]).toFixed(2)) + tableSuffix);
            }
          }
        }
        grid.push(temp);
      });
    } else {
      Object.keys(tableData).forEach((key) => {

        let temp = [key];
        for (let i = 0; i < iterations; i++) {
          if (tableData[key][i] == "-") {
            temp.push("-");
          } else {
            temp.push(tablePrefix + numberWithCommas(parseFloat(tableData[key][i]).toFixed(2)) + tableSuffix);
          }
        }
        grid.push(temp);
      });
    }

    setRows(grid);
    let intervals = [];
    for (let i = 1; i <= iterations; i++) {
      intervals.push(i);
    }
    setItr(intervals);
  }, [tableData]);

  return (
    <div className={classes.parent_container} style={pageHight ? { boxShadow: "none" } : {}} >
      <div className="outer">
        <div className="inner">
          <table>
            {reportType === "Flip" ? (
              <tr>
                <th className="fix thStyle" style={isSmall ? { fontSize: "12px", color: "#343A40" } : { fontSize: "15px", color: "#343A40" }} >{tableHead}</th>
                {itr.map((curr, idx) => {
                  return (
                    <th
                      className="thStyle"
                      style={(Number(indexArr[curr - 1]) + Number(currentReport?.rentalPeriod)) === (Number(currentReport?.rehabPeriod) + Number(currentReport?.rentalPeriod)) ? { color: theme.palette.primary.main, fontSize: isSmall ? "12px" : "15px" } : { color: "#343A40", fontSize: isSmall ? "12px" : "15px" }}
                      key={idx}
                      align="right"
                    >
                      <span>{Number(indexArr[curr - 1]) + Number(currentReport?.rentalPeriod)} Month(s)</span>
                      {currentReport?.rentalPeriod ? (<>
                        <br />
                        <span style={{ fontWeight: "450", fontSize: "11px" }} >(Rehab {indexArr[curr - 1]} {currentReport?.rentalPeriod && `/ Rental ${currentReport?.rentalPeriod}`})</span>
                      </>) : null}
                    </th>
                  );
                })}
              </tr>
            ) : (
              <tr>
                <th className="fix thStyle" style={{ color: "#343A40" }} >{tableHead}</th>
                {itr.map((curr, idx) => {
                  return (
                    <th className="thStyle" style={{ color: "#343A40" }} key={idx} align="right">
                      Year {indexArr[curr - 1] + 1}
                    </th>
                  );
                })}
              </tr>
            )}
            {rows.map((row, index) => {
              return (
                <tr
                  key={index}
                  id={row[row?.length - 1]?.charAt(0) === "=" ? "rowBorder" : "rowOtherBorder"}
                >
                  <td className="fix thStyle" component="th" scope="row" >
                    {glossaryDict && glossaryDict.hasOwnProperty(row[0]) ? (
                      <div className={classes.label_text}>
                        <InfoLabel obj={glossaryDict?.[row[0]]} />
                        <Typography
                          style={row[row?.length - 1]?.charAt(0) === "=" ?
                            isSmall ? { color: theme.palette.primary.main, fontWeight: "550", fontSize: "12px" } : { color: theme.palette.primary.main, fontWeight: "550" } :
                            isSmall ? { color: "#6C757D", fontSize: "12px" } : { color: "#6C757D" }}
                        >{row[0]}</Typography>
                      </div>
                    ) : (
                      <div
                        style={row[row?.length - 1]?.charAt(0) === "=" ?
                          isSmall ? { color: theme.palette.primary.main, fontWeight: "550", fontSize: "12px" } : { color: theme.palette.primary.main, fontWeight: "550" } :
                          isSmall ? { fontSize: "12px", color: "#6C757D" } : { fontSize: "1rem", color: "#6C757D" }}
                      >{row[0]}</div>
                    )}
                  </td>
                  {row.map((ele, idx) => {
                    if (idx != 0) {
                      return (
                        <td
                          key={idx}
                          className="tdStyle tdColor"
                          align="right"
                          style={ele.charAt(5) === "-" || ele.charAt(0) === "-" ? { color: "red" } : {}}
                        >
                          <span style={row[row?.length - 1]?.charAt(0) === "=" ? {
                            fontWeight: "500"
                          } : {
                            fontWeight: "400"
                          }} >
                            {ele.includes("NaN") ? "$0" : ele}
                          </span>
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}
