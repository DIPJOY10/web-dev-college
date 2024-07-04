import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { usePost } from './post.hook';
import Paper from '@material-ui/core/Paper';
import Description from '../../styled/DataDisplay/description';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '50rem',
    margin: '0.3rem',
    padding: '1rem',
    paddingBottom: '0.2rem',
  },

  svgSize: {
    display: 'flex',
    height: '40px',
    width: '40px',
    borderRadius: '20px',
    marginRight: '10px',
  },

  mapSize: {
    display: 'flex',
    height: '30px',
    width: '30px',
    marginTop: '10px',
  },

  title: {
    fontSize: 14,
    marginLeft: 15,
  },

  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  colDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  postedByText: {
    fontSize: '0.8rem',
  },

  postedAtText: {
    fontSize: '0.7rem',
  },
}));

export default function PostCard(props) {
  const classes = useStyles();

  const { postId, setPostId, min } = props;
  const { post, isFeed } = usePost(postId);
  const history = useHistory();
  const parent = post?.profile?.parent;
  const name = parent?.displayName;
  const dP = parent?.displayPicture;
  const avatarSrc = dP?.thumbUrl ? dP.thumbUrl : dP?.url;

  if (post && post?._id) {
    return (
      <Paper
        onClick={() => {
          if (isFeed) {
            const path = '/feed/post/' + postId;
            history.push(path);
          }
        }}
        className={classes.root}
        square
      >
        <div className={classes.rowDiv}>
          <div className={classes.colDiv}>
            <div className={classes.rowDiv}>
              <div className={classes.rowDiv}>
                <img key={'post'} className={classes.svgSize} src={avatarSrc} />
                <div className={classes.colDiv}>
                  <Typography variant="body2" component="p">
                    <b>{post?.title}</b>
                  </Typography>
                  <Typography className={classes.postedByText}>posted by {name}</Typography>
                  <Typography className={classes.postedAtText}>{moment(post?.createdAt).fromNow()}</Typography>
                </div>
              </div>
            </div>

            {post?.description.length > 200 ? post?.description.slice(0, 200).split(' ').slice(0, -1).join(' ') + ' ...' : post?.description}
          </div>
        </div>
      </Paper>
    );
  }
  else {
    return null;
  }
}
