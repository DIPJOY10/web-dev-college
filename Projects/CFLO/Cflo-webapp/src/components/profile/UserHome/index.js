// import React, { useEffect, useRef, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Paper from "@material-ui/core/Paper";
// import { makeStyles, useTheme } from "@material-ui/core/styles";
// import teamUtils from "./team.utils";
// import {
//   Network,
//   Task,
//   Payment,
//   Issue,
//   Discussion,
//   Doc,
//   AnalysisCard,
//   WorkFlowCard,
// } from "./cards/index";
// import TeamActionList from "./team.action.list";
// import Navigation from "./navigation";
// import { useParams, useHistory } from "react-router-dom";
// import TeamActivities from "../activity/team.activity.timeline";
// import PropertyManagementCard from "./cards/PropertyManagement.card";
// import costomDialog from "../finance/transaction/Dialog";

// const { handleTeamData } = teamUtils;

// const useStyles = makeStyles((theme) => ({
//   actionList: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: "2rem",
//     marginBottom: "2rem",
//     padding: "1rem",
//     justifyContent: "center",
//   },
// }));

// export default function UserHome(props) {
//   const classes = useStyles();
//   const [open, setOpen] = useState(false);

//   const { teamId } = useParams();
//   const dispatch = useDispatch();
//   const state = useSelector((state) => state);
//   const teamReducer = useSelector((state) => state.team);
//   const { teamDictionary } = teamReducer;
//   const { teamIds, sortedProjectTeamIds, sortedProjectMap } = teamReducer;
//   const team = teamDictionary[teamId];
//   const profileId = team?.parent?.profile;
//   const parent = team?.parent;
//   const walletId = team?.walletId;

//   useEffect(() => {
//     if (teamId) {
//       handleTeamData(teamId, state, dispatch);
//     }
//   }, [teamId]);

//   return (
//     <>
//       <div className={classes.actionList}>
//         {/* <Network teamId={teamId} /> */}
//         <Payment walletId={walletId} />
//         {/* <Task teamId={teamId} /> */}

//         {/* <Issue teamId={teamId} /> */}
//         <WorkFlowCard profileId={profileId} />
//         {/* <Discussion teamId={teamId}/> */}
//         <Doc profileId={profileId} />
//         {team?.parentModelName == "Project" ? (
//           <>
//             <AnalysisCard teamId={teamId} />
//             <PropertyManagementCard teamId={teamId} />
//           </>
//         ) : null}
//       </div>
//     </>
//   );
// }
