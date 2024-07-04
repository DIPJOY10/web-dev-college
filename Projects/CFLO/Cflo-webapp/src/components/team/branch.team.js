import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Api from '../../helpers/Api';
import teamUtils from './team.utils';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import WorkIcon from '@material-ui/icons/Work';
import clsx from 'clsx';

const {handleMemberProfiles} = teamUtils;


const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  card: {
    maxWidth: 200,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },

  tabSelected: {
    backgroundColor: '#e1f5fe',
  },

  cardDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 0,
  },

  cardText: {
    textAlign: 'center',
    marginLeft: 5,
  },

}));

export default function BranchTeamCard(props) {
  const classes = useStyles();
  const {branch, tab, setTab} = props;
  const {teamDictionary} = useSelector((state) => state.team);
  const teamId = branch.team;
  const team = teamDictionary[teamId];
  const participants = team?.participants?team.participants:[];
  const {memberDictionary} = handleMemberProfiles(team);

  return (
    <Card className={clsx(classes.card, tab==='Branch'&&classes.tabSelected)} variant="outlined">

      <CardActionArea onClick={()=>{
        setTab('Branch');
      }}>
        <CardContent>

          <div className={classes.cardDiv}>

            <IconButton>
              <AvatarGroup>
                {participants.map((memberId)=>{
                  const member = memberDictionary[memberId];

                  return (
                    <Avatar key={memberId} alt={member?.displayName} src={member?.displayPicture?.thumbUrl} />
                  );
                })}

              </AvatarGroup>
            </IconButton>

            <Typography className={classes.cardText} variant="body2" component="p">
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                {branch.displayName}
              </Typography>
                        Manage Branch settings
            </Typography>
          </div>

        </CardContent>
      </CardActionArea>

    </Card>
  );
}
