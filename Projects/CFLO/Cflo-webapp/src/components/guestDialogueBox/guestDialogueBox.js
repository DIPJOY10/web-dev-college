import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core'
import React from 'react'
import SignUp from '../auth/SignupBox';

const GuestDialogueBox = ({open,setOpen}) => {

    function handleClose(){
        setOpen(false);
    }
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sign Up to Continue"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            <SignUp/>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GuestDialogueBox