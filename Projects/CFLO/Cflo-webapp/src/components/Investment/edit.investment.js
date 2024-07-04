import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import ProfileSelect from '../styled/profile.select';
import GooglePlace from '../google.places';
import Api from '../../helpers/Api';
import TitleInput from '../styled/title.input';
import PaperOptionCard from '../styled/paper.option.card';
import DescriptionInput from '../styled/description.input';
import clsx from 'clsx';
import Header from './investment.header';
import RentComps from './rent.comps';
import SaleComps from './sale.comps';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { useParams } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepButton from '@material-ui/core/StepButton';
import RoleView from './investment.role';
import Topbar from './topbar';
import { useInvestment } from './investment.hook';
import CreateBtn from '../styled/actionBtns/create.btn';
import HandlePropCat from '../styled/handle.prop.cat';
import PSEdit from '../schedule/payment.schedule.edit';
import { setPaymentS } from '../schedule/schedule.utils';
import EditBtn from '../styled/actionBtns/edit.btn';
import RoomIcon from '@material-ui/icons/Room';
import useGetAdminProfiles from '../profile/useGetAdminProfiles';
import ProfileAppbar from '../profile/profile.appbar';
import ChooseDialog from '../choose';
import UserListItem from '../choose/user.list.item';
import configObject from '../../config/index';
import { Paper, useMediaQuery } from '@material-ui/core';
import Divider from "@material-ui/core/Divider"
import { getPropertyType } from '../ProjectAnalysis/api.call';
import DoneIcon from "@material-ui/icons/Done";
import ReactHtmlParser from "react-html-parser";
const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      // width: '50%',
      // border: '1px solid red'
    },
  },
  jobBtn: {
    borderRadius: "5vw",
    width: "15vw",
    height: "5vh",
    border: "2px solid",
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  divider: {
    width: '100%',
    margin: '2vh 0',
  },

  numInputRow: {
    width: '17rem',
    maxWidth: '17rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  numInputBox: {
    width: '8rem',
    maxWidth: '8rem',
    margin: '0.5rem',
  },
  center: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subject: {
    alignItems: 'center', width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  }
}));

export default function EditInvestment(props) {
  const DateNow = new Date();
  const [lastUpdated, setLastUpdated] = useState(DateNow);
  const [changePending, setChangePending] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const history = useHistory();
  const dispatch = useDispatch();
  const { investmentId } = useParams();
  const {
    adminProfiles
  } = useGetAdminProfiles()
  // const { adminProfiles } = props;
  const [activeStep, setActiveStep] = React.useState(0);

  const scheduleReducer = useSelector((state) => state.schedule);
  const { user } = useSelector((state) => state.auth);
  const dashboard = useSelector((state) => state.dashboard);
  const { investmentDictionary } = dashboard;

  const investment = investmentDictionary[investmentId];
  const oldOwner = investment?.owner?.parent ? investment?.owner?.parent : user;
  const oldTitle = investment?.title ? investment?.title : '';
  const oldLocation = investment?.title ? investment?.location : null;
  const locationEditVal = oldLocation ? false : true;
  const oldDescription = investment?.description ? investment?.description : '';
  const oldActivity = investment?.activity ? investment?.activity : 'Construction';

  const oldHeader = investment?.header ?
    investment?.header :
    {
      requirement: 0,
      size: 100000,
      irr: 10.2,
      hold: '10 months',
      minTicket: 1000,
    };

  const oldPropertyTypes = investment?.propertyTypes ? investment?.propertyTypes : [];
  const oldRentComps = investment?.rentComps ? investment?.rentComps : [];
  const oldSaleComps = investment?.saleComps ? investment?.saleComps : [];

  const [owner, setOwner] = useState(oldOwner);
  console.log(owner, "InvestOwner")
  const [title, setTitle] = useState(oldTitle);
  const [description, setDescription] = useState(oldDescription);
  const [activity, setActivity] = useState(oldActivity);
  const [header, setHeader] = useState(oldHeader);
  const [location, setLocation] = useState(oldLocation);
  const [locationEdit, setLocationEdit] = useState(locationEditVal);
  const [propertyTypes, setPropertyTypes] = useState(oldPropertyTypes);
  const [rentComps, setRentComps] = useState(oldRentComps);
  const [saleComps, setSaleComps] = useState(oldSaleComps);
  const oldSubject = investment?.subject ? investment?.subject : null;
  const [subject, setSubject] = useState(oldSubject)
  const [isDisabled, setIsDisabled] = useState(true);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const { setInvestments } = useInvestment();

  const { } = useSelector((state) => state);

  const { root, row, col } = classes;

  const steps = ['Basic', 'Schedule', 'Comps (Optional)'];

  const updateApi = () => {
    Api.post('investment/update', {
      _id: investmentId,
      owner: owner?.profile,
      ownerModelName: owner?.model,
      header,
      title,
      description,
      activity,
      location,
      propertyTypes,
      rentComps,
      saleComps,
      subject: subject?._id,
    }).then((investmentNew) => {
      setInvestments(
        [
          {
            ...investment,
            owner: owner,
            ownerModelName: owner?.model,
            header,
            title,
            description,
            activity,
            location,
            propertyTypes,
            rentComps,
            saleComps,
            subject: subject?._id,
          },
        ],
        dashboard,
        dispatch,
      );
    });
  };
  useEffect(() => {
    if (title?.length > 3 && description?.length > 3 && owner && subject) {
      console.log(ReactHtmlParser(description), "Desc")
      setIsDisabled(false);
    }
    else {
      console.log(ReactHtmlParser(description), "Desc")
      setIsDisabled(true);
    }
  }, [investment])
  useEffect(() => {
    const timeNow = new Date();

    if (investment?.owner) {
    }
    else {
      updateApi();
    }

    if (timeNow - lastUpdated > 500) {
      setLastUpdated(timeNow);
      updateApi();
    }
  }, [owner, header, title, description, activity, location, propertyTypes, rentComps, saleComps, subject]);
  useEffect(() => {
    getPropertyType()
      .then((data) => {
        console.log(data, "Property Types")
        // setPropertyTypes(Object.keys(data));
      })
  }, [])
  // useEffect(()=>{

  // },[description,reviewData,setReviewData])

  // useEffect(() => {
  //     Api.post('schedule/payment/create',{
  //         parent:investmentId,
  //         parentModelName:'Investment'
  //     }).then(schedule=>{
  //         Api.post('investment/update',{
  //             _id:investmentId,
  //             schedule:schedule._id
  //         }).then(investmentNew=>{
  //                 setPaymentS([schedule],scheduleReducer,dispatch)
  //                 setInvestments([{
  //                     ...investment,
  //                         schedule:schedule._id,
  //                 }], dashboard, dispatch );

  //         })

  //     })
  // }, [])

  const getStepContent = (step) => {
    switch (step) {
      case 'Basic':
        return (
          <div className={classes.col}>
            <ProfileSelect
              owner={owner}
              adminProfiles={adminProfiles}
              displayOwner={true}
              title={'Create Investment As'}
              type={"Investment"}
              onChange={(value) => {
                setOwner(value);
                console.log('valueisOwner ', value)
              }}
              placeholder={'Investment proposal owner'}

            />

            <TitleInput title={title} placeholder={'Wall St. Office Remodeling'} isMobile={isMobile} setTitle={(title) => {
              setTitle(title);

            }} />

            <DescriptionInput description={description} placeholder={'Investment Brief'} setDescription={setDescription}
              isMobile={isMobile} />

            <div className={isMobile ? classes.col : classes.row}>
              <PaperOptionCard
                title={'Construction'}
                text={'Ground up development'}
                selected={activity == 'Construction'}
                onClick={() => {
                  setActivity('Construction');
                }}
              />

              <PaperOptionCard
                title={'Remodeling'}
                text={'Fix and Flip projects'}
                selected={activity == 'Remodeling'}
                onClick={() => {
                  setActivity('Remodeling');
                }}
              />
            </div>
            <div style={{ margin: '2vh 0' }}>
              <Header investmentId={investmentId} header={header} setHeader={setHeader} isMobile={isMobile} />
            </div>
            {locationEdit ? (
              <>
                <div className={row}>
                  <div className={clsx(row, classes.numInputRow)}>
                    <GooglePlace setLocation={(location) => setLocation(location)} />
                  </div>
                  {location ? (
                    <IconButton
                      onClick={() => {
                        setLocationEdit(false);
                      }}
                      className={classes.editButton}
                    >
                      <ClearIcon />
                    </IconButton>
                  ) : null}
                </div>
              </>
            ) : (
              <div className={row}>
                <RoomIcon />
                <div className={clsx(row, classes.numInputRow)}>
                  <Typography>{location.name}</Typography>
                </div>

                <EditBtn
                  onClick={() => {
                    setLocationEdit(true);
                  }}
                ></EditBtn>
              </div>
            )}

            <HandlePropCat propertyTypes={propertyTypes} setPropertyTypes={setPropertyTypes} />
            <div className={col}>
              <div className={clsx(row, classes.subject)}
              >
                {subject?._id ? <UserListItem entity={subject?.parent} /> :
                  <Typography className={row}>
                    Choose Subject
                  </Typography>
                }
                {/* <div className={row}> */}
                <ChooseDialog
                  choosen={subject}
                  setChoosen={setSubject}
                />
                {/* </div> */}
              </div>

              {subject?.parentModelName == 'Project' ?
                <Paper className={classes.paperStyle} onClick={() => {
                  const url = configObject.BASE_URL + 'analysis/' + subject.parent.team
                  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
                  if (newWindow) newWindow.opener = null;
                }}>
                  To update the Project details, click
                  here. Incomplete project description will lead to removal of your job
                  post
                </Paper>
                : null}
            </div>

            <div>
              <CreateBtn
                onClick={() => {
                  updateApi();
                  // setActiveStep(1);
                }}
              >
                Save
              </CreateBtn>
            </div>
            <RoleView investmentId={investmentId} setActiveStep={setActiveStep} />

          </div>

        );

      // case 'Member And Roles':
      //   return <RoleView investmentId={investmentId} setActiveStep={setActiveStep} />;

      case 'Schedule':
        return <PSEdit scheduleId={investment?.schedule} isMobile={isMobile} />

      case 'Comps (Optional)':
        return (
          <>
            <RentComps comps={rentComps} setComps={setRentComps} setActiveStep={setActiveStep} />
            <SaleComps comps={saleComps} setComps={setSaleComps} setActiveStep={setActiveStep} isMobile={isMobile} />
          </>
        );

      // case 'Sale Comps (Optional)':
      //   return (
      //     <>
      //       <SaleComps comps={saleComps} setComps={setSaleComps} setActiveStep={setActiveStep} />
      //     </>
      //   );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className={root}>
      <ProfileAppbar
        name={'Investment Draft'}
        btns={
          <>

            {isMobile ? <IconButton onClick={() => {
              Api.post('investment/update', {
                _id: investmentId,
                status: 'Review Pending',
              }).then((investmentNew) => {
                console.log(investmentNew, ' is the investment');

                setInvestments([{
                  ...investment,
                  status: 'Review Pending',
                }], dashboard, dispatch);
              });

              history.goBack();
            }}
              disabled={isDisabled}
              color="primary"
            >
              <DoneIcon fontSize="large" />
            </IconButton> : <Button variant="outlined" className={classes.jobBtn} color="primary" disabled={isDisabled} onClick={() => {
              // setisDisabled(!isDisabled ? loading : null);

              Api.post('investment/update', {
                _id: investmentId,
                status: 'Review Pending',
              }).then((investmentNew) => {
                console.log(investmentNew, ' is the investment');

                setInvestments([{
                  ...investment,
                  status: 'Review Pending',
                }], dashboard, dispatch);
              });

              history.goBack();
            }}>
              {/* <img src={createLogo} alt="" /> */}
              Submit for review
            </Button>}

          </>}
      />
      <Stepper nonLinear activeStep={activeStep} orientation="vertical" style={{ marginTop: '8vh' }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => setActiveStep(index)}>{label}</StepButton>
            <StepContent>{getStepContent(label)}</StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
