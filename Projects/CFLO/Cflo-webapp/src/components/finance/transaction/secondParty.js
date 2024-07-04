import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import BusinessIcon from '@material-ui/icons/Business';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import AddFinRel from '../../AddMember/addFinRel';
import { getUserByName, getOrgByName, getOwnUsers, getAccessibleProject, findAndAddRelation, updateTx } from './api';
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import CreatePal from './CreatePal';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Avatar from '@material-ui/core/Avatar';
import _ from 'lodash';
import { Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  bglen: {
    fontSize: "26px",
    marginLeft: "3px",
    marginRight: "3px",
  },
  bottomAct: {
    width: "100%",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
  },
  addCustomerCont: {
    width: "100%",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "center",
    margin: "30px 0px"
  },
  optionCont: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
  optionImgCont: {
    width: "13%",
    display: "flex",
    alignItems: "center",
  },
  optionInfoCont: {
    width: "83%"
  },
  showSecondPartyInfoCont: {
    width: "65%",
  },
  showSecondPartyImgCont: {
    width: "15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  showSecondPartyCont: {
    width: "320px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondPartyEditCont: {
    width: "16%",
  }
}));

export default function TxSecondParty(props) {
  const {
    tx, setTx, updateApi, relationType, walletId, setLoadingBool
  } = props;

  const classes = useStyles();

  const {
    bglen, bottomAct, addCustomerCont, optionCont, optionImgCont, optionInfoCont,
    showSecondPartyInfoCont, showSecondPartyImgCont, showSecondPartyCont, secondPartyEditCont
  } = classes;

  const { user } = useSelector((state) => state.auth);

  const oldSecParty = tx?.secondParty

  const [secParty, setSecParty] = useState(oldSecParty)


  const [open, setOpen] = useState(false)
  const [show, setShow] = useState("user")

  const [allOwnUsers, setAllOwnUsers] = useState([])
  const [allOwnProjects, setAllOwnProjects] = useState([])
  const [allOwnOrgs, setAllOwnOrgs] = useState([])

  const [accessibleProjects, setAccessibleProjects] = useState([])

  const [userObj, setUserObj] = useState(null)
  const [userName, setUserName] = useState("")
  const [allUsers, setAllUsers] = useState([])

  const [orgObj, setOrgObj] = useState(null)
  const [orgName, setOrgName] = useState("")
  const [allOrgs, setAllOrgs] = useState([])

  const [projectObj, setProjectObj] = useState(null)
  const [projectName, setProjectName] = useState("")
  const [allProjects, setAllProjects] = useState([])

  const handleClose = async () => {
    setOpen(false)
  }

  const getOptionLabel = (option) => {
    return option?.displayName || " "
  }


  useEffect(() => {
    if (allUsers.length === 0) {
      setAllUsers(allOwnUsers)
    }
  }, [allUsers])

  useEffect(() => {
    if (allProjects.length === 0) {
      setAllProjects(allOwnProjects)
    }
  }, [allProjects])

  useEffect(() => {
    if (allOrgs.length === 0) {
      setAllOrgs(allOwnOrgs)
    }
  }, [allOrgs])



  useEffect(() => {
    getOwnUsers({ walletId })
      .then((data) => {
        let OnlyUsers = []
        let OnlyProject = []
        let OnlyOrg = []

        data?.length > 0 && data.map((d) => {
          if (d?.profile?.parentModelName === "Pal") {
            if (d?.profile?.parent?.type === "User") {
              const newObj = {
                profileId: d?.profile?._id,
                ...d
              }
              OnlyUsers.push(newObj)
            } else if (d?.profile?.parent?.type === "Organization") {
              const newObj = {
                profileId: d?.profile?._id,
                ...d
              }
              OnlyOrg.push(newObj)
            } else if (d?.profile?.parent?.type === "Project") {
              const newObj = {
                profileId: d?.profile?._id,
                ...d
              }
              OnlyProject.push(newObj)
            }
          } else if (d?.profile?.parentModelName === "User") {
            const newObj = {
              profileId: d?.profile?._id,
              ...d
            }
            OnlyUsers.push(newObj)
          } else if (d?.profile?.parentModelName === "Organization") {
            const newObj = {
              profileId: d?.profile?._id,
              ...d
            }
            OnlyOrg.push(newObj)
          } else if (d?.profile?.parentModelName === "Project") {
            const newObj = {
              profileId: d?.profile?._id,
              ...d
            }
            OnlyProject.push(newObj)
          }
        })



        let usersGroupById = _.groupBy(OnlyUsers, 'profileId')

        let finalOnlyUsers = []

        for (const key in usersGroupById) {
          let arrObj = usersGroupById[key]
          finalOnlyUsers.push(arrObj[0])
        }

        usersGroupById = _.groupBy(OnlyOrg, 'profileId')

        let finalOnlyOrg = []

        for (const key in usersGroupById) {
          let arrObj = usersGroupById[key]
          finalOnlyOrg.push(arrObj[0])
        }

        usersGroupById = _.groupBy(OnlyProject, 'profileId')

        let finalOnlyProject = []

        for (const key in usersGroupById) {
          let arrObj = usersGroupById[key]
          finalOnlyProject.push(arrObj[0])
        }

        setAllUsers(finalOnlyUsers)
        setAllOrgs(finalOnlyOrg)
        setAllProjects(finalOnlyProject)

        setAllOwnUsers(finalOnlyUsers)
        setAllOwnOrgs(finalOnlyOrg)
        setAllOwnProjects(finalOnlyProject)
      })
      .catch((err) => {
        console.log(err)
      })

    getAccessibleProject({ userProfileId: user?.profile })
      .then((data) => {
        console.log(data)
        setAccessibleProjects(data)
      })
      .catch((err) => {
        console.log(err)
      })


  }, [walletId, open])




  // for users

  const onChangeUserNameInput = async (value) => {
    if (value.length > 1) {
      await getUserByName({ name: value })
        .then((users) => {

          let allUsers = []

          users.length > 0 && users.map((user) => {
            if (user?.profile?._id && user?.wallet?._id) {
              const newObj = {
                profileId: user?.profile?._id,
                ...user
              }
              allUsers.push(newObj)
            }
          })

          let filteredOwnUsers = []

          allOwnUsers.map((user) => {
            let name = user?.displayName
            const patt = new RegExp(value, "i");
            const res = patt.test(name);
            if (res) {
              filteredOwnUsers.push(user)
            }
          });

          const newUserArr = [...filteredOwnUsers, ...allUsers]

          const usersGroupById = _.groupBy(newUserArr, 'profileId')

          let finalUserArr = []

          for (const key in usersGroupById) {
            let arrObj = usersGroupById[key]
            finalUserArr.push(arrObj[0])
          }

          console.log(finalUserArr)

          setAllUsers(finalUserArr)



        })
        .catch((err) => {
          console.log(err)
        })
    } else if (value.length === 0) {
      setAllUsers(allOwnUsers)
    }
  }

  const onSelectUser = async (value) => {
    setUserObj(value)
    setOrgObj(null)
    setProjectObj(null)
  }


  // for orgs

  const onChangeOrgNameInput = async (value) => {
    if (value.length > 1) {
      await getOrgByName({ name: value })
        .then((orgs) => {

          let allOrgs = []

          orgs.length > 0 && orgs.map((org) => {
            if (org?.profile?._id && org?.wallet?._id) {
              const newObj = {
                profileId: org?.profile?._id,
                ...org
              }
              allOrgs.push(newObj)
            }
          })


          let filteredOwnOrgs = []

          allOwnOrgs.map((org) => {
            let name = org?.displayName
            const patt = new RegExp(value, "i");
            const res = patt.test(name);
            if (res) {
              filteredOwnOrgs.push(org)
            }
          });

          const newOrgArr = [...filteredOwnOrgs, ...allOrgs]

          const orgsGroupById = _.groupBy(newOrgArr, 'profileId')

          let finalOrgArr = []

          for (const key in orgsGroupById) {
            let arrObj = orgsGroupById[key]
            finalOrgArr.push(arrObj[0])
          }

          console.log(finalOrgArr)

          setAllOrgs(finalOrgArr)

        })
        .catch((err) => {
          console.log(err)
        })
    } else if (value.length === 0) {
      setAllOrgs(allOwnOrgs)
    }
  }

  const onSelectOrg = async (value) => {
    setUserObj(null)
    setOrgObj(value)
    setProjectObj(null)
  }


  // for projects

  const onChangeProjectNameInput = async (value) => {
    if (value.length > 1) {
      let filteredOwnProjects = []
      accessibleProjects.map((project) => {
        let name = project?.displayName
        const patt = new RegExp(value, "i");
        const res = patt.test(name);
        if (res) {
          filteredOwnProjects.push(project)
        }
      });


      let allProjects = []

      filteredOwnProjects.length > 0 && filteredOwnProjects.map((project) => {
        if (project?.profile?._id && project?.wallet?._id) {
          const newObj = {
            profileId: project?.profile?._id,
            ...project
          }
          allProjects.push(newObj)
        }
      })


      let filteredProjects = []

      allOwnProjects.map((project) => {
        let name = project?.displayName
        const patt = new RegExp(value, "i");
        const res = patt.test(name);
        if (res) {
          filteredProjects.push(project)
        }
      });

      const newProjectArr = [...filteredProjects, ...allProjects]

      const projectsGroupById = _.groupBy(newProjectArr, 'profileId')

      let finalProjectArr = []

      for (const key in projectsGroupById) {
        let arrObj = projectsGroupById[key]
        finalProjectArr.push(arrObj[0])
      }

      console.log(finalProjectArr)

      setAllProjects(finalProjectArr)


    } else if (value.length === 0) {
      setAllProjects(allOwnProjects)
    }
  }

  const onSelectProject = async (value) => {
    setUserObj(null)
    setOrgObj(null)
    setProjectObj(value)
  }

  const findOrAddRel = async (profile) => {
    if (profile) {
      const relObj = {
        profile: profile?._id,
        wallet: walletId,
        addedBy: user?.profile,
        user: user?._id,
        type: tx?.type === "Invoice" ? "Customer" : "Vendor"
      };

      console.log(relObj);

      await findAndAddRelation(relObj)
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          console.log(err);
        })
    }
  };




  const updateSelected = async () => {
    setLoadingBool(true)

    let value = null

    if (userObj) {
      value = userObj
    } else if (orgObj) {
      value = orgObj
    } else if (projectObj) {
      value = projectObj
    }

    if (value) {

      console.log(value)

      await updateApi({
        _id: tx?._id,
        secondParty: value?.profile?._id,
        secondPartyWallet: value?.wallet?._id
      })

      const newTx = {
        ...tx,
        secondParty: value?.profile,
        secondPartyWallet: value?.wallet
      }

      findOrAddRel(value?.profile)

      setTx(newTx)

      setOpen(false)

      setUserObj(null)
      setUserName("")
      setOrgObj(null)
      setOrgName("")
      setProjectObj(null)
      setProjectName("")
    }

    setLoadingBool(false)
  }

  return (
    <>

      {tx?.secondParty?._id && tx?.secondPartyWallet._id ? (
        <>
          <div className={showSecondPartyCont} >
            <div className={showSecondPartyImgCont} >
              <Avatar alt="ProfilePic" src={tx?.secondParty?.parent?.displayPicture?.thumbUrl} />
            </div>
            <div className={showSecondPartyInfoCont} >
              <Typography style={{ fontSize: "16px", fontWeight: "550" }} >{tx?.secondParty?.parent?.displayName}</Typography>
              <Typography style={{ fontSize: "13px", opacity: "0.6" }} >{tx?.secondParty?.parent?.email}</Typography>
            </div>
            <div className={secondPartyEditCont} >
              <IconButton color="primary" onClick={() => { setOpen(true) }} >
                <EditIcon />
              </IconButton>
            </div>
          </div>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => { setOpen(true) }}
          >
            <AddIcon />
            Add Recipient
          </Button>
        </>
      )}





      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>

          <CreatePal
            tx={tx}
            setTx={setTx}
            updateApi={updateApi}
            walletId={walletId}
            findOrAddRel={findOrAddRel}
            handleClose={handleClose}
          />

          <MyNavBar
            title={"Add Recipient"}
            show={show}
            setShow={setShow}
            walletId={walletId}
            Component={null}
            isMenu={false}
            options={[
              {
                value: "user",
                label: "User",
                Component: <div className={addCustomerCont} >
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    value={userObj}
                    inputValue={userName}
                    options={allUsers}
                    getOptionLabel={getOptionLabel}
                    getOptionSelected={(option) => {
                      return option?._id == userObj?._id;
                    }}
                    onChange={(event, value) => {
                      onSelectUser(value)
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="User" margin="normal" variant="outlined" />
                    )}
                    onInputChange={(event, newValue) => {
                      setUserName(newValue);
                      onChangeUserNameInput(newValue)
                    }}
                    renderOption={(option, state) => {
                      if (option) {
                        return (
                          <div className={optionCont} >
                            <div className={optionImgCont} >
                              <Avatar alt="ProfilePic" src={option?.displayPicture?.thumbUrl} />
                            </div>
                            <div className={optionInfoCont} >
                              <div>
                                {option?.displayName}
                              </div>
                              <div style={{ fontSize: "12px", opacity: "0.6" }} >
                                {option?.email}
                              </div>
                            </div>
                          </div>
                        )
                      }
                      else {
                        return null;
                      }
                    }}
                    style={{ width: "300px" }}
                  />
                </div>
              },
              {
                value: "project",
                label: "Project",
                Component: <div className={addCustomerCont} >
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    value={projectObj}
                    inputValue={projectName}
                    options={allProjects}
                    getOptionLabel={getOptionLabel}
                    getOptionSelected={(option) => {
                      return option?._id == projectObj?._id;
                    }}
                    onChange={(event, value) => {
                      onSelectProject(value)
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Project" margin="normal" variant="outlined" />
                    )}
                    onInputChange={(event, newValue) => {
                      setProjectName(newValue);
                      onChangeProjectNameInput(newValue)
                    }}
                    renderOption={(option, state) => {
                      if (option) {
                        return (
                          <div className={optionCont} >
                            <div className={optionImgCont} >
                              <Avatar alt="ProfilePic" src={option?.displayPicture?.thumbUrl} />
                            </div>
                            <div className={optionInfoCont} >
                              <div>
                                {option?.displayName}
                              </div>
                              <div style={{ fontSize: "12px", opacity: "0.6" }} >
                                {option?.email}
                              </div>
                            </div>
                          </div>
                        )
                      }
                      else {
                        return null;
                      }
                    }}
                    style={{ width: "300px" }}
                  />
                </div>
              },
              {
                value: "organization",
                label: "Organization",
                Component: <div className={addCustomerCont} >

                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    value={orgObj}
                    inputValue={orgName}
                    options={allOrgs}
                    getOptionLabel={getOptionLabel}
                    getOptionSelected={(option) => {
                      return option?._id == userObj?._id;
                    }}
                    onChange={(event, value) => {
                      onSelectOrg(value)
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Organization" margin="normal" variant="outlined" />
                    )}
                    onInputChange={(event, newValue) => {
                      setOrgName(newValue);
                      onChangeOrgNameInput(newValue)
                    }}
                    renderOption={(option, state) => {
                      if (option) {
                        return (
                          <div className={optionCont} >
                            <div className={optionImgCont} >
                              <Avatar alt="ProfilePic" src={option?.displayPicture?.thumbUrl} />
                            </div>
                            <div className={optionInfoCont} >
                              <div>
                                {option?.displayName}
                              </div>
                              <div style={{ fontSize: "12px", opacity: "0.6" }} >
                                {option?.email}
                              </div>
                            </div>
                          </div>
                        )
                      }
                      else {
                        return null;
                      }
                    }}
                    style={{ width: "300px" }}
                  />



                </div>
              }
            ]}
          />
        </DialogContent>
        <div className={bottomAct} >
          <Button
            onClick={handleClose}
            variant="contained"
            size="small"
            color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => { updateSelected() }}
            variant="contained"
            size="small"
            color="primary">
            Save & Close
          </Button>
        </div>
      </Dialog>
    </>
  );
}
