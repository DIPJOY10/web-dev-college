import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import BranchSvg from '../projects/git-branch.svg';
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  card: {
    maxWidth: 250,
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
  const {project, tab, setTab} = props;
  const {card, tabSelected} = classes;

  return (
    <Card className={clsx(card, tab==='Folders'&&tabSelected)} variant="outlined">

      <CardActionArea onClick={()=>{
        setTab('Folders');
      }}>
        <CardContent>

          <div className={classes.cardDiv}>

            <IconButton>
              <Avatar key={'Folders'} className={classes.svgStyle} src={BranchSvg}></Avatar>
            </IconButton>

            <Typography className={classes.cardText} variant="body2" component="p">
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Project Folders
              </Typography>
                            Type - Contruction, legal, Procurement etc
            </Typography>
          </div>

        </CardContent>
      </CardActionArea>

    </Card>
  );
}
