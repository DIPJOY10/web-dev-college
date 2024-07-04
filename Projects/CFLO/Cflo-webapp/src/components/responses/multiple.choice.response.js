import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import arrayToReducer from '../../helpers/arrayToReducer';


export default function MultipleChoiceResponse(props) {
    const { question } = props;
    const [value, setValue] = useState(null);
    const [optionIds, setOptionIds] = useState([]);
    const [optionDict, setOptionDict] = useState([]);
    const handleChange = (event) => {
        event.preventDefault();
        setValue(event.target.value);
    };
    useEffect(() => {
        const { idArr, newDict } = arrayToReducer(question?.options)
        setOptionIds(idArr)
        setOptionDict(newDict)
    }, [question])
    return (
        <FormControl component="fieldset">
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange} >
                {
                    optionIds.map((optionId, index) => {
                        const option = optionDict[optionId];
                        return (
                            <FormControlLabel value={option?.optionText} control={<Radio />} label={option?.optionText} />
                        );
                    })
                }
            </RadioGroup>
        </FormControl>
    )
}
