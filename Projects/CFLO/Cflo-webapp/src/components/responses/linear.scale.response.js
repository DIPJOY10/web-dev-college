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
export default function LinearScaleResponse(props) {
    const { question } = props;
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
    scale = func(lowerbound, upperbound);
    console.log(scale, "scale");
    const [value, setValue] = useState(null);
    const handleChange = (event) => {
        event.preventDefault();
        setValue(event.target.value);
    };
    return (
        <FormControl component="fieldset">
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange} classes={{ root: classes.radioGroup }}>
                {
                    scale.map((val, index) => {
                        return (

                            <FormControlLabel value={val} control={<Radio />} label={val} classes={{ root: classes.formcontrollabel }} />

                        );
                    })
                }
            </RadioGroup>
        </FormControl>
    )
}