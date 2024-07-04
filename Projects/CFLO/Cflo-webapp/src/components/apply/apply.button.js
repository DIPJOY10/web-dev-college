import React, {useState} from 'react';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  useHistory,
} from 'react-router-dom';

const ApplyButton = withStyles((theme) => ({
  root: {
    'backgroundColor': theme.palette.primary.main,
    'borderRadius': 3,
    'margin': '1rem',
    'color': 'white',
    'height': '1.9rem',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);

const ApplyBtn = (props) => {
  const {
    parent,
    parentModelName,
  } = props;

  const history = useHistory();

  const data = {
    parent,
    type: parentModelName,
  };

  const create = ()=>{
    const searchParams = new URLSearchParams(data);
    const newUrl = '/feed/apply/?' + searchParams;
    history.push(newUrl);
  };

  return (
    <ApplyButton onClick={create}>
            Apply
    </ApplyButton>
  );
};

export default ApplyBtn;
