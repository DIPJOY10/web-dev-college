import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import WorkIcon from '@material-ui/icons/Work';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';
import moment from 'moment';
import { useInvestment } from './investment.hook';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import ContractorIcon from '../../Assets/contractor.svg';
import BankIcon from '../../Assets/bank.svg';
import GoogleMap from '../../Assets/google-maps.png';
import DescriptionText from '../styled/DataDisplay/description';
import Tags from '../styled/DataDisplay/tags.view';
import Block from '../styled/DataDisplay/data.block';
import ReactHtmlParser from "react-html-parser";
import IconButton from '@material-ui/core/IconButton';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Api from '../../helpers/Api';
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  // root: {
  //   flex: 1,
  //   maxWidth: '50rem',
  //   margin: '0.3rem',
  //   padding: '1rem',
  //   paddingBottom: '0.2rem',
  // },

  // svgSize: {
  //   display: 'flex',
  //   height: '40px',
  //   width: '40px',
  //   borderRadius: '20px',
  //   marginRight: '10px',
  // },

  // mapSize: {
  //   display: 'flex',
  //   height: '30px',
  //   width: '30px',
  //   marginTop: '10px',
  // },

  // title: {
  //   fontSize: 14,
  //   marginLeft: 15,
  // },

  // reviewChip: {
  //   height: '1.2rem',
  //   padding: 0,
  //   marginLeft: '0.3rem',
  // },

  // catChip: {
  //   backgroundColor: theme.palette.primary.light,
  //   height: '1.4rem',
  //   padding: 0,
  //   marginLeft: '0.3rem',
  //   color: 'white',
  // },

  // rowDiv: {
  //   flex: 1,
  //   display: 'flex',
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  // },

  // rowDivEvenly: {
  //   flex: 1,
  //   display: 'flex',
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justityContent: 'space-evenly',
  // },

  // locDiv: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '10rem',
  //   maxWidth: '10rem',

  //   [theme.breakpoints.down('xs')]: {
  //     flexDirection: 'column',
  //     width: '8rem',
  //     maxWidth: '8rem',
  //   },
  // },

  // colDiv: {
  //   flex: 1,
  //   display: 'flex',
  //   flexDirection: 'column',
  // },
  root: {
    flex: 1,
    display: 'flex',
    width: '75%',
    // minHeight: '23vh',
    margin: '1vh',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    // border: '1px solid red',
    // padding: '1rem',

    // paddingBottom: '0.2rem',
  },
  root_Container: {
    width: '100%',
    // minHeight: '100%',
    // border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    // justifyContent: 'center',

  },
  parent_Container: {
    width: '100%',
    // minHeight: '80%',
    // border: '1px solid green',
    padding: '2vh 1vw',
    [theme.breakpoints.down('xs')]: {
      padding: '2vh 2vw',
    },

  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    // border: '1px solid red',
    alignItems: 'flex-start'

  },
  img: {
    height: '40px',
    width: '40px',
    borderRadius: '20px',
    marginRight: '10px',
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
  },
  details: {
    // border: '1px solid blue',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '2vh 3.3vw 0 3.3vw'
  },
  projectSize: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  targetHold: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

  },
  irr: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

  },
  ticketSize: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

  },
  description: {
    margin: '1vh 0 0 3.3vw',
    [theme.breakpoints.down('xs')]: {
      margin: '2vh 0 0 3.5vw'
    },
  },
  published: {
    width: '100%',
    backgroundColor: '#f2f2f0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1vh 1vw',
    [theme.breakpoints.down('xs')]: {
      padding: '1vh 2vw',
    },
  }
}));

export default function InvestmentCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const profile = user?.profile;
  const userId = user?._id;
  const { investmentCatDictionary } = dashboard;
  const { investmentId, page } = props;
  const { investment, isFeed } = useInvestment(investmentId);

  const history = useHistory();
  console.log(investment, "Inv");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    Api.post('investment/getSavedInvestments', {
      profile, user
    }).then((res) => {
      for (const values of Object.values(res)) {
        if (values?.parent === investmentId)
          setIsSaved(true);
      }
      // console.log(savedIds, 'savedJobs');
      // }
    })
  }, [profile, user, setIsSaved])

  const saveInvestment = async () => {
    setIsLoading(true)
    const save = await Api.post("save/create", {
      parent: investment?._id,
      parentModelName: "Investment",
      user,
      profile,
    });
    console.log("investmentSave", save);
    if (save.save) {
      setIsSaved(true);
      dispatch({
        type: "AddApiAlert",
        payload: {
          success: true,
          message: "Investment is saved successfully",
        },
      });
      setIsLoading(false);
      // setBtnComponentState(<BookmarkBorderIcon />);
    } else {
      setIsSaved(false);
      dispatch({
        type: "AddApiAlert",
        payload: {
          success: false,
          message: "Investment unsaved",
        },
      });
      setIsLoading(false);
      // setBtnComponentState(<BookmarkIcon />);
    }
  }
  if (investment != undefined)
    return (
      <Paper
        className={classes.root}
        square
      >
        <div className={classes.root_Container}>
          <div className={classes.parent_Container}
            onClick={() => {
              if (isFeed) {
                const path = '/feed/investment/' + investmentId;
                history.push(path);
              }
              else {
                if (investment?.published) {
                  console.log(investment, "This is the investment");
                  const path = '/dashboard/investment/apply/' + investmentId;
                  // const path = '/dashboard/investment/manage/' + investmentId;
                  history.push(path, { state: investmentId });
                }
                else {
                  const path = '/dashboard/edit/investment/' + investmentId;
                  history.push(path);
                }
              }
            }}
          >
            {/* <h1>Parent Container</h1> */}
            <div className={classes.titleContainer}>
              <img key={'investment'} className={classes.img} src={investment?.owner?.parent?.displayPicture?.thumbUrl} />
              <div className={classes.title}>
                <Typography variant="h6">{investment?.title}</Typography>
                <Typography variant="body2">{`${investment?.owner?.parent?.displayName} - ${investment?.location?.name}`}</Typography>
              </div>
            </div>
            <div className={classes.description}>
              <Typography
                variant="body2"
              // component="p"

              >
                {ReactHtmlParser(
                  investment?.description?.length > 200 ?
                    investment?.description.slice(0, 200).split(' ').slice(0, -1).join(' ') + ' ...' :
                    investment?.description
                )}
              </Typography>

            </div>
            <div className={classes.details}>
              <div className={classes.projectSize}>
                <Typography variant="body2">Project Size</Typography>
                <Typography variant="subtitle2">{`$${investment?.header?.size}`}</Typography>
              </div>
              <div className={classes.targetHold}>
                <Typography variant="body2">Target Hold</Typography>
                <Typography variant="subtitle2">{`${investment?.header?.hold} months`}</Typography>
              </div>
              <div className={classes.irr}>
                <Typography variant="body2">IRR</Typography>
                <Typography variant="subtitle2">{investment?.header?.irr}</Typography>
              </div>
              <div className={classes.ticketSize}>
                <Typography variant="body2">Ticket Size</Typography>
                <Typography variant="subtitle2">{`$${investment?.header?.minTicket}`}</Typography>
              </div>
            </div>
            {/* <div className={classes.skills}>
              {investment?.categories.map((categories) => {
                return <Chip label={categories?.name} size="small" variant="outlined" style={{ margin: '0 .5vw 1vh 0' }} />;
              })}
            </div> */}

          </div>
          <div className={classes.published}>
            <div>
              <Typography variant="caption">Posted on {moment(investment?.publishedAt).format('DD MMM YYYY')}</Typography>
            </div>
            {page === "Applied" ? null : <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 'fit-content', width: 'fit-content' }} onClick={saveInvestment}>
              {loading ? <CircularProgress size={25} /> : <><IconButton size="small">
                {!isSaved ? (
                  <BookmarkBorderIcon />
                ) : (
                  <BookmarkIcon />
                )}
              </IconButton>
                <Typography variant="subtitle1">{isSaved ? 'Saved' : 'Save'}</Typography></>}
            </div>}

          </div>
        </div>


      </Paper >
    );
  else
    return null;
}
