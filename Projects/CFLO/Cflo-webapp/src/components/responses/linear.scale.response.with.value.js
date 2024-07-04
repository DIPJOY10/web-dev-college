import React, { useState } from 'react'
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles((theme) => ({
    radioGroup: {
        flexDirection: 'row',
        width: '100%'
    },
    formcontrollabel: {
        flexDirection: 'column-reverse',
    }
}));
export default function LinearScaleResponseWithValue(props) {
    const { question, value, setValue } = props;
    const classes = useStyles();
    const lowerbound = question.lowerbound;
    const upperbound = question.upperbound;
    let scale = [];
    const func = (lower, upper) => {
        for (let i = lower; i <= upper; i++) {
            scale.push(i);
        }
        return scale;
    }
    console.log(value)
    scale = func(lowerbound, upperbound);
    console.log(scale, "scale");
    return (
        <RadioGroup onChange={(event) => setValue(event.target.value)} classes={{ root: classes.radioGroup }}>
            {
                scale.map((val) => {
                    return (
                        <FormControlLabel name={val} value={val} control={<Radio color="primary" />} label={val} classes={{ root: classes.formcontrollabel }} />
                    );
                })
            }
        </RadioGroup>
    )
}