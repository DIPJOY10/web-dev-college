import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Autocomplete from '../../styled/SearchAndAdd/AddAutocomplete';
import Dialog from '../../styled/SearchAndAdd/AddDialog';
import CreateOffering from './create.offering';
import { useDebounce } from 'react-use';
import { search } from './utils';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';



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

export default function S(props) {
  const {
    value, onSelect, placeholder, offerings, walletIds, tx
  } = props;

  const classes = useStyles();
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const getOptionLabel = (option) => {
    return option?.name || " ";
  };

  return (
    <>
      <MyAutocomplete
        value={value}
        isSmall={false}
        text={text}
        setText={setText}
        placeholder={placeholder}
        results={results}
        getOptionLabel={getOptionLabel}
        onSelect={onSelect}
        onNew={onNew}
        label={"Product/Services"}
        setWidth={"100%"}
      />
      <Dialog
        open={open}
        setOpen={setOpen}
        loading={loading}
        form={<CreateOffering
          text={text}
          setOpen={setOpen}
          setLoading={setLoading}
          onSelect={onSelect}
          tx={tx}
        />}
      />
    </>
  );
}
