import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useLocation} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import moment from 'moment';
import {
  Typography,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CreateBtn from '../../styled/actionBtns/create.btn';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import Chat from '../../../Assets/chat.svg';
import DiscussionPaperCard from '../../discussion/discussion.card';
import {handleGoogleLogin} from '../../auth/auth.utils';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginLeft: '1rem',
    width: '16rem',
    maxWidth: '16rem',
    display: 'flex',
    padding: '1rem',
    flexDirection: 'column',
    minHeight: '8rem',
    marginTop: '1rem',
    textAlign: 'center',
  },

  svgSize: {
    display: 'flex',
    height: '30px',
    width: '30px',
  },

  header: {
    textAlign: 'center',
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
  },


  topRow: {
    marginBottom: '1rem',
  },

  title: {
    marginLeft: '1rem',
  },

  createBtn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',

  },

  textDefault: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  createBtnPaper: {
    marginLeft: '1.3rem',
    alignSelf: 'flex-end',

  },

}));

export default function DiscussionCard(props) {
  const classes = useStyles();
  const {
    teamId,
  } = props;
  const teamReducer = useSelector((state)=>state.team);
  const {
    teamDictionary,
  } = teamReducer;
  const team = teamDictionary[teamId];
  const discussion = useSelector((state)=>state.discussion);
  const discussionIds = team?.discussions?team?.discussions:[];
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Paper onClick={()=>{

    }} className={classes.root} square >

      <div className={clsx(classes.row, classes.topRow)}>
        <img key={'timeline'} className={classes.svgSize} src={Chat} />
        <Typography className={classes.title} color="textSecondary" >
                        Discussion
        </Typography>
        <Paper className={classes.createBtnPaper}>
          <ButtonBase className={classes.createBtn} onClick={()=>{
            if (team&&team._id) {
              history.push('/discussion/'+ teamId+'/create');
            }
            else {
              handleGoogleLogin(dispatch);
            }
          }}>
            <Typography>
                                Add
            </Typography>

            <AddIcon />

          </ButtonBase>
        </Paper>

      </div>

      {discussionIds.length>0?
           <ButtonBase className={classes.column} onClick={()=>{
             if (team&&team._id) {
               history.push('/discussions/'+ teamId);
             }
           }}>
             <>
               {discussionIds.slice(0, 3).map((discussionId)=>{
                 return (
                   <DiscussionPaperCard discussionId={discussionId} size={'xs'}/>
                 );
               })}
             </>
           </ButtonBase>:
            <>


              <ButtonBase className={classes.textDefault}>
                <Typography variant="body2" component="p">
                            Create questions and discussions
                </Typography>
              </ButtonBase>


            </>}
    </Paper>
  );
}
