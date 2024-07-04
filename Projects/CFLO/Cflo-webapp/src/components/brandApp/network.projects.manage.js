import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useParams} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Api from '../../helpers/Api';
import {useGetTopProjects} from '../projects/useGetTopProjects';
import _ from 'lodash';
import MenuBar from '../styled/menubar';
import TeamActionCard from '../team/team.action.card';
import CreateBtn from '../styled/actionBtns/create.btn';
import {removeNetworkProject, setNetworkProjects, addNetworkProject} from './utils';
import TenantCard from './tenant.card';
import CreateProjectDialog from '../projects/create.project.dialog';
import RentalReqCard from './rental.req.card';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '45rem',
    margin: '1rem 0',
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
}));

export default function NetworkProjectManage(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();


  const {
    network,
    tenants,
    rentalReqs,
    setRentalReqs,
    adminTeamIds,
  } = props;
  const networkIdProps = network?._id;
  const {
    networkId: networkIdParams,
  } = useParams();


  const networkId = networkIdProps||networkIdParams;

  const {
    root, row, col,
  } = classes;

  const {
    team: teamReducer,
    auth,
  } = useSelector((state) => state);
  const user = auth?.user;

  const {
    teamDictionary,
  } = teamReducer;



  const adminProfiles = [];
  adminTeamIds.map((teamId)=>{
    const team = teamDictionary[teamId];

    const profileId = team?.parent?.profile;
    if (profileId) {
      adminProfiles.push(profileId);
    }
  });

  const allMyAdminProfiles = _.concat([user.profile], adminProfiles);

  const {
    teams: allProjectTeams,
  } = useGetTopProjects(allMyAdminProfiles);

  // NPTeams === Network Project Teams
  const allProjectTeamIds = allProjectTeams.map((team)=>team?._id);
  const [nPTeamIds, setNPTeamIds] = useState([]);
  const projectTeamIds = _.difference(allProjectTeamIds, nPTeamIds);


  const navName = nPTeamIds.length>0?'NetworkProjects':'AddProjects';
  const [nav, setNav] = useState(navName);
  const [open, setOpen] = useState(false);


  /**
     * Abhi permissions ka load nahi lete hain
     */

  // const adminProjectTeams = projectTeams.map(team=>{
  //     var participants = team.participants
  //     const commonMembers = _.intersection(participants,allMyAdminProfiles)
  //     const permissions = team.permissions;
  //     let hasAdminAccess = false
  //     const myRoles = commonMembers.filter(member=>{
  //         const role = permissions[member]

  //     })
  // })

  const addProject = async (teamId)=>{
    const projectTeam = teamDictionary[teamId];
    const res = await Api.post('brand/app/network/addProject', {
      projectTeam: projectTeam._id,
      project: projectTeam?.parent?._id,
      networkTeam: network?.ownerTeam,
      appNetwork: network?._id,
      user: user?._id,
    });

    const data = res?.data;

    if (data?._id) {
      const teamId = projectTeam._id;
      addNetworkProject(networkId, teamId, auth, dispatch);

      const newSet = new Set(nPTeamIds);
      newSet.add(teamId);
      setNPTeamIds(Array.from(newSet));
    }
  };

  const getProjects = async ()=>{
    const res = await Api.post('brand/app/network/getProjects', {
      networkId: network?._id,
    });
    const data = res?.data;


    setNetworkProjects(networkId, data, auth, dispatch);

    if (data?.length>0) {
      const networkProjectTeams = [];
      data.map((netP)=>{
        if (netP?.projectTeam) {
          networkProjectTeams.push(netP?.projectTeam);
        }
      });

      setNPTeamIds(networkProjectTeams);
    }
  };



  const removeProject = async (teamId)=>{
    const res = await Api.post('brand/app/network/removeProject', {
      networkId: network?._id,
      projectTeam: teamId,
    });

    const newNPteamIds = _.difference(nPTeamIds, [teamId]);
    setNPTeamIds(newNPteamIds);
    removeNetworkProject(networkId, teamId, auth, dispatch);
  };

  const reqs = rentalReqs;

  const onDelete = async (req, i)=>{
    const newArray = [...reqs.splice(0, i), ...reqs.splice(i+1)];
    setRentalReqs(newArray);
    await Api.post('brand/app/network/updateReq', {
      _id: req?._id,
      status: 'rejected',
    });
  };

  const assign = async (req, projectTeamId , unitId )=>{


    const res = await Api.post('brand/app/relation/assign', {
        reqId: req?._id,
        appNetwork: networkId,
        projectTeamId,
        unitId: unitId,
    });



  };

  const testCreateRentalReqs  = async ()=>{
    const res = await Api.post('brand/app/network/matchPasscode',{
      brandApp: network?.brandApp,
      passcode:'sujayapp',
      tenant:'622100a61eb31b7097676e82'
    })

    console.log(res,' is the res');

  }

  

  const testRentalReq  = async ()=>{


    const res = await Api.post('brand/app/network/getReqById',{
      reqId : "6229f3a56646a5c3e307eef6"
    })

    console.log(res,' is the testRentalReq')

}

   const createDoc = async ()=>{

    const tenant = tenants[tenants.length-1]

    if(tenant?._id){
      const docObject = {
        title:"This is a test document",
        description:'this is the test document description',
        shared:[{
          entity:'62381b57926ecfe31522a894',
          entityType:'DocFolder'
        }],
        user: '622100a51eb31b7097676e64',
        profile: '622100a61eb31b7097676e82',
        files: [],
      };
  
      Api.post('doc/create', docObject).then((res)=>{
        if (res&&res.data) {
          console.log(res.data,' is the res doc')
        }
      })
    }

   }

   const getDocs = async ()=>{

      const docObject = {
        profile: '622100a61eb31b7097676e82',
      };
  
      Api.post('doc/get', docObject).then((res)=>{
        if (res&&res.data) {
          console.log(res.data,' is the res doc')
        }
      })

   }


  useEffect(() => {

    if (network?._id) {
      getProjects();
    }
  }, [network?._id]);

  const ProjectTeams = (
    <div className={col}>
      <div className={row}>
        <div className={row}>

        </div>
        <CreateBtn
          open={open}
          setOpen={setOpen}

        >
                    Add New
        </CreateBtn>
      </div>

      <CreateProjectDialog
        open={open}
        setOpen={setOpen}
      />
      {projectTeamIds.map((teamId)=>{
        return <TeamActionCard teamId={teamId} key={teamId}
          onClick={()=>{
            addProject(teamId);
          }}
          btnText={'Add Project'}

        />;
      })}
    </div>
  );

  const NetworkProjects = (
    <>
      {nPTeamIds.map((teamId)=>{
        return <TeamActionCard teamId={teamId} key={teamId}
          onClick={()=>{
            removeProject(teamId);
          }}
          btnText={'Remove'}
        />;
      })}
    </>
  );

  const Tenants = (
    <>
      {tenants.map((tenant)=>{
        return <TenantCard key={tenant?._id}
          tenant={tenant}
        />;
      })}
    </>
  );

  const Applications = (
    <>

      <CreateBtn onClick={()=>{
        testCreateRentalReqs()
      }}>
        Test Create Rental Req
      </CreateBtn>
      
      <Button color="primary" onClick={()=>{
        assign(rentalReqs[0],'620d00f9221c8935de2547c4','621a45d1c4e651290211ca5c')
      }}>Assign</Button>

      <Button onClick={()=>{

        testRentalReq()
      }}>Get Req test</Button>

     <Button color="primary" onClick={()=>{
        createDoc()
      }}>Create Doc</Button>

      <Button color="primary" onClick={()=>{
        getDocs()
      }}>Get Docs</Button>

      {rentalReqs.map((req,i)=>{
        return (
          <RentalReqCard
            key={req?._id}
            rentalReq={req}
            onDelete={()=>{
              onDelete(req, i);
            }}
          />
        );
      })}
    </>
  );




  let View = null;

  switch (nav) {
    case 'NetworkProjects':
      View = NetworkProjects;
      break;

    case 'AddProjects':
      View = ProjectTeams;
      break;

    case 'Tenants':
      View = Tenants;
      break;

    case 'Applications':
      View = Applications;
      break;
  

    default:
      break;
  }

  return (
    <div className={root}>


      <MenuBar
        navState={nav}
        setNav={setNav}
        items={[


          {
            Icon: null,
            text: 'Tenants',
            navText: 'Tenants',
          },
          {
            Icon: null,
            text: 'Requests',
            navText: 'Applications',
          },
          {
            Icon: null,
            text: 'Projects',
            navText: 'NetworkProjects',
          },

          {
            Icon: null,
            text: 'Add Projects',
            navText: 'AddProjects',
          },
        ]}
      />

      {View}

    </div>
  );
}
