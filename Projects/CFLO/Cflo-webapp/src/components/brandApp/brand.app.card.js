import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import DPImage from '../file/Viewer/dpImage';
import AvatarLocal from '../profile/avatar';
import { Avatar } from '@material-ui/core';
import LogoSvg from "../../Assets/appstore.svg";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  marginLeft: {
    marginLeft: '1rem',
  },

  appPaperBox: {
    maxWidth: '24rem',
    minWidth: '18rem',
    width: '90vw',
    padding: '1rem',
    height: '100%',
    maxHeight: '6rem',
  },

  appNameText: {
    fontWeight: '500',
    fontSize: '1.3rem',
  },

}));

export default function BrandAppCard(props) {
  const {
    brandApp,
  } = props;

  const classes = useStyles();

  const {
    row, col, center, appPaperBox, marginLeft,
    appNameText,
  } = classes;

  const dP = brandApp?.displayPicture
  const dpUrl = dP?.thumbUrl?dP.thumbUrl:dP?.url
  const imgUrl = dpUrl?dpUrl:LogoSvg
  const history = useHistory()

  return (

    <Paper square className={cx(row, appPaperBox)} onClick={() =>{
        var path = '/brandApp/'+ brandApp?._id +'/view'
        history.push(path)
        const paid = brandApp?.paid
        if(!paid){
            path = '/brandApp/tx/'+ brandApp?._id 
            history.push(path)
        }

    }}>
      <div className={row}>
          <Avatar src={imgUrl} />
          <div className={cx(col, marginLeft)}>
            <Typography className={cx(appNameText)}>
              {brandApp?.name?.length>0?brandApp.name:'Untitled'}
            </Typography>
            <Typography noWrap>
              {brandApp?.description}
            </Typography>
          </div>
      </div>

    </Paper>

  );
}
