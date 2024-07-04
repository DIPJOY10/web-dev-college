import React, { useState,useEffect } from 'react';
import RestoreIcon from '@material-ui/icons/Restore';
import PaperBtn from './paper.btn';

function VersionBtn(props) {
    const { 
        onClick, count
    } = props


  return (
    <PaperBtn 
        icon={<RestoreIcon />}
        text={count>1?`${count} versions`:'1 version'}
        onClick={onClick}
    />

  );
}

export default VersionBtn