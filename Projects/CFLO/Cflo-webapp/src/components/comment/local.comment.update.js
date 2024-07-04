import React, {useState, useEffect} from 'react';
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
import {ButtonBase} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import CreateBtn from '../styled/actionBtns/create.btn';
import {update} from './comment.utils';

const useStyles = makeStyles({
  root: {
    flex: 1,
    padding: '1rem',

  },

  rowRev: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row-reverse',
  },

  colDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1rem',
  },

  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },


  title: {
    fontSize: 14,
  },

  titleInput: {
    flex: 1,
  },

  cancelBtn: {

    borderRadius: '0.4rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },

});

export default function CommentUpdate(props) {
  const {commentId, setEditMode} = props;
  const commentReducer = useSelector((state) => state.comment);
  const {commentDictionary} = commentReducer;
  const comment = commentDictionary[commentId];
  // console.log(commentDictionary,commentId,comment,' is comment everything')
  const oldText = comment?.text?comment.text:'';
  const [text, setText] = useState(oldText);
  const {parent, parentModelName} = props;
  const {user, userProfile} = useSelector((state)=>state.auth);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const classes = useStyles();
  const {colDiv, rowDiv, rowRev, cancelBtn} = classes;
  const userId = user._id;

  useEffect(() => {
    const newComment = commentDictionary[commentId];
    // console.log(commentDictionary,commentId,comment,' is comment everything')
    const newText = comment?.text?comment.text:'';
    setText(newText);
  }, [commentDictionary]);

  const _updateComment = ()=>{
    const commentObject = {
      _id: commentId,
      text,
    };

    update(commentObject, state, dispatch)
        .then((res)=>{
          setEditMode(false);
        });
  };

  return (
    <Paper className={classes.root} variant="outlined">


      <div className={rowDiv}>
        <Avatar alt={user.displayName} src={user?.displayPicture?.thumbUrl} />
        <div className={colDiv}>
          <Typography color="textSecondary" gutterBottom>
            {user?.displayName}
          </Typography>
          <div className={rowDiv}>
            <InputBase
              multiline
              rowsMax={2}
              value={text}
              placeholder={'Type your comment here'}
              onChange={(event)=>setText(event.target.value)}
              className={classes.titleInput}
              autoFocus
            />

          </div>
          <div className={rowRev}>
            <CreateBtn onClick={()=>{_updateComment();}}>
                            Update
            </CreateBtn>
            <ButtonBase className={cancelBtn} onClick={()=>{setEditMode(false);}} >
              <Typography>CANCEL</Typography>
            </ButtonBase>

          </div>
        </div>

      </div>

    </Paper>
  );
}
