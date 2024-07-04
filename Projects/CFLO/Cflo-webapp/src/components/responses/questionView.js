import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import QuestionTypeRendererWithValue from './question.type.renderer.with.value';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // margin: theme.spacing(2),
        boxSizing: "border-box",
        height: "100%"
    },
    questionText: {
        margin: theme.spacing(2),
        // marginBottom: theme.spacing(2),
    },
    questionType: {
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),

    }
}));
export default function QuestionView(props) {
    const classes = useStyles();

    const { question, updateApi, questionId, formResDict, setformResDict, qMap } = props;
    console.log(qMap)
    console.log(question)
    console.log(formResDict)
    const oldFormRes = qMap[questionId]
    const oldFormResId = oldFormRes?._id
    const formRes = formResDict[oldFormResId]
    console.log(formRes, 'form response')
    const [type, setType] = useState(question?.type || "Linear Scale");

    const {
        root, questionText, questionType
    } = classes;

    let data = {}
    let flexSpace = 1
    let formValue = ""

    if (question?.type === "Linear Scale") {
        formValue = formRes?.value
    } else if (question?.type === "Multiple Choice") {
        formValue = formRes?.option
    } else if (question?.type === "Multiple Choice Grid") {
        formValue = formRes?.optionCol
    } else if (question?.type === "Date") {
        formValue = formRes?.time
    } else {
        formValue = formRes?.text
    }

    const [value, setValue] = useState(formValue || "");

    if (question?.type === "Linear Scale") {
        flexSpace = 2
        data = {
            ...formRes,
            value: value,
        }
    } else if (question?.type === "Multiple Choice") {
        data = {
            ...formRes,
            option: value,
        }
    } else if (question?.type === "Multiple Choice Grid") {
        data = {
            ...formRes,
            optionCol: value,
        }
    } else if (question?.type === "Date") {
        flexSpace = 2
        data = {
            ...formRes,
            time: value,
        }
    } else if (question?.type === "Short Answer") {
        flexSpace = 2
        data = {
            ...formRes,
            time: value,
        }
    } else {
        data = {
            ...formRes,
            text: value,
        }
    }

    useDebounce(
        () => {
            updateApi(data)
        },
        500,
        [value]
    );


    return (
        <Grid item xs={12 / flexSpace}>
            <Paper variant="outlined" className={root} >
                <div className={questionText} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography>{question?.questionText}</Typography>
                </div>
                <div className={questionType}>
                    <QuestionTypeRendererWithValue
                        updateApi={updateApi}
                        questionId={questionId}
                        formResDict={formResDict}
                        setformResDict={setformResDict}
                        qMap={qMap}
                        question={question} type={type} value={value} setValue={setValue} />
                </div>
            </Paper>
        </Grid>
    )
}
