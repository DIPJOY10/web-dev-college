import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PieChart, Tooltip, Pie, Sector, Cell, ResponsiveContainer } from "recharts";


const useStyles = makeStyles((theme) => ({
    chartCont: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    graphCont: {
        width: "45%",
        height: "100%",
        [theme.breakpoints.down('sm')]: {
            width: "60%",
        }
    },
    labelCont: {
        width: "39%",
        height: "100%",
        overflowY: "auto",
        paddingTop: "30px",
        overflowX: "hidden",
    },
    singleLabelCont: {
        display: "flex",
        alignItems: "center",
        marginBottom: "5px",
        "& div": {
            width: "15px",
            height: "8px",
            marginRight: "7px"
        },
    }
}))


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
    "#d1a656"
];

export default function DoughnutChart({ Data, chartInnerRadius, chartOuterRadius, heightNum, isMonthly = false, type, fun }) {
    const classes = useStyles();
    const [updatedArr, setUpdatedArr] = useState([])

    useEffect(() => {
        let filteredObj = [];
        let arrWithPercentage = []
        let total = 0;

        Data && Data.length > 0 && Data.map((d, index) => {
            if (d?.value !== 0) {
                filteredObj.push({
                    ...d,
                    color: COLORS[index % COLORS.length]
                })
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
        setUpdatedArr(arrWithPercentage)
    }, [Data])

    console.log(updatedArr)


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


    return (
        <>
            {updatedArr.length === 0 ? (
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
                <div className={classes.chartCont} style={{ height: heightNum }} >
                    <div className={classes.graphCont} >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={updatedArr}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={chartInnerRadius}
                                    outerRadius={chartOuterRadius}
                                    fill="#8884d8"
                                    paddingAngle={0}
                                    dataKey="value"
                                >
                                    {updatedArr.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={classes.labelCont} >
                        {updatedArr.map((chartData) => (
                            <div className={classes.singleLabelCont} >
                                <div style={{ backgroundColor: chartData?.color }} ></div> <p>{chartData?.name} ({chartData?.percentage}%)</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
