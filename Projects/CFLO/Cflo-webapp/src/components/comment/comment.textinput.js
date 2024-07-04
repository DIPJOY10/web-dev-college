import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import {useHistory} from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import InputBase from '@material-ui/core/InputBase';
const {user, userProfile} = useSelector((state)=>state.auth);

const useStyles = makeStyles({
  root: {

  },

  colDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },


  title: {
    fontSize: 14,
  },

});

export default function CommentCreate(props) {
  const {text, setText} = props;

  const classes = useStyles();
  const {colDiv, rowDiv} = classes;

  return (
    <Card className={classes.root} variant="outlined">


      <CardContent>

        <div className={rowDiv}>
          <Avatar alt={user.displayName} src={user?.displayPicture?.thumbUrl} />
          <div className={colDiv}>
            <Typography color="textSecondary" gutterBottom>
              {user?.displayName}
            </Typography>
            <InputBase
              multiline
              rowsMax={2}
              value={text}
              placeholder={'Type your comment here'}
              onChange={(event)=>setText(event.target.value)}
              className={classes.titleInput}
            />

          </div>

        </div>

      </CardContent>


    </Card>
  );
}
