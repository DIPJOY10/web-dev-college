import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';

import MuiSnackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}



function Snackbar(props) {
  return <MuiSnackbar 
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    autoHideDuration={1500} 
    {...props} 
  />;
}

export default function ApiAlert() {

    const {
        activity
    } = useSelector((state) => state);
    const dispatch = useDispatch()
    const apiAlert = activity?.apiAlert

    const [open, setOpen] = useState(false)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
        dispatch({
           type:'AddActivity',
           payload:{
              apiAlert:null
           }
        })
        
    };

    useEffect(() => {
        if(apiAlert?.message){
            setOpen(true);
        }
    },[apiAlert?.createdAt])




        return  apiAlert?(<Snackbar open={open}  onClose={handleClose}  
        >
        <Alert onClose={handleClose} severity={apiAlert?.success?"success":"error"}>
          {apiAlert?.message}
        </Alert>
      </Snackbar>):null

    
 


}
