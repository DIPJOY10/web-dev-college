import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { setJobs, setInvestments, setPosts } from './feed.utils';
import JobFeed from './job.feed';
import PostFeed from './post.feed';
import InvestmentFeed from './investment.feed';
import AddIcon from '@material-ui/icons/Add';
import CreateButton from '../styled/actionBtns/create.btn';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import ContractorIcon from '../../Assets/contractor.svg';
import PaymentSvg from '../../Assets/payment.svg';
import Menubar from '../appbar/menu.appbar';
import ChatIcon from '@material-ui/icons/Chat';
import Api from '../../helpers/Api';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    marginBottom: '4rem',
  },

  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'auto',
    width: '100%',
    maxWidth: '40rem',
    marginBottom: '10rem',
  },

  menuText: {
    color: '#424242',
    fontWeight: 600,
    height: '3rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    fontSize: 17,
  },

  paperText: {
    margin: '1rem',
  },
  svgSize: {
    display: 'flex',
    height: '40px',
    width: '30px',
  },
}));

const Explore = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const explore = useSelector((state) => state.explore);
  const [feedState, setFeedState] = useState('Invest');
  const history = useHistory();
  const location = useLocation();
  const pathname = location['pathname'];
  const isFeed = pathname.slice(1, 5) == 'feed' || pathname == '/';
  let Feed = JobFeed;

  switch (feedState) {
    case 'Mixed':
      Feed = JobFeed;
      break;

    case 'Jobs':
      Feed = JobFeed;
      break;

    case 'Invest':
      Feed = InvestmentFeed;
      break;

    case 'Forum':
      Feed = PostFeed;
      break;

    default:
      break;
  }


  useEffect(() => {
    Api.post('feed/get', {})
      .then((data) => {
        const {
          jobs,
          posts,
          investments,
        } = data;


        setJobs(jobs, explore, dispatch);
        setPosts(posts, explore, dispatch);
        setInvestments(investments, explore, dispatch);
      });
  }, []);

  return (
    <div className={classes.root}>
      {/* <Menubar
        navState={feedState}

        items={[
          {
            Icon: <img key={'payment'} className={classes.svgSize} src={PaymentSvg} />,
            text: 'Invest',
            onClick: ()=>{
              setFeedState('Invest');
            },
          },
          {
            Icon: <img key={'contractor'} className={classes.svgSize} src={ContractorIcon} />,
            text: 'Jobs',
            onClick: ()=>{
              setFeedState('Jobs');
            },
          },
          {
            Icon: <img key={'forum'} className={classes.svgSize} src={Forum} />,
            text: 'Forum',
            onClick: ()=>{
              setFeedState('Forum');
            },
          },
        ]}
      /> */}

      <Feed />
    </div>)
    ;
};

export default Explore;
