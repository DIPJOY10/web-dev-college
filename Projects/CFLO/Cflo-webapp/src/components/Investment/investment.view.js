import React, { useState, useEffect } from 'react';
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
import { useInvestment } from './investment.hook';
import ApplyBtn from '../apply/apply.button';
import DescriptionText from '../styled/DataDisplay/description';
import TitleText from '../styled/DataDisplay/title';
import {
  useParams,
  useHistory,
} from 'react-router-dom';
import Map from '../styled/DataDisplay/map';
import Block from '../styled/DataDisplay/data.block';
import TagBlock from '../styled/DataDisplay/tag.block';
import AvatarBlock from '../styled/DataDisplay/avatarNameAndPostedAt';
import RoleView from '../roleMap/role.view';
import Divider from '@material-ui/core/Divider';
import Api from '../../helpers/Api';
import { setInvestments as setDashboardInvestment } from './investment.utils';
import { setInvestments as setFeedInvestment } from '../explore/feed.utils';
import ScheduleList from '../schedule/payment.list.view';
import RentComps from './rent.comp.table';
import SaleComps from './sale.comp.table';
import EditBtn from '../styled/actionBtns/edit.btn';

const useStyles = makeStyles((theme) => ({

  root: {
    flex: 1,
    marginTop: '6rem',
    marginBottom: '6rem',
  },

  paper: {
    flex: 1,
    maxWidth: '40rem',
    margin: '0.3rem',
    padding: '1rem',
  },

  title: {
    fontSize: 14,
    marginLeft: 15,
  },

  reviewChip: {
    height: '1.2rem',
    padding: 0,
    marginLeft: '0.3rem',
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
  memberAndRoleText: {
    margin: '1rem',
  },
}));

export default function InvestmentView(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const explore = useSelector((state) => state.explore);
  const dashboard = useSelector((state) => state.dashboard);
  // const { investmentDictionary } = explore;
  const { investmentDictionary, investmentCatDictionary } = dashboard;
  const { investmentId } = useParams();
  const {
    investment, isFeed,
  } = useInvestment(investmentId);

  // console.log(investment,' is the investment',investmentId)
  const history = useHistory();
  const roles = investment?.roles ? investment.roles : [];
  const rentComps = investment?.rentComps ? investment.rentComps : [];
  const saleComps = investment?.saleComps ? investment.saleComps : [];

  useEffect(() => {
    Api.post('investment/getDetails', {
      investmentId,
    }).then((investment) => {
      if (isFeed) {
        setFeedInvestment([investment], explore, dispatch);
      }
      else {
        setDashboardInvestment([investment], dashboard, dispatch);
      }
    });
  }, []);

  return (
    <div className={classes.root}>


      <div className={classes.rowDiv}>
        <AvatarBlock
          user={investment?.owner}
          subText={' published at '}
          showDate={true}
          time={investment?.publishedAt}
        />

        {isFeed ? <ApplyBtn parent={investmentId} parentModelName={'Investment'} /> :
          investment?.published ? null : <EditBtn
            onClick={() => {
              const path = '/dashboard/edit/investment/' + investmentId;
              history.push(path);
            }}
          />
        }
      </div>


      <TitleText
        text={investment?.title}
        minChar={15000}
      />

      <Divider flexItem />

      <div className={classes.rowDiv}>
        <TagBlock
          tagIds={investment?.propertyTypes}
          type={'Property'}
          name={'Asset Categories'}
        />

        <Divider orientation="vertical" flexItem />

        <Map location={investment?.location} />
      </div>

      <Divider flexItem />

      <div className={classes.rowDiv}>
        <div className={classes.rowDiv}>
          <Block
            name={'Project Size'}
            type='money'
            value={investment?.header?.size}
          />

          <Block
            name={'Raising'}
            type='money'
            value={investment?.header?.requirement}
          />

        </div>
        <div className={classes.rowDiv}>

          <Block
            name={'Target Hold'}
            value={investment?.header?.hold}
          />

          <Block
            name={'IRR'}
            value={investment?.header?.irr}
          />

        </div>
        <div className={classes.rowDiv}>
          <Block
            name={'Ticket Size'}
            value={investment?.header?.minTicket}
            type={'money'}
          />

          <Block
            name={'Activity'}
            value={investment?.activity}
          />


        </div>

      </div>


      <DescriptionText
        text={investment?.description}
        minChar={300}
      />

      <Typography className={classes.memberAndRoleText} variant='h6'>
        <b>Member and Roles</b>
      </Typography>

      {roles.map((role) => {
        return <RoleView
          role={role}
        />;
      })}


      <Typography className={classes.memberAndRoleText} variant='h6'>
        <b>Payment Schedule</b>
      </Typography>

      <ScheduleList
        scheduleId={investment?.schedule}
      />

      {rentComps.length > 0 ? <>
        <Typography className={classes.memberAndRoleText} variant='h6'>
          <b>Rent Comps</b>
        </Typography>
        <RentComps
          comps={rentComps}
        />
      </> : null}

      {saleComps.length > 0 ? <>
        <Typography className={classes.memberAndRoleText} variant='h6'>
          <b>Sale Comps</b>
        </Typography>
        <SaleComps
          comps={saleComps}
        />
      </> : null}

      <FilesViewer fileIds={investment.files} />

    </div>

  );
}

