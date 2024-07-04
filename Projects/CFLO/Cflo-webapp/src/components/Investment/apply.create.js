import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    useLocation,
    useHistory,
    useParams,
} from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import JobCard from '../job/job.card';
import InvestmentCard from '../Investment/investment.card';
import {
    makeStyles,
    useTheme,
} from '@material-ui/core/styles';
import Api from '../../helpers/Api';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import FilesViewer from '../file/Viewer/FilesViewer';
import FileObjectViewer from '../file/Viewer/FilesObjectViewer'
import Typography from '@material-ui/core/Typography';
import CreateBtn from '../styled/actionBtns/create.btn';
import ProfileSelect from '../styled/profile.select';
import { setUserApps } from '../apply/apply.utils';
import Button from '@material-ui/core/Button';
import PayTypeInput from '../apply/job.payType.input';
import TicketInput from '../apply/ticket.input';
import TitleInput from '../styled/title.input';
import useGetAdminProfiles from '../profile/useGetAdminProfiles';
import ProfileAppbar from '../profile/profile.appbar';
// import { useJob } from './job.hook';
import arrayToReducer from '../../helpers/arrayToReducer';
const useStyles = makeStyles((theme) => ({
    // root: {
    // display: 'flex',
    // flex: 1,
    // maxWidth: '42rem',
    // flexDirection: 'column',
    // marginTop: '6rem',
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        // marginBottom: "6rem",
        marginTop: "6rem",
        // marginLeft: "4rem",
        // marginRight: "4rem",
        width: '100%',
        [theme.breakpoints.down("sm")]: {
            marginLeft: "1rem",
            marginRight: "1rem",
        },
    },
    investmentCard: {
        width: '100%',
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: 'center'

    },
    // },
    messageInput: {
        maxWidth: '36rem',
        height: '6rem',
        padding: '1rem',
        paddingTop: '1rem',
        borderWidth: '1px',
        backgroundColor: '#eceff1',
        margin: '1rem 0 1rem 8rem',
        [theme.breakpoints.down('xs')]: {
            margin: '1rem'
        }
    },
    fileTextRow: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        margin: '1rem 0 1rem 8rem',
        flexWrap: 'wrap',
        [theme.breakpoints.down('xs')]: {
            margin: '1rem'
        }
    },
    center: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
    },
}));

const ApplyCreate = (props) => {
    const { owner } =
        (props.location && props.location.state) || {};
    const { createdFileIds } = useSelector((state) => state.file);
    const dashboard = useSelector((state) => state.dashboard);
    const classes = useStyles();
    const [ticket, setTicket] = useState(null);
    const [message, setMessage] = useState('');
    const [payType, setPayType] = useState(null);
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { selectedProfileId, user } = auth;
    // const [owner, setOwner] = useState(user);
    const location = useLocation();
    const history = useHistory();
    const s = useLocation().search;
    let parent = new URLSearchParams(s).get('parent');
    let type = new URLSearchParams(s).get('type');
    let { investmentId, userId } = useParams();
    const oldFiles = user?.files ? user?.files : null;
    const [files, setFiles] = useState(oldFiles);
    const oldFilesIds = oldFiles?.map(files => files?._id);
    const [filesIds, setFilesIds] = useState(oldFilesIds);
    const [filesDict, setFilesDict] = useState([])

    const addFiles = (newFiles) => {
        const {
            newDict, idArr
        } = arrayToReducer(newFiles)


        setFilesDict({
            ...filesDict, ...newDict
        })

        setFilesIds(Array.from(new Set([...filesIds, ...idArr])));

    }

    useEffect(() => {
        if (oldFiles && oldFiles.length > 0) {
            addFiles(oldFiles)
        }
    }, [oldFiles?.length])


    // useEffect(() => {
    //   Api.post('/apply/getProfileApps', {
    //     userId
    //   }).then((res) => {
    //     console.log(res, "Profile Applications")
    //   })
    // }, [userId])
    // useEffect(()=>{
    //     Api.post('/organization/getDetail',{
    //       userId,
    //     }).then((res)=>{

    //     })
    // },[userId])
    // const {
    //   adminProfiles
    // } = useGetAdminProfiles()
    let parentView = null;
    let amountView = null;
    type = 'Investment';
    parent = investmentId;
    // let job = useJob(jobId);
    useEffect(() => {
        console.log(user?._id, "This is owner")
        console.log(userId, "UserId")
    }, [owner])
    switch (type) {
        case 'Job':
            parentView = <JobCard jobId={parent} />;
            amountView = <PayTypeInput jobId={parent} getPayType={setPayType} />;
            break;

        case 'Investment':
            parentView = <InvestmentCard investmentId={parent} />;
            amountView = <TicketInput investmentId={parent} setTicket={setTicket} />;
            break;
        default:
            break;
    }

    const submit = () => {
        const body = {
            profile: userId,
            payType,
            ticket,
            parent,
            parentModelName: type,
            user: user._id,
            message,
            files: createdFileIds,
        };


        Api.post('apply/create', body).then((application) => {
            setUserApps([application], dashboard, dispatch);
            history.push('/dashboard');
        });
    };

    return (
        <div className={classes.root}>
            <ProfileAppbar
                name={"Applications"}
            />
            <div className={classes.investmentCard}>
                {parentView}
            </div>
            <div style={{ margin: '2vh 0' }}>
                {amountView}
            </div>

            <InputBase
                multiline
                rowsMax={10}
                value={message}
                placeholder={'This Investment looks interesting...'}
                onChange={(event) => setMessage(event.target.value)}
                className={classes.messageInput}
            />

            <div className={classes.fileTextRow}>
                <FileUploadButton
                    parentType={type}
                    used={false}
                    parentId={null}
                    setFilesIds={setFilesIds}
                />
                <Typography variant="h6" gutterBottom className={classes.paperText}>
                    Upload Files
                </Typography>

            </div>
            <div className={classes.fileTextRow}>
                <FilesViewer fileIds={createdFileIds} />
            </div>
            <div className={classes.center}>
                {message.length > 3 ? <CreateBtn onClick={submit}>
                    Submit
                </CreateBtn> : <Button style={{ border: '1px solid grey' }} disabled={true}>Submit</Button>}

            </div>
        </div>
    );
};

export default ApplyCreate;
