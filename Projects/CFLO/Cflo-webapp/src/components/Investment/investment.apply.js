import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Button, Paper, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import ProfileAppbar from '../profile/profile.appbar'
import { useHistory, useParams } from 'react-router-dom';
import InvestmentCard from './investment.card';
import { useInvestment } from './investment.hook';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import ReactHtmlParser from "react-html-parser";
import AvatarLocal from '../profile/avatar';
import moment from 'moment';
import RentCompsTable from './rent.comps.table';
import SaleCompsTable from './sale.comps.table';
import RentCompTable from './rent.comp.table';
import SaleCompTable from './sale.comp.table';
import ScheduleTable from './schedule.table';
import CreateButton from '../styled/actionBtns/create.btn';
import PSEdit from '../schedule/payment.schedule.edit';
import LoadingButton from '../styled/actionBtns/loading.btn';
import useGetAdminProfiles from '../profile/useGetAdminProfiles';
import Api from '../../helpers/Api';
import ProfileSelect from '../styled/profile.select';
import ProfileSelectButton from '../styled/actionBtns/profileSelect.btn';
import SaleApplyCompTable from './sale.apply.comp.table';
import RentApplyCompTable from './rent.apply.comp.table';
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginTop: '8vh',
        // height: '100%',
        // border: '1px solid green',
        alignItems: "center",
    },
    row: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    },
    col: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    Paper: {
        display: 'flex',
        flexDirection: 'column',
        width: 'inherit',
        minHeight: '100vh',
        alignItems: 'center'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        // border: '1px solid red',
        width: '92%',
        minHeight: '28vh',
        margin: '3vh 0',
        justifyContent: 'space-evenly',
        borderBottom: '1px solid grey',
    },
    location: {
        display: 'flex',
        flexDirection: 'row',
        width: "100%",
        [theme.breakpoints.down('xs')]: {
            width: "100%",
            margin: '2vh 0'
        },
    },
    header: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // minHeight: "10vh",
        alignSelf: 'center',
        justifyContent: 'space-between',
        [theme.breakpoints.down('xs')]: {
            // justifyContent: 'space-b',
            // width: "100%",
            marginBottom: '1vh',
            // flexDirection: 'column'
        },
    },
    details: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    description: {
        display: 'flex',
        flexDirection: 'column',
        width: '90%'
    },
    roles: {
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: '2vh 0',
        flexWrap: 'wrap',
        // [theme.breakpoints.down('xs')]: {
        //     flexDirection: 'column',
        // },

    },
    roleList: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        // margin: '0 0',
        flexWrap: 'wrap',
        // border: '1px solid red',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    role: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2260fe',
        // minHeight: "10vh",
        // minwidth: '25%',
        padding: '2vh 3vw 2vh 1vw',
        margin: '2vh 2vw 2vh 0',
        borderRadius: '2vw',
        [theme.breakpoints.down('xs')]: {
            padding: '2vh 3vw 0 2vw',
        },
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",

    },
    roleInitials: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
    },
    nameAndDesignation: {
        display: 'flex',
        flexDirection: 'column',
    },
    resp: {
        margin: "3vh 0"
    },
    tableStyle: {
        // width: '90%',
    },


}));
export default function InvestmentApply(props) {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const { investmentId } = useParams();
    const { user } = useSelector((state) => state.auth);
    const { investment } = useInvestment(investmentId);
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    // const userId = user?._id;
    const [owner, setOwner] = useState(null)
    const [btn, setBtn] = useState('Proceed');
    const [btnState, setBtnState] = useState(true);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [text, setText] = useState("");
    const {
        adminProfiles
    } = useGetAdminProfiles();
    console.log(adminProfiles, "AdminProfiles")
    console.log(investment);

    const isApplied = (res) => {
        let flag = -1;
        // let match = false;

        for (const values of Object.values(res)) {
            console.log(investment?.owner?._id, owner?.profile, "Matching");
            if (investment?.owner?._id === owner?.profile) {
                // setText("Owner cannot apply!!!");
                // setBtnState(false);
                flag = 0;
                break;
            }
            else if (investmentId === values?.parent) {
                // match = true;
                // setText('Already Applied!!!');
                flag = 1;
                // setBtnState(true);
                break;
            }
            else {
                // setText("");
                flag = 2;

                // break;
            }
        }

        if (flag === 0)
            setText("Owner cannot apply!!!");
        else if (flag === 1)
            setText('Already Applied!!!');
        else if (flag === 2) {
            setText("");
            history.push({
                pathname: `/dashboard/investment/apply/${investmentId}/applyform/${userId}`
            });
        }
        setLoading(false);
    }
    const getProfileApps = (profileIds) => {
        setLoading(true);
        Api.post('apply/getProfileApps', {
            profileIds
        }).then((res) => {
            console.log(res?.apps, "Applications");
            isApplied(res?.apps);
        })
    }
    useEffect(() => {
        getProfileApps(userId);
        console.log(investment, "Investment");
    }, [userId, investment])

    function RoleCard(role) {

        return <>
            <div className={classes.role}>
                <div className={classes.roleInitials}>
                    <div className={classes.img}>
                        <AvatarLocal alt={role?.profile?.parent?.displayName} src={role?.profile?.parent} />
                    </div>
                    <div className={classes.nameAndDesignation}>
                        <Typography variant={isMobile ? 'body1' : 'h6'} style={{ color: "white", marginLeft: '1vh' }}>{role?.profile?.parent?.displayName}</Typography>
                        <Typography variant={isMobile ? 'subtitle1' : 'caption'} style={{ marginBottom: '1vh', color: 'white', marginLeft: '1vh' }}>{role?.designation}</Typography>
                    </div>
                </div>
                <div className={classes.resp}>
                    <Typography variant={isMobile ? 'body2' : 'body1'} style={{ fontWeight: "500", color: "white" }}>{role?.about}</Typography>
                </div>
            </div>
        </>
    }



    return (
        <>
            <ProfileAppbar
                name={"Investment Details"}
                btns={
                    <><ProfileSelectButton
                        owner={owner}
                        adminProfiles={adminProfiles}
                        displayOwner={true}
                        loading={loading}
                        // title={'Select Profile'}
                        onChange={(value) => {
                            setOwner(value);
                            console.log('valueisOwner ', value)
                            // userId = value?._id
                            setUserId(value?.profile);
                            // isAppsExist(userId, "investment", investmentId);
                            setBtnState(false);
                            // history.push(`/dashboard/investment/apply/${investmentId}/applyform`)
                        }}
                        placeholder={'Investment proposal owner'}
                        text={text}
                    />
                        {/* <LoadingButton
                            loading={loading}
                            styleBody={{
                                height: "35px",
                                borderRadius: "20px",
                                padding: "5.5px 15px",
                            }}
                            text={btn}
                            onClick={() => {
                                if (btn === 'Proceed') {
                                    props.history.push({
                                        pathname: `/dashboard/investment/apply/${investmentId}/applyform/${userId}`,
                                        owner
                                    });
                                }
                                else if (btn === 'Continue')
                                    history.push(`/dashboard/investments`);
                            }}
                            disabled={btnState}
                            style={
                                {
                                    backgroundColor: theme.palette.primary.light,
                                    color: "white",
                                    marginBottom: '2vh'
                                }
                            }
                            progressStyle={{ color: "white" }}
                        >

                            {btn}
                            {/* {console.log(btn, "Apps")} */}
                        {/* </LoadingButton> */}
                    </>}
            />
            <div className={classes.root}>

                {/* <Typography>{investmentId}</Typography>
                 */}
                <Paper className={classes.Paper}>
                    <div className={classes.container}>
                        <div>
                            <Typography variant="body1" style={{ fontWeight: '500' }}>{investment?.title}</Typography>
                            {/* <Typography variant="body1" style={{ color: 'grey' }}>{(investment?.organization) ? investment?.organization : "XYZ organization"}<br /></Typography> */}
                            <Typography variant="body1" style={{ color: 'grey' }}>{`Posted by ${investment?.owner?.parent?.displayName}`}<br /></Typography>
                        </div>
                        <div className={classes.location}>
                            <LocationOnOutlinedIcon />
                            <Typography variant="body1">{investment?.location?.name}</Typography>
                        </div>
                        <div className={classes.header}>
                            <div>
                                <Typography variant="body1" style={{ color: "grey" }}>Start Date</Typography>
                                <Typography variant="body1">{moment(investment?.startDate).format('DD MMM YYYY')}</Typography>
                            </div>
                            <div className={classes.projectSize}>
                                <Typography variant="body1" style={{ color: "grey" }}>Project Size</Typography>
                                <Typography variant="body1">{`$${investment?.header?.size}`}</Typography>
                            </div>
                            <div className={classes.targetHold}>
                                <Typography variant="body1" style={{ color: "grey" }}>Target Hold</Typography>
                                <Typography variant="body1">{`${investment?.header?.hold} months`}</Typography>
                            </div>
                            <div className={classes.irr}>
                                <Typography variant="body1" style={{ color: "grey" }}>IRR</Typography>
                                <Typography variant="body1">{investment?.header?.irr}</Typography>
                            </div>
                            <div className={classes.ticketSize}>
                                <Typography variant="body1" style={{ color: "grey" }}>Ticket Size</Typography>
                                <Typography variant="body1">{`$${investment?.header?.minTicket}`}</Typography>
                            </div>
                        </div>



                        {/* </div> */}
                    </div>
                    <div className={classes.details}>
                        <div className={classes.description}>
                            <Typography variant='body1' style={{ fontWeight: "500" }}>Investment Description</Typography>
                            {ReactHtmlParser(investment?.description)}
                        </div>
                        {investment?.roles.length > 0 ? <div className={classes.roles}>
                            <Typography variant='body1' style={{ fontWeight: "500" }}>Roles</Typography>
                            <div className={classes.roleList}>
                                {investment?.roles.map((role) => {
                                    return RoleCard(role);
                                })}
                            </div>
                        </div> : null}
                        {investment?.rentComps.length > 0 ? <div className={classes.rentComps}>
                            <Typography variant='body1' style={{ fontWeight: "500" }}>Rent Comps</Typography>
                            <RentApplyCompTable comps={investment?.rentComps} />
                        </div> : null}
                        {investment?.saleComps.length > 0 ? <div className={classes.saleComps}>
                            <Typography variant='body1' style={{ fontWeight: "500" }}>Sale Comps</Typography>
                            <div className={classes.tableStyle}>
                                <SaleApplyCompTable comps={investment?.saleComps} />

                            </div>
                        </div> : null}
                        {/* {investment?.schedule.length > 0 ? */}
                        {<div className={classes.schedule}>
                            <Typography variant='body1' style={{ fontWeight: "500" }}>Schedules</Typography>
                            <div className={classes.tableStyle}>
                                {/* <PSEdit scheduleId={investment?.schedule} /> */}
                            </div>
                        </div>}
                        {/* : null} */}
                        {/* <Button style={{ color: 'white', marginBottom: '2vh' }} variant='outlined' color='primary'
                        // onClick={() => {
                        //     history.push(`/dashboard/investment/apply/${investmentId}/applyform`);
                        // }}
                        >
                            {/* Apply Now */}

                        {/* </Button> */}
                    </div>

                </Paper>
            </div >
        </>
    )
}
