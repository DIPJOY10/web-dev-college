import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import UserForm from '../userForm';
import UserPalAutocomplete from '../UserPalAutocomplete';
import DescriptionInput from '../styled/description.input';
import InputBase from '@material-ui/core/InputBase';
import CreateBtn from '../styled/actionBtns/create.btn';
import Button from '@material-ui/core/Button';
import Api from '../../helpers/Api';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { setRoleMaps } from './roleMap.utils';

const useStyles = makeStyles((theme) => ({
  root: {
    // [theme.breakpoints.down('xs')]: {
    //   width: '50%',
    //   // border: '1px solid red'
    // },
  },

  text: {
    textAlign: 'center',
  },

  desgText: {
    maxWidth: '30rem',
    height: '2rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    // borderWidth: '1px',
    border: '1px soild black',
    color: '#424242',
    margin: '1rem',
    // [theme.breakpoints.down('xs')]: {
    //   width: '50%',
    //   // border: '1px solid red'
    // },
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    // [theme.breakpoints.down('xs')]: {
    //   width: '50%',
    //   // border: '1px solid red'
    // },
  },
  userDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // border: '1px solid red',
    // justifyContent: 'space-between'
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));
export default function RoleCreate(props) {
  const { onRoleCreate, setMode } = props;
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const {
    user,
  } = useSelector((state) => state.auth);
  const roleMapReducer = useSelector((state) => state.roleMap);
  const [designation, setDesignation] = useState('');
  const [about, setAbout] = useState('');
  const [participant, setParticipant] = useState(null);
  const [userSelect, setUserSelect] = useState(true);
  const [isFilled, setIsFilled] = useState(false);
  const {
    root, row, col, userDetails
  } = classes;

  const _create = () => {
    Api.post('roleMap/create', {
      profile: participant?._id,
      designation,
      about,
    }).then((roleMap) => {
      setRoleMaps([roleMap], roleMapReducer, dispatch);
      onRoleCreate(roleMap);
      setMode('List');
    });
  };

  useEffect(() => {
    if (about?.length > 3 && designation?.length > 3) {
      setIsFilled(true);
    }
    else {
      setIsFilled(false);
    }
  }, [about, designation]);

  return (
    <div className={classes.root}>

      {userSelect ? <>
        <div className={row}>
          <div className={row}>
            <Typography variant="h6" gutterBottom className={classes.text}>
              Add Member
            </Typography>

          </div>
          <IconButton onClick={() => {
            setMode('List');
          }}
            className={classes.editButton}
          >
            <ClearIcon />
          </IconButton>

        </div>

        <UserPalAutocomplete
          placeholder={'Search '}
          participant={participant} setParticipant={setParticipant}
          setSelectUser={setUserSelect} />

        {/* <UserForm
          phone={phone} setPhone={setPhone}
          setParticipant={setParticipant}
          setSelectUser={setUserSelect} /> */}
      </> : <>
        <div className={userDetails}>
          <Avatar src={participant?.parent?.displayPicture?.thumbUrl} alt={participant?.parent?.displayName} />
          <Typography style={{ marginLeft: '2vh' }}>{participant?.parent?.displayName}</Typography>
        </div>

        <InputBase
          rowsMax={1}
          value={designation}
          placeholder={'Designation'}
          onChange={(event) => setDesignation(event.target.value)}
          className={classes.desgText}
        />
        <InputBase
          rowsMax={1}
          value={about}
          placeholder={'Participant responsibilities and relevant work experience'}
          onChange={(event) => setAbout(event.target.value)}
          className={classes.desgText}
        />
        {/* <DescriptionInput
          description={about}
          placeholder={'Participant responsibilities and relevant work experience '}
          setDescription={setAbout}
        /> */}

        {isFilled ? <CreateBtn onClick={() => {
          _create();
        }}>
          Add Role
        </CreateBtn> : <Button disabled={true} onClick={() => {

        }}>
          Add Role
        </Button>}
      </>}

    </div>
  );
}
