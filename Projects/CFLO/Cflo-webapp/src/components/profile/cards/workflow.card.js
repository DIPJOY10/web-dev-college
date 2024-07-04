import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useLocation} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import moment from 'moment';
import {
  Chip,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import IconButton from '@material-ui/core/IconButton';
import CreateBtn from '../../styled/actionBtns/create.btn';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import IssueSvg from '../../../Assets/issue.svg';
import IssueItemCard from './issue.item.card';
import {handleGoogleLogin} from '../../auth/auth.utils';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginLeft: '1rem',
    width: '16rem',
    maxWidth: '16rem',
    minWidth: '16rem',
    display: 'flex',
    padding: '1rem',
    flexDirection: 'column',
    minHeight: '8rem',
    marginTop: '1rem',
    textAlign: 'center',
    cursor: "pointer"
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
    fontWeight: '700'
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

export default function WorkFlowCard(props) {
  const classes = useStyles();
  const {
    profileId, issues, loading
  } = props;

  const history = useHistory()
  const dispatch  = useDispatch()

  return (
    <Paper onClick={()=>{
        history.push('/issues/profile/'+ profileId);
    }} className={classes.root} square >

      <div className={clsx(classes.row, classes.topRow)}>
        <img className={classes.svgSize} src={IssueSvg} />


        <Typography className={classes.title}>
              Project Management <Chip
          size="small"
          label="In Progress"
          clickable
          color="primary"
        />
        </Typography>
        {/* <Paper className={classes.createBtnPaper}>
          <ButtonBase className={classes.createBtn} onClick={()=>{
            if (profileId) {
              
                var path = '/issues/profile/'+ profileId;
                history.push(path)

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
        </Paper> */}

      </div>

      {loading?<LinearProgress loading={loading} />:<>
        {issues?.length>0?
                  <ButtonBase className={classes.column} onClick={()=>{


                  }}>
                    <>
                      {issues.slice(0, 3).map((issue)=>{
                        return (
                          <IssueItemCard profileId={profileId} issue={issue} size={'xs'}/>
                        );
                      })}
                    </>
                  </ButtonBase>:<>

                    <div className={classes.row}>

                      <ButtonBase onClick={()=>{
                        history.push('/issues/profile/'+ profileId);
            
                      }}>
                        <Typography variant="body2" component="p">
                            Create different workflows to track issues, client tickets, change orders etc and keep your team on the same page.
                        </Typography>
                      </ButtonBase>
                    </div>


                  </>}
      </>}
 
    </Paper>
  );
}
