import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Autocomplete from '../styled/SearchAndAdd/AddAutocomplete';
import Dialog from '../styled/SearchAndAdd/AddDialog';
import PalForm from './newPalForm';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Api from '../../helpers/Api';
import _ from 'lodash';

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
    value, onSelect, placeholder,
  } = props;
  const classes = useStyles();
  const {user, userProfile} = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [pals, setPals] = useState([]);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const {
    root, row, col,
  } = classes;

  const sendQuery = ()=>{
    Api.post('searchPeople/', {
      name: text,
    }).then((users)=>{
      setUsers(users);
    });
  };

  useEffect(() => {
    sendQuery();
    // get user create accounts
    Api.post('pal/getPals', {
      parent: user._id,
      parentModelName: user.model,
    }).then((pals)=>{
      setPals(pals);
      // console.log(pals,' is the pals')
    });
  }, []);

  const getListItem = (option)=>{
    return <div className={row}>
      <ListItemAvatar>
        <Avatar src={
                        option?.parent?.displayPicture?.thumbUrl?
                        option.parent.displayPicture.thumbUrl:option?.parent?.displayPicture?.url} alt={option?.parent?.displayName} />
      </ListItemAvatar>
      <ListItemText
        primary={option?.parent?.displayName}
        secondary={option.parent.model=='Pal'?'Connection':option?.parentModelName}
      />
    </div>;
  };

  const onNew = ()=>{
    setOpen(true);
  };

  const getOptionLabel = (option)=>{
    return option&&option?.parent?option?.parent?.displayName:'';
  };

  const getAddObject = (params)=>{
    return {
      _id: 'New',
      parent: {
        displayName: `Add ${params.inputValue}`,
      },
    };
  };

  return (
    <>
      <Autocomplete
        value={value}
        text={text}
        setText={setText}
        placeholder={placeholder}
        getListItem={getListItem}
        results={_.concat(users, pals)}
        getAddObject={getAddObject}
        getOptionLabel={getOptionLabel}
        onSelect={onSelect}
        onNew={onNew}
      />
      <Dialog
        open={open}
        setOpen={setOpen}
        loading={loading}
        form={<PalForm
          text={text}
          setOpen={setOpen}
          onSelect={onSelect}
          loading={loading}
          setLoading={setLoading}
        />}
      />
    </>
  );
}
