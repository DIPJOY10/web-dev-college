import React, { useState, useEffect, PureComponent } from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { useMediaQuery } from '@material-ui/core';
import {
  LineChart, Line, XAxis, YAxis, ReferenceLine,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  chart: {
    zIndex: "100",
    width: "100%",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    height: "400px",
    padding: "1rem",
    borderRadius: "15px",
    position: "relative",
    [theme.breakpoints.down('sm')]: {
      padding: "0px",
    }
  },
  labelValue: {
    display: "flex",
    alignItems: "center",
    "& div": {
      width: "10px",
      height: "10px",
      borderRadius: "50%"
    }
  },
  rightBar: {
    position: "absolute",
    top: "50%",
    width: "430px",
    fontSize: "12px",
    fontWeight: "510",
    transform: "rotate(-90deg)",
    left: "-200px",
    textAlign: "center",
  },
  bottomLabel: {
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "510",
  }
}));

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CustomTooltip = ({ yUnit, xUnit, active, payload, label }) => {
  const classes = useStyles();
  if (active && payload && payload.length) {
    return (
      <Paper elevation={1} style={{ backgroundColor: "#ffffff", borderRadius: "3px", padding: "3px 8px" }} >
        <Typography style={{ fontSize: "15px", fontWeight: "530" }} >{xUnit} {label}</Typography>
        {payload && payload.map((data) => (
          <div className={classes.labelValue} >
            <div style={{ backgroundColor: data?.color, marginRight: "10px" }} ></div>
            <span style={{ marginRight: "10px" }} >{data?.name} :</span>
            <span style={{ fontWeight: "510" }} >{yUnit === "$" && "$"} {data?.value.toFixed(2)}{yUnit === "%" && "%"}</span>
          </div>
        ))}
      </Paper>
    );
  }
  return null;
}

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload, yUnit } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={yUnit === "$" ? -3 : -5} y={0} dy={5} textAnchor="end" fill="#666" fontSize="12px" >
          {yUnit === "$" && "$"} {numberWithCommas(payload.value)} {yUnit === "%" && "%"}
        </text>
      </g>
    );
  }
}


const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#d1a656",
  "#b19dff",
  "#46c7a8",
  "#72aeff",
  "#82ca9d",
  "#8884d8",
];

export default function LineGraph({ pageHight, yAxisLabel, xAxisLabel, yUnit, xUnit, referenceLine, LineGraphData, keys }) {
  const classes = useStyles();
  const theme = useTheme();
  const { chart } = classes;

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isExSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const [inter, setInter] = useState(0)

  useEffect(() => {
    let len = LineGraphData.length
    if (len <= 16) {
      if (isSmall) {
        setInter(2)
      } else {
        setInter(0)
      }
    } else if (len <= 51) {
      if (isSmall) {
        setInter(4)
      } else {
        setInter(1)
      }
    } else {
      if (isSmall) {
        setInter(9)
      } else {
        setInter(2)
      }
    }
  }, [LineGraphData, isSmall])









  return (
    <div className={chart} style={pageHight ? { boxShadow: "none" } : {}} >
      <ResponsiveContainer width="100%" height={isExSmall ? "100%" : "95%"}>
        <LineChart
          width={500}
          height={350}
          data={LineGraphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" interval={inter} />
          <YAxis domain={["auto", "auto"]} tick={<CustomizedAxisTick yUnit={yUnit} />} />
          <Tooltip content={<CustomTooltip yUnit={yUnit} xUnit={xUnit} />} />
          <Legend />
          {referenceLine && <ReferenceLine x={referenceLine} stroke="#d3d1d1" />}
          {keys.map((dataKey, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={dataKey}
              strokeWidth={2}
              dot={false}
              stroke={COLORS[index % COLORS.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {isExSmall && yAxisLabel ? null : (<div className={classes.rightBar} >{yAxisLabel}</div>)}
      {isExSmall && xAxisLabel ? null : (<div className={classes.bottomLabel} >{xAxisLabel}</div>)}
    </div>
  );
}
