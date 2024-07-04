import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// import Network from "./network.card";
import PaymentCard from "./payment.card";
import Doc from "./doc.card";
// import AnalysisCard from "./Analysis.card";
import WorkFlowCard from "./workflow.card";
import PMCard from "./PropertyManagement.card";
import Api from "../../../helpers/Api";
import { Paper } from "@material-ui/core";
import AnalysisCard from "./Analysis.card"
import AnalysisAdminCard from "./AnylysisAdmin.card";
import AppPanel from "../../brandApp/brand.app.panel";
import AccountingAdmin from "./AccountingAdmin";
import ProjectMangement from "./ProjectManagement";
import DocsCard from "./DocsCard";


const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    border: "1px solid white",
    borderRadius: "5px",
    backgroundColor: "#fafafa",
    justifyContent: "center",
  },
  rootAdmin: {
    width: "100%",
    display: "flex",
    backgroundColor: "#F5F5F5",
    justifyContent: "space-around",
    flexWrap: "wrap"
  }
}));

export default function ProfileData(props) {
  const classes = useStyles();
  const { walletId, profileId, isAdmin = false, isWithoutBG = false, cards = [], teamId } = props;

  const { user } = useSelector((state) => state.auth);

  const [docs, setDocs] = useState([]);
  const [issues, setIssues] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [chartAccounts, setChartAccounts] = useState([]);
  const [loading, setloading] = useState(true);
  // change this to true to activate loading before fetch

  const getData = async () => {
    const res = await Api.post("profile/getData", {
      userId: user?._id,
      profileId,
      walletId,
      isAdmin,
    });

    setloading(false);

    if (res?.data) {
      const data = res.data;
      setDocs(data?.docs);
      setIssues(data?.issues);

      if (isAdmin) {
        setConversations(data?.conversations);
        setChartAccounts(data?.chartAccounts);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getCards = () => {
    return cards.map(card => {
      switch (card) {
        case 'Accounting':
          return <PaymentCard walletId={walletId} />
          break;

        case "AccountingAdmin":
          return <AccountingAdmin />
          break;

        case 'Workflow':
          return <WorkFlowCard
            loading={loading}
            profileId={profileId}
            isAdmin={isAdmin}
            issues={issues}
          />
          break;

        case 'Docs':
          return <Doc
            loading={loading}
            profileId={profileId}
            isAdmin={isAdmin}
            docs={docs}
          />
          break;

        case "DocsAdmin":
          return <DocsCard />
          break;

        case 'PM':
          return <PMCard
            loading={loading}
            teamId={teamId}
          />
          break;

        case "PMAdmin":
          return <ProjectMangement />
          break;

        case 'Analysis':
          return <AnalysisCard
            loading={loading}
            teamId={teamId}
          />
          break;

        case 'AnalysisAdmin':
          return <AnalysisAdminCard
          />
          break;

        case 'BrandApp':
          return <AppPanel
            profileId={profileId}
          />
          break;

        default:
          break;
      }
    })
  }

  return (
    <>
      {/* <div className={classes.actionList}> */}
      <Paper elevation={isWithoutBG ? 0 : 2} className={isWithoutBG ? classes.rootAdmin : classes.root}>
        {getCards()}
      </Paper>
      {/* </div> */}
    </>
  );
}
