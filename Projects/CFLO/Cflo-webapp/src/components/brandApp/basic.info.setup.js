import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import HomeIcon from '@material-ui/icons/Home';
import { Divider } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import UserWithRoleComponent from '../styled/CommonComponents/UserWithRoleComponent';
import { getProfileById } from '../Portfolio/apiCall';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { getBrandAppById, updateBrandApp } from './apiCall';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CircularProgress from '@material-ui/core/CircularProgress';
import { accessRoleUpdate, createAccessRole } from '../propertyManagement/apiCall';


const roles = ["Admin", "Owner", "Editor", "Viewer"]
const rolesWithoutOwner = ["Admin", "Editor", "Viewer"]

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: "white"
  },
  loaderCont: {
    position: 'fixed',
    top: "0px",
    right: "0px",
    width: "100vw",
    height: "100vh",
    zIndex: "1000",
    paddingLeft: "100px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down('xs')]: {
      paddingLeft: "0px",
    },
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
    textAlign: 'center',
  },
  discription: {
    color: 'black',
    width: '70%',
    textAlign: "center",
    fontSize: "20px",
    marginTop: '30px',
    fontWeight: '550',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      fontWeight: '500',
      width: '97%'
    },
  },
  mainCont: {
    width: '90%',
    marginTop: '50px',
    padding: "20px",
    marginBottom: "30px"
  },
  inputStyle: {
    width: '70%'
  },
  titleCont: {
    width: '25%',
    fontSize: '20px',
    fontWeight: '550',
    textAlign: 'left',
    color: theme.palette.primary.main,
    paddingLeft: "50px"
  },
  displayFlex: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  accessCont: {
    width: "70%",
    border: "1px solid gray",
    padding: "20px"
  },

}));

export default function BasicInfoSetup(props) {
  const { brandAppId } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { root, center } = classes;
  const { file, auth } = useSelector((state) => state);
  const { createdFileIds } = file;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [usersWithAccess, setUsersWithAccess] = useState([]);
  const [accessableUsersWithRole, setAccessableUsersWithRole] = useState([]);
  const [multiInputBool, setmultiInputBool] = useState(false)
  const [brandApp, setBrandApp] = useState(null);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [loadingBool, setLoadingBool] = useState(false);
  const [ownerExist, setOwnerExist] = useState(false);

  useEffect(() => {
    if (brandApp) {
      if (brandApp && brandApp?.accessRole && brandApp?.accessRole.length === 0) {
        getProfileById({ profileId: auth?.user?.profile })
          .then((data) => {
            const userProfile = data
            const initProfileArrs = [userProfile]
            setUsersWithAccess(initProfileArrs)
            const accessableUserWithRole = {
              user: userProfile,
              role: "Owner"
            }
            const accessableUserWithRoleArr = [accessableUserWithRole]
            setAccessableUsersWithRole(accessableUserWithRoleArr);
          })
          .catch((err) => {
            console.log(err);
          })
      } else {
        let accessableUserWithRoleArr = []
        let initProfileArrs = []
        let oldAccessUser = brandApp?.accessRole

        oldAccessUser.length > 0 && oldAccessUser.map((accessUser) => {
          accessableUserWithRoleArr.push({
            user: accessUser?.user,
            role: accessUser?.role,
            _id: accessUser?._id
          })

          initProfileArrs.push(accessUser?.user)
        })
        setUsersWithAccess(initProfileArrs)
        setAccessableUsersWithRole(accessableUserWithRoleArr)

        setName(brandApp?.name)
        setDescription(brandApp?.description)
      }
    }
  }, [auth?.user?.profile, brandApp])

  const checkOwnerExist = (accessableUsersWithRoleL) => {
    let isAnyOwner = false
    accessableUsersWithRoleL.length > 0 && accessableUsersWithRoleL.map((accessRole) => {
      if (accessRole?.role === "Owner") {
        isAnyOwner = true;
      }
    })
    setOwnerExist(isAnyOwner)
  }

  useEffect(() => {
    checkOwnerExist(accessableUsersWithRole)
  }, [accessableUsersWithRole])


  const removeAccessRoleUser = async (removedUserId, newUserRoleArr) => {
    if (removedUserId && newUserRoleArr.length > 0) {
      await accessRoleUpdate({
        _id: removedUserId,
        deleted: true,
      })
        .then(async (data) => {
          let userAccessRoleIds = []
          let userAccessIds = []

          newUserRoleArr.map((userRole) => {
            userAccessRoleIds.push(userRole?._id)
            userAccessIds.push(userRole?.user?._id)
          })

          const app = {
            _id: brandApp?._id,
            access: userAccessIds,
            accessRole: userAccessRoleIds
          };

          await updateBrandApp({ app })
            .then((data) => {
              setBrandApp(data)
            })
            .catch((err) => {
              console.log(err);
            })
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  //update user's role
  const updateRoleOfAccessUser = async (accessRoleObj) => {
    if (accessRoleObj?._id) {
      setLoadingBool(true)
      await accessRoleUpdate({
        _id: accessRoleObj?._id,
        role: accessRoleObj?.role
      })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err)
        })
      setLoadingBool(false)
    }
  }

  //remove user
  const removeAccessableUsers = async (id) => {
    setmultiInputBool(!multiInputBool)
    const filteredUserArr = usersWithAccess.filter(user => user?._id !== id);
    setUsersWithAccess(filteredUserArr)

    let newUserAccessRoleArr = []
    let removedUserRole
    accessableUsersWithRole.map((userRole) => {
      if (userRole?.user?._id !== id) {
        newUserAccessRoleArr.push(userRole)
      } else {
        removedUserRole = userRole
      }
    })
    setAccessableUsersWithRole(newUserAccessRoleArr)
    setmultiInputBool(!multiInputBool)
    await removeAccessRoleUser(removedUserRole?._id, newUserAccessRoleArr)
  }

  //update user role
  const updateAccessableUsersWithRole = async (value, index) => {
    setmultiInputBool(!multiInputBool)
    let inputDataArr = accessableUsersWithRole;
    let editObj = {
      ...accessableUsersWithRole[index],
      role: value,
    }
    inputDataArr[index] = editObj;
    setAccessableUsersWithRole(inputDataArr)
    setmultiInputBool(!multiInputBool)
    checkOwnerExist(inputDataArr)
    await updateRoleOfAccessUser(editObj)
  }

  //add new user
  const addNewAccessableUsers = async (newAccessRoleObj) => {
    setLoadingBool(true)
    await createAccessRole({
      user: newAccessRoleObj?.user?._id,
      role: newAccessRoleObj?.role,
      creator: auth?.user?.profile?._id,
      rentalId: brandApp?._id
    })
      .then(async (data) => {
        let newAccessRoleWithId = {
          user: newAccessRoleObj?.user,
          role: newAccessRoleObj?.role,
          _id: data?._id
        }

        let newAccessableUsersWithRoleArr = [...accessableUsersWithRole, newAccessRoleWithId]
        setAccessableUsersWithRole(newAccessableUsersWithRoleArr);

        let userAccessRoleIds = []
        let userAccessIds = []

        newAccessableUsersWithRoleArr.map((userRole) => {
          userAccessRoleIds.push(userRole._id)
          userAccessIds.push(userRole?.user?._id)
        })

        const app = {
          _id: brandApp?._id,
          access: userAccessIds,
          accessRole: userAccessRoleIds
        };

        await updateBrandApp({ app })
          .then((data) => {
            setBrandApp(data)
          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log(err);
      })

    setLoadingBool(true)
  }

  const getApps = async () => {
    setLoadingBool(true)
    await getBrandAppById({ appId: brandAppId })
      .then((data) => {
        console.log(data);
        setBrandApp(data)
      })
      .catch((err) => {
        console.log(err)
      })
    setLoadingBool(false)
  }

  useEffect(() => {
    if (brandAppId) {
      getApps()
    }
  }, [brandAppId])


  useEffect(() => {
    if (createdFileIds.length > 0 && isLogoUploading) {
      updateForLogo(createdFileIds[0])
    }
  }, [createdFileIds])

  const updateForLogo = async (displayPicture) => {
    setLoadingBool(true)
    const app = {
      _id: brandApp?._id,
      displayPicture,
    };

    await updateBrandApp({ app })
      .then((data) => {
        console.log(data);
        setBrandApp(data)
      })
      .catch((err) => {
        console.log(err);
      })
    setLoadingBool(false)
  };


  const update = async () => {
    setLoadingBool(true)

    const app = {
      _id: brandApp?._id,
      name,
      description,
      basicInfo: true,
    };

    await updateBrandApp({ app })
      .then((data) => {
        console.log(data);
        setBrandApp(data)
      })
      .catch((err) => {
        console.log(err);
      })

    setLoadingBool(false)
  };





  return (
    <div className={cx(root, center)}>
      <Typography className={classes.discription} >
        App development is costly. It can cost you anywhere from $5,000 - $100,0000+ . We offer you both ios and android starting <b>$200</b> only.
        It's time to build your brand.
      </Typography>

      <Paper square className={classes.mainCont} >
        <div className={classes.displayFlex}>
          <Typography className={classes.titleCont} >Title</Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Joe and Ross"
            className={classes.inputStyle}
            value={name}
            onChange={(e) => { setName(e.target.value) }}
          />
        </div>

        <div className={classes.displayFlex} >
          <Typography className={classes.titleCont} >Description</Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            multiline
            placeholder="Tell us about your app"
            rows={5}
            className={classes.inputStyle}
            value={description}
            onChange={(e) => { setDescription(e.target.value) }}
          />
        </div>

        <div className={classes.displayFlex} >
          <Typography className={classes.titleCont} >Participants</Typography>
          <div className={classes.accessCont} >
            <UserWithRoleComponent
              userArr={usersWithAccess}
              setUserArr={setUsersWithAccess}
              userRoleArr={accessableUsersWithRole}
              setUserRoleArr={setAccessableUsersWithRole}
              roles={ownerExist ? rolesWithoutOwner : roles}
              defaultType={"Viewer"}
              userProfile={auth?.user?.profile}
              walletId={auth?.user?.wallet}
              relationType={"Customer"}
              userOp={true}
              projectOp={false}
              orgOp={false}
              removeUserRole={removeAccessableUsers}
              updateRoleOfUserRole={updateAccessableUsersWithRole}
              addUserRole={addNewAccessableUsers}
            />
          </div>
        </div>

        <div className={classes.displayFlex} >
          <Typography className={classes.titleCont} >Logo</Typography>
          <div className={classes.inputStyle} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            {name.length > 2 && description.length > 5 ? (
              <span onClick={() => { setIsLogoUploading(true) }} >
                <FileUploadButton
                  parentType='Comment'
                  used={false}
                  parentId={null}
                />
              </span>
            ) : (
              <AttachFileIcon style={{ color: 'gray' }} />
            )}
            <div>
              {brandApp?.displayPicture && (<img style={{ height: '30px', width: 'auto' }} src={brandApp?.displayPicture?.url} alt={"Logo"} />)}
            </div>
          </div>
        </div>

        <div className={classes.displayFlex} style={{ marginTop: "60px" }} >
          <div></div>
          <div>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              onClick={() => { update() }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              style={{ marginLeft: "15px" }}
              onClick={() => {
                let path = '/brandApp/tx/' + brandApp?._id
                history.push(path)
              }}
              disabled={!brandApp?.basicInfo}
            >
              Order
            </Button>
          </div>
        </div>
      </Paper>

      {loadingBool &&
        <div className={classes.loaderCont} >
          <CircularProgress
            size={60}
            thickness={3}
            style={{ color: 'rgb(92, 144, 242)' }}
          />
        </div>
      }
    </div>
  );
}
