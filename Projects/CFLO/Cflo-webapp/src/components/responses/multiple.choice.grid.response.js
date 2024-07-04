import React, { useState, useEffect } from 'react'
import { FormControl, FormControlLabel, makeStyles, Radio, RadioGroup, Typography } from '@material-ui/core'
import arrayToReducer from '../../helpers/arrayToReducer';

const useStyles = makeStyles(theme => ({
  formControlLabel: {
    marginLeft: 0,
    marginRight: 0,
  }
}));
export default function MultipleChoiceGridResponse(props) {
  const { question } = props;
  const classes = useStyles();
  const [value, setValue] = useState([]);
  const [optionColIds, setOptionColIds] = useState([]);
  const [optionColDict, setOptionColDict] = useState([]);
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
  useEffect(() => {
    const { idArr, newDict } = arrayToReducer(question?.optionCols)
    setOptionColIds(idArr)
    setOptionColDict(newDict)
  }, [question])
  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '10%', justifyContent: 'space-evenly' }}>
        {
          optionIds.map((optionId, index) => {
            const option = optionDict[optionId];
            return (
              <>
                <Typography>{option?.optionText || " "}</Typography>
              </>
            );
          })
        }
      </div>
      {
        optionColIds.map(optionColId => {
          const option = optionColDict[optionColId];
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography>{option?.optionText || " "}</Typography>
              <FormControl component="fieldset">
                <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange} >
                  {/* <Typography>{option?.optionText || " "}</Typography> */}
                  {
                    optionIds.map((optionId, index) => {
                      const option = optionDict[optionId];
                      return (
                        // <>
                        <FormControlLabel value={option?.optionText} control={<Radio />} label={""} classes={{ root: classes.formControlLabel }} />
                        // {/* </> */}
                      );
                    })
                  }
                </RadioGroup>
              </FormControl>
            </div>
          )
        })
      }
    </div>
  )
}
