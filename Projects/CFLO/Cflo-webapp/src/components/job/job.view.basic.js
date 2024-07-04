import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import WorkIcon from '@material-ui/icons/Work';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import RoomIcon from '@material-ui/icons/Room';
import moment from 'moment';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import FilesViewer from '../file/Viewer/FilesViewer';
import ApplyBtn from '../apply/apply.button';
import DescriptionIcon from '@material-ui/icons/Description';
import StyleBtn from '../styled/actionBtns/create.btn';
import EditBtn from '../styled/actionBtns/edit.btn';
import AvatarBlock from '../styled/DataDisplay/avatarNameAndPostedAt';
import DescriptionText from '../styled/DataDisplay/description';
import TitleText from '../styled/DataDisplay/title';
import Map from '../styled/DataDisplay/map';
import TagBlock from '../styled/DataDisplay/tag.block';
import Block from '../styled/DataDisplay/data.block';
import PayType from '../styled/DataDisplay/payType';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import { useJob } from './job.hook';
import clsx from 'clsx';
import {
  useParams,
  useHistory,
} from 'react-router-dom';


const useStyles = makeStyles((theme) => ({

  root: {
    flex: 1,
    marginBottom: '6rem',
    paddingLeft: '2rem',
    [theme.breakpoints.only('xs')]: {
      paddingLeft: 0,
    },
  },

  paper: {
    flex: 1,
    maxWidth: '40rem',
    margin: '0.3rem',
    padding: '1rem',
  },

  paperText: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    maxWidth: '46rem',
    margin: '0.3rem',
    marginTop: '2rem',
    marginBottom: '2rem',
    padding: '1rem',
    color: '#616161',
  },

  paperTextRow: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 14,
    marginLeft: 15,
  },

  catChip: {
    backgroundColor: theme.palette.primary.light,
    height: '1.4rem',
    padding: 0,
    marginLeft: '0.3rem',
    color: 'white',
  },

  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  locDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '10rem',
    maxWidth: '10rem',
  },

  colDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  dataBlock: {
    maxWidth: '11rem',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  description: {
    marginLeft: '1rem',
    color: '#424242',
    fontWeight: '500',
  },
  dateFont: {
    fontSize: '2rem',
  },
}));

const JobViewBasic = ({ job, isFeed, setEdit }) => {
  const classes = useStyles();
  const history = useHistory();
  const [textFull, setTextFull] = useState(false);
  const dashboard = useSelector((state) => state.dashboard);
  const { jobCatDictionary } = dashboard;
  const jobId = job?._id;
  return (
    <div className={classes.root}>


      <div className={classes.rowDiv}>
        <AvatarBlock
          user={job?.owner}
          subText={' published at '}
          showDate={true}
          time={job?.publishedAt}
        />

        {isFeed ? <ApplyBtn parent={jobId} parentModelName={'Job'} /> : <EditBtn onClick={() => {
          const path = '/dashboard/edit/job/' + job?._id;
          history.push(path);
        }}
        />}
      </div>

      <div className={classes.rowDiv}>
        <TagBlock
          tagIds={job?.categories}
          type={'Jobs'}
          name={'Skills '}
        />

        <Map location={job?.location} />
      </div>


      <div className={classes.rowDiv}>
        <div className={clsx(classes.rowDiv, classes.dataBlock, classes.center)}>
          <span className={classes.dateFont}>
            🗓
          </span>

          <Block
            name={'Deadline'}
            value={job?.startDate}
            type={'date'}
          />
        </div>
        <Divider orientation="vertical" flexItem />
        <Block
          name={'Minimum Experience'}
          value={job?.experience + ' years'}
        />
        <Divider orientation="vertical" flexItem />
        <PayType parent={job} />
      </div>


      <TitleText
        text={job?.title}
        minChar={15000}
      />


      <DescriptionText
        text={job?.description}
        minChar={300}
      />


      <FilesViewer fileIds={job?.files} />


    </div>

  );
};

export default JobViewBasic;
