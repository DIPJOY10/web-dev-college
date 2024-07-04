import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import React, { useState, useCallback, useEffect } from "react";
import { PieChart, Tooltip, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#0088FE",
  "#b19dff",
  "#46c7a8",
  "#72aeff",
  "#FFBB28",
  "#9772FB",
  "#B4E197",
  "#00C49F",
  "#FF8042",
  "#d1a656",
];

function PieGraph({ Data, chartRadius, heightNum, isMonthly = false, type, fun }) {
  const [filteredArr, setFilteredArr] = useState([])
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let filteredObj = [];
    let arrWithPercentage = []
    let total = 0;

    Data && Data.length > 0 && Data.map((d) => {
      if (d?.value !== 0) {
        filteredObj.push(d)
      }
      total += parseFloat(d?.value)
    })

    filteredObj.map((filterD) => {
      let perc = (((parseFloat(filterD?.value)) / total) * 100).toFixed(0);
      arrWithPercentage.push({
        ...filterD,
        value: parseFloat(filterD?.value),
        percentage: perc
      })
    })
    setFilteredArr(arrWithPercentage)
  }, [Data])

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={1} style={{ backgroundColor: "#ffffff", borderRadius: "3px", padding: "3px 8px" }} >
          <Typography style={{ fontSize: "15px", fontWeight: "530" }} >{payload[0]?.name}</Typography>
          {isMonthly ? (
            <Typography style={{ fontSize: "13px" }} >{`$ ${payload[0]?.value}/mo  (${payload[0]?.payload?.percentage}%)`}</Typography>
          ) : (
            <Typography style={{ fontSize: "13px" }} >{`$ ${payload[0]?.value}  (${payload[0]?.payload?.percentage}%)`}</Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {

    const percentageVal = (percent * 100).toFixed(0)
    let radius
    if (percentageVal > 6) {
      radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    } else {
      radius = innerRadius + (outerRadius - innerRadius) * 0.8;
    }
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={"middle"}
        dominantBaseline="middle"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (<>
    {filteredArr.length === 0 ? (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: "40px"
        }}
      >
        {fun ? (
          <p style={{ width: "290px", textAlign: "center", fontSize: "16px" }} >
            <span onClick={fun} style={{ color: "blue", cursor: "pointer" }} >Enable itemized</span>  {` ${type} to view breakdown.`}
          </p>
        ) : (
          <p></p>
        )}
      </div>
    ) : (
      <div style={{ width: "100%", height: heightNum }} >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={filteredArr}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={chartRadius}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              isAnimationActive={false}
            >
              {filteredArr.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )}
  </>);
}

export default PieGraph;
