import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {makeStyles} from '@material-ui/core/styles';
import Api from '../../../helpers/Api';
import {setFiles} from '../fileUtils';

const useStyles = makeStyles({
  imgStyle: (props)=>({
        height: props.height||'1.6rem',
        width: props.width||'1.6rem',
        borderRadius:'1.6rem',
        margin:'0.5rem'
  }),

});


const ThumbDP = (props)=>{
    const classes = useStyles(props);
    const {file} = props;

    const thumbUrl = file?.thumbUrl? file?.thumbUrl:file?.url
    return (
        <img
        className={classes.imgStyle}
        src={thumbUrl}
        />
    );
};

export default ThumbDP;