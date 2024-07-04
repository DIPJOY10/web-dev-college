import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

}));

const Social = () => {
  return (
    <div className="social">
      <a
        href="https://www.facebook.com/contractFlo/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="icon fb" />
      </a>
      <a
        href="https://twitter.com/ContractFlo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="icon tw" />
      </a>
      <a
        href="https://in.linkedin.com/company/contractflo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="icon li" />
      </a>
    </div>
  );
};

export default Social;
