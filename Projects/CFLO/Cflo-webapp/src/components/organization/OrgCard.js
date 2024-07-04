import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useSelector} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import {useParams, useHistory} from 'react-router-dom';
import {Paper} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    margin: '1rem',
    maxWidth: '30rem',
  },

  topRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  title: {
    fontSize: 14,
  },

});

export default function OrgCard(props) {
  const {orgId} = props;
  const history = useHistory();
  const classes = useStyles();
  const state = useSelector((state) => state);
  const {
    auth, team,
  } = state;
  const {user, organizationIds, organizationDictionary} = auth;
  const {
    teamDictionary,
  } = team;

  const org = organizationDictionary[orgId];
  const teamId = org.team;
  const orgTeam = teamDictionary[teamId];


  return (
    <Paper className={classes.root} variant="outlined">
      <CardActionArea onClick={()=>{
        const path = '/organizations/'+ teamId; ;
        history.push(path);
      }}>
        <CardContent>
          <div className={classes.topRow}>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                          Organization
            </Typography>
            <Chip
              color={'#8bc34a'}
              label={org.public?'Public':'Private'}
            />
          </div>

          <Typography>
            {org.displayName}
          </Typography>
        </CardContent>
      </CardActionArea>


    </Paper>
  );
}
