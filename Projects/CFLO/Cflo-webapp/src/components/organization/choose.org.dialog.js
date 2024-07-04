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
import SelectOrgDialog from './select.org.dialog';
import CreateOrgDialog from './create.org.dialog';


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

export default function CreateNetwork(props) {
  const {
    adminTeamIds,
    onSelectOrg,
  } = props;
  const classes = useStyles();

  const [openSelectOrg, setOpenSelectOrg] = useState(false);
  const [openCreateOrg, setOpenCreateOrg] = useState(false);

  const {
    root, row, col, title,
  } = classes;


  const createInstead = ()=>{
    setOpenSelectOrg(false);
    setOpenCreateOrg(true);
  };

  const onCreateOrg = (team)=>{
    if (team?._id) {
      const teamId = team?._id;
      onSelectOrg(teamId);
      setOpenCreateOrg(false);
    }
  };


  return (
    <>

      <ButtonBase onClick={()=>{
        setOpenSelectOrg(true);
      }}>
        <Paper>
          <Typography>Choose Team</Typography>
        </Paper>
      </ButtonBase>

      <SelectOrgDialog
        teamIds={adminTeamIds||[]}
        open={openSelectOrg}
        setOpen={setOpenSelectOrg}
        onSelect={onSelectOrg}
        createInstead={createInstead}
      />

      <CreateOrgDialog
        open={openCreateOrg}
        setOpen={setOpenCreateOrg}
        onCreate={onCreateOrg}
      />

    </>
  );
}
