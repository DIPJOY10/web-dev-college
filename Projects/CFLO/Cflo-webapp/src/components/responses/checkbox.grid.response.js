import React, { useState, useEffect } from 'react'
import { FormControl, FormControlLabel, FormGroup, makeStyles, Checkbox, RadioGroup, Typography, Box } from '@material-ui/core'
import arrayToReducer from '../../helpers/arrayToReducer';
import { useDebounce } from 'react-use';
import { addItem, findItem, removeItem } from './utils';

const useStyles = makeStyles(theme => ({
  formControlLabel: {
    marginRight: 0,
  }
}));
export default function MultipleChoiceGridResponse(props) {
  const { question, value, setValue, updateApi, questionId, formResDict, qMap, setformResDict } = props;
  const classes = useStyles();
  const [optionColIds, setOptionColIds] = useState([]);
  const [optionColDict, setOptionColDict] = useState([]);
  const [optionIds, setOptionIds] = useState([]);
  const [optionDict, setOptionDict] = useState([]);


  const [selected, setSelected] = useState([]);
  const [resData, setResData] = useState({});
  const oldFormRes = qMap[questionId] || []
  const firstRes = oldFormRes[0]
  const oldFormResId = firstRes?._id
  const formRes = formResDict[oldFormResId];
  const oldOptionIds = formRes?.options || [];
  const oldOptionColIds = formRes?.optionCols || [];

  const [resOptionIds, setResOptionIds] = useState(oldOptionIds);
  const [resOptionColIds, setResOptionColIds] = useState(oldOptionColIds);

  const handleChange = (event) => {
    event.preventDefault();
    let col = event.target.value;
    let row = event.target.name;
    const oldIndex = findItem(row, col, resOptionIds, resOptionColIds)

    if (oldIndex !== -1) {
      // if already present remove element at the index
      const newRemObj = removeItem(oldIndex, resOptionIds, resOptionColIds)

      setResOptionIds(newRemObj.options)
      setResOptionColIds(newRemObj.optionCols)

    } else {
      const newObj = addItem(row, col, resOptionIds, resOptionColIds)
      setResOptionIds(newObj.options)
      setResOptionColIds(newObj.optionCols)
    }

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
  // useDebounce(()=>{
  //   // updateApi()
  //   const filterRow = selected.filter((v,i)=> i%2 ===0);
  //   const filterCol = selected.filter((v,i)=> i%2 !=0);
  //   setResData({
  //     ...formRes,
  //     optionCols:filterCol,
  //     options:filterRow
  //   })
  //   setformResDict({
  //     ...formResDict,
  //     optionCols:filterCol,
  //     options:filterRow
  //   })

  // },500,[selected])
  useEffect(() => {

    const obj = {
      ...formRes,
      optionCols: resOptionColIds,
      options: resOptionIds
    }
    updateApi(obj)
  }, [resOptionIds])

  // console.log(formRes,'formRes')
  return (<div style={{ display: 'flex' }}>
    <div style={{ display: 'flex', flexDirection: 'column', marginRight: "0.5rem" }}>
      <Box height={"30px"}>

      </Box>
      {
        optionIds.map((optionId) => {
          var optionRow = optionDict[optionId];
          return (
            <Typography style={{ whiteSpace: "nowrap", marginBottom: "1.2rem", minWidth: "42px" }}>{optionRow?.optionText || " "}</Typography>
          );
        })
      }
    </div>


    <div style={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
      <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "space-evenly" }} >
        {optionColIds.map((optionColId) => {
          const optionCol = optionColDict[optionColId];
          return (
            <Typography style={{ fontSize: '.9rem', maxWidth: "42px", whiteSpace: "nowrap", textAlign: "center" }}>{optionCol?.optionText || " "}</Typography>
          )
        })}
      </div>
      {
        optionIds.map((optionId, index) => {
          var optionRow = optionDict[optionId];
          const oldIndex = resOptionIds.indexOf(optionId)
          const oldColId = oldIndex == -1 ? null : resOptionColIds[oldIndex]
          return (<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
            <FormControl aria-label="gender" value={oldColId} name="gender1" onChange={handleChange} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly", width: "100%" }} >
              {
                (optionColIds).map((optionId, index) => {
                  const option = optionColDict[optionId];
                  return (
                    <FormControlLabel value={option?._id} name={optionRow?._id} control={<Checkbox color="primary" />} label={""} classes={{ root: classes.formControlLabel }} />
                  );
                })
              }
            </FormControl>
          </div>);
        })
      }
    </div>
  </div>)
}
