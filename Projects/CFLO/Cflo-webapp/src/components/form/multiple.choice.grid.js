import React from 'react'
import { makeStyles } from "@material-ui/styles";
import { Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import MultipleChoice from './multiple.choice';
const useStyles = makeStyles((theme) => ({

    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        // border: '1px solid #000',
    },
    row: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        // border: '1px solid red'
    },
    col: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // border: '1px solid green',
        width: '100%',
        height: '100%'

    }
}));

export default function MultipleChoiceGrid(props) {
    const classes = useStyles();
    const { root, row, col } = classes;

    const {
        optionIds,
        setOptionIds,
        optionDict,
        setOptionDict,
        optionColIds,
        setOptionColIds,
        optionColDict,
        setOptionColDict,
        questionId,
        question,
        createOption,
        createOptionCols,
        deleteOption,
        deleteOptionCols,
    } = props;
    return (
        <>
            <div className={root}>
                <div className={row}>
                    <div className={col}>
                        <Typography variant="h6">Rows</Typography>
                        <div style={{
                            width: "100%", marginTop: "1vh", display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {optionIds.length > 0 ? optionIds?.map((optionId, index) => {
                                const option = optionDict[optionId];
                                return (
                                    <MultipleChoice
                                        createOption={createOption}
                                        option={option}
                                        index={index}
                                        deleteOption={deleteOption}
                                        isRow={true}
                                    />
                                )
                            }) : <Button variant="outlined" onClick={createOption}>Create Rows</Button>}
                        </div>
                    </div>
                    <div className={col} style={{ marginTop: "1rem" }}>
                        <Typography variant="h6">Columns</Typography>
                        <div style={{
                            width: "100%", marginTop: "1vh", display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {optionColIds.length > 0 ? optionColIds?.map((optionColId, index) => {
                                const optionCol = optionColDict[optionColId];
                                return (
                                    <MultipleChoice
                                        createOption={createOptionCols}
                                        option={optionCol}
                                        index={index}
                                        deleteOption={deleteOptionCols}
                                        isRow={true}
                                    />
                                )
                            }) : <Button variant="outlined" onClick={createOptionCols}>Create Columns</Button>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
