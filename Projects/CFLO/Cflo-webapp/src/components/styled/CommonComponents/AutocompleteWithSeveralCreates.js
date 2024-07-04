import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Dialog from '../SearchAndAdd/AddDialog'
import MyAutocomplete from './MyAutoComplete';



const useStyles = makeStyles((theme) => ({
  root: {

  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function AutocompleteWithSeveralCreates(props) {
  const {
    value, onSelect,
    placeholder, offerings,
    CreateDialogBox, tx,
    setText, text,
    open, setOpen,
    loading, setLoading,
    getOptionLabel, lable
  } = props;

  const classes = useStyles();
  const [results, setResults] = useState(offerings);
  const {
    root, row, col,
  } = classes;

  //
  useEffect(() => {
    setResults(offerings);
  }, [offerings]);


  const onNew = () => {
    setOpen(true);
  };

  // const getOptionLabel = (option) => {
  //   return option?.name || " ";
  // };

  return (
    <>
      <MyAutocomplete
        isSmall={false}
        value={value}
        text={text}
        setText={setText}
        placeholder={placeholder}
        results={results}
        getOptionLabel={getOptionLabel}
        onSelect={onSelect}
        onNew={onNew}
        label={lable}
        setWidth={"100%"}
      />
      <Dialog
        open={open}
        setOpen={setOpen}
        loading={loading}
        form={CreateDialogBox}
      />
    </>
  );
}
