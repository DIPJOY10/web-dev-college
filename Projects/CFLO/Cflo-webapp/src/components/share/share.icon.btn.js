import React, { useState,useEffect } from 'react';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import { IconButton } from '@material-ui/core';

function ShareIconBtn(props) {
    const { 
        open, setOpen
    } = props


  return (
  
      <IconButton color="primary" onClick={()=>{setOpen(true)}}>
        <ShareOutlinedIcon />
      </IconButton>

  );
}

export default ShareIconBtn