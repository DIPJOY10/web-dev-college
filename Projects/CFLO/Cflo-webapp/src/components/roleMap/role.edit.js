import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
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
import EditIcon from '@material-ui/icons/Edit';
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
    borderWidth: '1px',

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

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  editButton: {
    height: '2.5rem',
    width: '2.5rem',
    marginBottom: '1rem',
  },
}));
export default function RoleCreate(props) {
  const { setMode, roleId } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const roleMapReducer = useSelector((state) => state.roleMap);
  const {
    roleMapDictionary,
  } = roleMapReducer;
  const role = roleMapDictionary[roleId];

  const [designation, setDesignation] = useState(role?.designation);
  const [about, setAbout] = useState(role?.about);
  const [participant, setParticipant] = useState(role?.profile);
  const [userSelect, setUserSelect] = useState(false);
  const [isFilled, setIsFilled] = useState(true);
  const {
    root, row, col,
  } = classes;

  const _update = () => {
    Api.post('roleMap/update', {
      _id: roleId,
      profile: participant._id,
      designation,
      about,
    }).then((roleMap) => {
      setRoleMaps([roleMap], roleMapReducer, dispatch);
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
              Edit Member
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
        <div className={row}>
          <Avatar src={participant?.parent?.displayPicture?.thumbUrl} alt={participant?.parent?.displayName} />
          <div className={row}>
            <Typography>{participant?.parent?.displayName}</Typography>
          </div>

          <IconButton onClick={() => {
            setUserSelect(true);
          }}
            className={classes.editButton}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => {
            setMode('List');
          }}
            className={classes.editButton}
          >
            <ClearIcon />
          </IconButton>
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
          _update();
        }}>
          Update Role
        </CreateBtn> : <Button disabled={true} onClick={() => {

        }}>
          Update Role
        </Button>}
      </>}


    </div>
  );
}
