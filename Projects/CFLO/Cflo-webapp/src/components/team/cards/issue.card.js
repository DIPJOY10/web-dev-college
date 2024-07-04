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
import AssignmentIcon from '@material-ui/icons/Assignment';
import IconButton from '@material-ui/core/IconButton';
import CreateBtn from '../../styled/actionBtns/create.btn';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import IssueSvg from '../../../Assets/issue.svg';
import IssuePaperCard from '../../issue/issue.card';
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
    height: '35px',
    width: '35px',

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

  createBtnPaper: {
    marginLeft: '2rem',
    alignSelf: 'flex-end',

  },

}));

export default function IssueCard(props) {
  const classes = useStyles();
  const {
    teamId,
  } = props;
  const teamReducer = useSelector((state)=>state.team);
  const {
    teamDictionary,
  } = teamReducer;
  const team = teamDictionary[teamId];
  const issue = useSelector((state)=>state.issue);
  const issueIds = team?.issues?team?.issues:[];
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Paper onClick={()=>{

    }} className={classes.root} square >

      <div className={clsx(classes.row, classes.topRow)}>
        <img className={classes.svgSize} src={IssueSvg} />


        <Typography className={classes.title} color="textSecondary" >
                        Issue / Ticket
        </Typography>
        <Paper className={classes.createBtnPaper}>
          <ButtonBase className={classes.createBtn} onClick={()=>{
            if (team&&team._id) {
              history.push('/issue/'+ teamId+'/create');
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

      {team?.numIssues>0?
                  <ButtonBase className={classes.column} onClick={()=>{
                    if (team&&team._id) {
                      history.push('/issues/'+ teamId);
                    }
                  }}>
                    <>
                      {issueIds.slice(0, 3).map((issueId)=>{
                        return (
                          <IssuePaperCard issueId={issueId} size={'xs'}/>
                        );
                      })}
                    </>
                  </ButtonBase>:<>

                    <div className={classes.row}>

                      <ButtonBase onClick={()=>{
                        if (team&&team._id) {
                          history.push('/issues/'+ teamId);
                        }
                      }}>
                        <Typography variant="body2" component="p">
                            Create different <b>pipelines</b>  to track <b>issues, client tickets, change orders etc</b> and keep your team on the same page.
                        </Typography>
                      </ButtonBase>
                    </div>


                  </>}
    </Paper>
  );
}
