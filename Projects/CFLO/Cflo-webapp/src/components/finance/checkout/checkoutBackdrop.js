import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Api from '../../../helpers/Api';

export default function CheckoutBackdrop(props) {
  const {user, userProfile} = useSelector((state)=>state.auth);
  const activeUser = user?.model==='User'?user:userProfile;
  const location = useLocation();

  const pathname = location['pathname'];


  const userId = user?._id;
  const history = useHistory();
  const isCheckout = false;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const createSubscribe = () => {
    // Api.post('checkout/create',{
    //     type:'Platform',
    //     provider:'Stripe',
    //     paid: false,
    //     description:'Hey give me money',
    //     user:userId,
    //     userModelName:user?.model,
    //     creator:user?.model==='User'?userId:userProfile?._id,
    //     amount:1000,
    //     source:user?.wallet,
    //     wallets:[user?.wallet]
    // }).then(checkout=>{

    // })

    setOpen(false);

    history.push('/user/subscription');
  };


  useEffect(() => {
    if (pathname=='/user/subscription') {
      setOpen(false);
    }
  }, []);

  const checkoutBackdrop = (
    <div>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(true);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Kindly Subscribe 👋 </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              Hey <b>{activeUser?.displayName||''}</b> !! Thank you for using our services. Kindly subscribe to help us keep the lights 💡 on. It's only <b>$5 per month</b> .
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button onClick={createSubscribe} color="primary" autoFocus>
              Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  return open?checkoutBackdrop:null;
}
