import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';


const useStyles = makeStyles((theme) => ({
  root: {

  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  block: {
    height: '2rem',
    margin: '0.5rem 0',
  },

  parentBlock: {
    minHeight: '2rem',
    margin: '0.7rem 0',
  },

  parentText: {
    fontSize: '0.9rem',
    fontWeight: '600',
  },

  smBlock: {
    height: '1.5rem',
    margin: '0rem 0',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  paperStyle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '16rem',
    maxWidth: '16rem',
    minWidth: '16rem',
    padding: '0.6rem',
    margin: '1rem 1rem',
  },

  titleTextStyle: {
    fontSize: '1.1rem',
    textAlign: 'center',
    fontWeight: '600',
  },

  subText1Style: {
    fontSize: '0.8rem',

  },

  subText2Style: {
    fontSize: '0.8rem',
    marginTop: '-0.6rem',
  },


}));

export default function ProductCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    onSelect, account,
  } = props;

  const {
    row, block, smBlock, parentBlock, parentText,
  } = classes;

  let ParentView = null;

  switch (account?.wallet?.parentModelName) {
    case 'User':
      ParentView = (
        <div className={parentBlock}>
          <Typography className={parentText}>
                        🏦  Personal Account
          </Typography>
        </div>
      );
      break;

    case 'Organization':
      ParentView = (
        <div className={parentBlock}>
          <Typography className={parentText}>
                        🏦  Company Account
          </Typography>
          <Typography className={parentText}>
            {account?.wallet?.parent?.displayName||''}
          </Typography>
        </div>
      );
      break;

    case 'Project':
      ParentView = (
        <div className={parentBlock}>
          <Typography className={parentText}>
                        🏦  Project Account
          </Typography>
          <Typography className={parentText}>
            {account?.wallet?.parent?.displayName||''}
          </Typography>
        </div>
      );
      break;

    default:
      break;
  }


  return (

    <ButtonBase onClick={()=>{
      if (onSelect) {
        onSelect(account);
      }
    }}>

      <Paper key={account.title} className={classes.paperStyle}>

        <div className={cx(row, block)}>
          <Typography className={classes.titleTextStyle}>
            {account?.name}
          </Typography>
        </div>

        {ParentView}

        <div className={cx(row, smBlock)}>
          <Typography>{account?.address?.line1}</Typography>
        </div>

        <div className={cx(row, smBlock)}>
          <Typography>{account?.address?.city||''} {account?.address?.state||''} {account?.address?.postal_code||''}</Typography>
        </div>

      </Paper>

    </ButtonBase>

  );
}
