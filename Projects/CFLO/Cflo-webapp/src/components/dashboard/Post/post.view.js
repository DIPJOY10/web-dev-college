import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useParams} from 'react-router-dom';
import moment from 'moment';
import {usePost} from './post.hook';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import AvatarBlock from '../../styled/DataDisplay/avatarPostedFromNow';
import DescriptionText from '../../styled/DataDisplay/description';
import TitleText from '../../styled/DataDisplay/title';
import FilesViewer from '../../file/Viewer/FilesViewer';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '6rem',
    marginBottom: '5rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));
export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const {postId} = useParams();
  const dispatch = useDispatch();
  const {post, isFeed} = usePost(postId);
  const parent = post?.profile?.parent;
  const name = parent?.displayName;
  const dP = parent?.displayPicture;

  const {
    root, row, col,
  } = classes;

  return (
    <div className={root}>
      <AvatarBlock
        user={parent}
        subText={post?.title}
        time={post.createdAt}
      />

      <DescriptionText
        text={post?.description}
        minChar={300}
      />

      <FilesViewer fileIds={post?.files} />
    </div>
  );
}
