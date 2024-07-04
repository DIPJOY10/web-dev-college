import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { CSVLink } from "react-csv";
import CustomBtn from "../../styled/CommonComponents/CustomBtn";
import downloadIcon from "../../../Assets/downloadIcon.svg"

const useStyles = makeStyles({

});

export default function DownloadExcel(props) {
    const classes = useStyles();
    const theme = useTheme()
    const { } = classes;
    const { dataArr, headerIteration, title, yearsArr, projectData, currentReport } = props

    const isExSmall = useMediaQuery(theme.breakpoints.down("xs"));

    const [data, setData] = useState()

    useEffect(() => {
        let locData = [];
        let len = yearsArr.length;

        let labelArr = []
        labelArr.push(title);
        for (let i = 0; i < len; i++) {
            labelArr.push(`Year ${yearsArr[i] + 1}`);
        }
        locData.push(labelArr);

        let allKeys = Object.keys(dataArr)
        allKeys.map((key) => {
            let arr = dataArr?.[key]
            let localArr = [key]
            for (let i = 0; i < len; i++) {
                localArr.push(parseFloat(arr[i] || 0).toFixed(2))
            }
            locData.push(localArr)
        })
        setData(locData)
    }, [headerIteration, dataArr, title])

    return (
        <div >
            {data?.length > 0 ? (
                <CSVLink
                    filename={`${projectData?.displayName}_${currentReport?.reportTitle}_${title}.csv`}
                    data={data}
                    style={{ textDecoration: "none" }}
                >
                    <div>
                        {isExSmall ? (
                            <CustomBtn
                                text={<img src={downloadIcon} style={{ height: "20px" }} />}
                            />
                        ) : (
                            <CustomBtn
                                text={"Download"}
                                startPart={<img src={downloadIcon} style={{ height: "20px" }} />}
                            />
                        )}
                    </div>
                </CSVLink>
            ) : (
                <>sometime went wrong</>
            )}
        </div>
    );
}
