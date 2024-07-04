import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import {useParams, useHistory} from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import {blue} from '@material-ui/core/colors';
import EditBtn from '../styled/actionBtns/edit.btn';
import CloseBtn from '../styled/actionBtns/close.btn';
import _ from 'lodash';
import Api from '../../helpers/Api';
import Paper from '@material-ui/core/Paper';
import CreateBtn from '../styled/actionBtns/create.btn';
import TitleInput from '../styled/title.input';
import DescriptionInput from '../styled/description.input';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import clsx from 'clsx';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import PanToolIcon from '@material-ui/icons/PanTool';
import TocIcon from '@material-ui/icons/Toc';

import LinearProgress from '@material-ui/core/LinearProgress';
import teamUtils from '../team/team.utils';
import {createOrg} from './organization.utils';
import PaperOptionCard from '../styled/paper.option.card';
import TeamCard from '../team/team.card';


const {
  handleTeams,
} = teamUtils;


const useStyles = makeStyles((theme) => ({
  listStyle: {
    padding: '1rem',
    paddingBottom: '2rem',
    paddingTop: 0,
    minWidth: '18rem',
    width: '90vw',
    maxWidth: '32rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  margin: {
    margin: '1rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

}));

export default function SelectOrgDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();


  const {teamIds, setOpen, open, onSelect, createInstead} = props;
  const [loading, setloading] = useState(false);
  const [text, setText] = useState('');
  const state = useSelector((state) => state);
  const {user, userProfile} = useSelector((state)=>state.auth);
  const [owner, setOwner] = useState(user);
  const userId = user._id;
  const history = useHistory();


  const handleClose = () => {
    setOpen(false);
  };

  return (

    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>


      <div className={clsx(classes.row, classes.center, classes.margin)}>
        <div className={clsx(classes.row, classes.center)}>
          <Typography className={classes.margin}>
                        🏢
          </Typography>
          <Typography variant='button' >
            <b>Choose Org</b>
          </Typography>
        </div>


        <CreateBtn onClick={()=>{
          if (createInstead) {
            createInstead();
          }
        }}>
                    New Org
        </CreateBtn>


      </div>
      {loading?<LinearProgress />:null}

      {teamIds&&teamIds.length>0?<>
        {teamIds.map((teamId)=>{
          return <TeamCard teamId={teamId} onClick={()=>{
            onSelect(teamId);
          }}/>;
        })}
      </>:null}

    </Dialog>

  );
}
