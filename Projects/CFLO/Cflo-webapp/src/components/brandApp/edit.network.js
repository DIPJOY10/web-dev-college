import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import {InputBase} from '@material-ui/core';
import SelectOrgDialog from '../organization/select.org.dialog';
import CreateOrgDialog from '../organization/create.org.dialog';
import TeamCard from '../team/team.card';
import CreateBtn from '../styled/actionBtns/create.btn';
import Api from '../../helpers/Api';
import NickNameInput from '../styled/nickname.input';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    maxWidth: '32rem',
    margin: '1rem',
  },

  title: {
    fontSize: '1.3rem',
    fontWeight: '500',
    margin: '1rem',
    textAlign: 'left',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

}));

export default function EditNetwork(props) {
  const {
    network: networkOld,
    onUpdate,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [network, setNetwork] = useState(networkOld);

  const [openSelectOrg, setOpenSelectOrg] = useState(false);
  const [openCreateOrg, setOpenCreateOrg] = useState(false);


  const {

  } = useSelector((state) => state);

  const {
    root, row, col, title,
  } = classes;


  const updateNetwork = async ()=>{
    try {
      const res = await Api.post('brand/app/network/update', {
        appNetwork: network,
      });

      const data = res?.data;
      onUpdate(data);
    }
    catch (error) {

    }
  };


  const isComplete = network.nickName.length>2&&
                            network.passcode.length>2&&
                            network.ownerTeam;

  return (
    <Paper className={cx(root, col)}>

      <Typography className={title}>Update Network</Typography>

      <NickNameInput value={network.nickName}
        placeholder={'Nickname - eg: NY East'}
        onChange={(ev)=>{
          setNetwork({
            ...network,
            nickName: ev.target.value,
          });
        }}
      />


      <NickNameInput value={network.passcode}
        placeholder={'Passcode [unique]'}
        onChange={(ev)=>{
          setNetwork({
            ...network,
            passcode: ev.target.value,
          });
        }}
      />


      {isComplete?<CreateBtn
        onClick={()=>{
          updateNetwork();
        }}
      >
                update Network
      </CreateBtn>:null}

    </Paper>
  );
}
