import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Api from '../../helpers/Api';
import ChatMsgSlack from '../chat/ChatMsgSlack';
import {getCommentByIds} from './comment.utils';
import CommentCreate from './comment.create';
import CommentUpdate from './comment.update';
import CommentCard from './comment.card';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    overflow: 'auto',
    marginBottom: '1rem',
    marginTop: '1rem',
  },
  marginTop: {
    flex: 1,
    marginTop: '1rem',
  },
}));

const CommentList = (props)=>{
  const {
    commentIds,
    parent,
    parentModelName,
  } = props;
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const commentReducer = useSelector((state)=>state.comment);
  const {commentDictionary} = commentReducer;

  useEffect(() => {
    if (commentIds&&commentIds.length>0) {
      const getCommentIds = [];
      commentIds.map((commentId)=>{
        const comment = commentDictionary[commentId];
        // console.log(comment);
        if (commentId) {
          getCommentIds.push(commentId);
        }
        else {

        }
      });

      getCommentByIds(commentIds, commentReducer, dispatch)
          .then((comments)=>{
            // console.log(comments,' is the comments')

          });
    }
  }, [commentIds]);

  return (
    <div className={classes.root}>
      {editMode? <CommentUpdate
        commentId={selectedId}
        setEditMode={setEditMode}
      />:
            <CommentCreate
              parent={parent}
              parentModelName={parentModelName}
            />}
      <div className={classes.marginTop}>
        {commentIds&&commentIds.length>0&&commentIds.map((commentId)=>{
          const comment = commentDictionary[commentId];
          if (comment&&comment?._id) {
            return <CommentCard
              commentId={commentId}
              setEditMode={setEditMode}
              setSelectedId={setSelectedId}
            />;
          }
        })}
      </div>


    </div>
  );
};

export default CommentList;
