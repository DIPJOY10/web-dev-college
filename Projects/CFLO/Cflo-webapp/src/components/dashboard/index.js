import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Posts from "./Post/posts.card";
import Investments from "../Investment/investments.card";
import Organizations from "../organization/organizations";
import { Button, Snackbar, useMediaQuery } from "@material-ui/core";
import Jobs from "../job/jobs.card";
import { useTheme } from "styled-components";
import ProfileData from "../profile/cards";
import Paper from "@material-ui/core/Paper";
import MyNavBar from "../styled/CommonComponents/MyNavBar";
import ShowYouTube from "./ShowYouTube";
import ProfileAppbar from "../profile/profile.appbar";
import YoutubeTuts from "../youtubeTuts";
import Portfolio from "../Portfolio/Portfolio.js";
import investmentAnalysisIcon from "../../Assets/investmentAnalysis.png";
import AnalysisCardSvg from "../../Assets/analysisCard.svg";
import ProjectManagementCardSvg from "../../Assets/proj_mgmt_logo.svg";
import DocumentCardSvg from "../../Assets/Doc_logo.svg";
import AccountingCardSvg from "../../Assets/accounting_logo.svg";
import ReportAnalysisSvg from "../../Assets/report_analysis_logo.png";
import DocCardSvg from "../../Assets/docCard_logo.PNG";
import { Alert } from "@material-ui/lab";
import Api from "../../helpers/Api";

import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Chip from "@material-ui/core/Chip";
import SelectDocDialog from "../doc/select.dialog";

const useStyles = makeStyles((theme) => ({
  mainCont: {
    marginTop: "65px",
  },
  // exploreCont: {
  //   width: "100%",
  //   display: "flex",
  //   justifyContent: "space-around",
  //   alignItems: "center",
  //   flexWrap: "wrap",
  // },
  // orgOrPortfolioCont: {
  //   width: "450px",
  //   backgroundColor: "white",
  // },
  // analysisBtnCont: {
  //   width: "450px",
  //   display: "flex",
  //   justifyContent: "center",
  //   padding: "15px 0px",
  //   marginBottom: "10px",
  // },
  // tablesCont: {
  //   width: "450px",
  //   display: "flex",
  //   flexDirection: "column",
  //   paddingBottom: "3px",
  // },
  // cardsCont: {
  //   width: "100%",
  //   marginTop: "35px",
  // },
  mainContForDesktop: {
    marginTop: "65px",
    display: "flex",
    justifyContent: "space-around",
    paddingBottom: "5px",
  },
  left_container: {
    flex: 0.65,
    marginLeft: "4rem",
    marginTop: "20px",
  },
  right_container: {
    flex: 0.3,
    marginTop: "20px",
    marginRight: "4rem",
  },
  left_top: {
    display: "flex",
    // width: "95%",
    borderRadius: "17px",
    justifyContent: "space-around",
    padding: "10px",
  },
  left_top_img: {
    width: "160px",
    height: "75px",
  },
  left_top_header: {
    color: "#00345D",
    fontWeight: "600",
    textAlign: "center",
    paddingBotom: "10px",
  },
  left_cards: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card_container: {
    zIndex: "1",
    position: "relative",
    padding: "0 1rem",
    width: "200px",
    height: "270px",
    flex: "45%",
    borderRadius: "8px",
    marginTop: "1rem",
    "&:nth-child(odd)": {
      marginRight: "2.5rem",
    },
    display: "flex",
    flexDirection: "column",
  },
  orgContainer: {
    width: "92%",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
  },
  card_header: {
    zIndex: "1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2px",
    "&>p": {
      color: "#00345D",
      fontWeight: "600",
      fontSize: "16px",
    },
  },
  criteria_section: {
    background: "#F9F9F9",
    borderRadius: "16px",
    padding: "10px",
    width: "97%",
  },
  criteria_head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "&>:nth-last-child(2)": {
      color: "#333333",
      fontSize: "14px",
      fontWeight: "600",
    },
    "&>:nth-last-child(1)": {
      color: "#407BFF",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
      marginRight: "1rem",
    },
  },
  criteria_tail: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    "& .MuiChip-root": {
      background: "rgba(183, 205, 255, 0.43)",
      borderRadius: "6px",
    },
  },
  create_report_section: {
    background: "#F9F9F9",
    borderRadius: "16px",
    padding: "15px",
    paddingBottom: "25px",
    width: "97%",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    fontWeight: "600",
    "&>:nth-child(1)": {
      flex: "0.8",
      color: "#2196f3",
      fontSize: "14px",
    },
    "&>:nth-child(2)": {
      color: "#407BFF",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
      marginRight: "1rem",
    },
  },
  docCardLogo: {
    width: "65%",
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    opacity: "0.5",
  },
  activity_card: {
    marginTop: "1rem",
    width: "92%",
    height: "270px",
    borderRadius: "8px",
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();
  // const { profileId } = useParams();
  const {
    left_top,
    left_top_img,
    left_top_header,
    left_top_card,
    orgContainer,
    left_cards,
    left_container,
    right_container,
    card_container,
    card_header,
    criteria_section,
    criteria_head,
    criteria_tail,
    create_report_section,
    docCardLogo,
    activity_card,
  } = classes;
  const theme = useTheme();
  const dispatch = useDispatch();

  const { user, userProfile } = useSelector((state) => state.auth);
  const [openSignSucess, setOpenSignSuccess] = useState(false);

  const history = useHistory();
  const [show, setShow] = useState("home");
  const [docDialogOpen, setDialogOpen] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickSignSuccess = () => {
    setOpenSignSuccess(true);
  };

  const handleCloseSignSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSignSuccess(false);
  };

  const parseUrlForSign = () => {
    const codeFromUrl = window.location.href.split("?code=")[1];
    localStorage.setItem("codeFromUrl", codeFromUrl);
    const payload = { codeFromUrl: codeFromUrl };
    Api.post("doc/sign/authdata", payload)
      .then((res) => {
        dispatch({
          type: "SignToken",
          payload: {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
          },
        });
      })
      .catch((err) => console.log(err));
    dispatch({
      type: "DocSignAuth",
      payload: codeFromUrl,
    });
    if (codeFromUrl) handleClickSignSuccess();
  };

  useEffect(() => {
    // parseUrlForSign();
  }, []);
  return (
    <>
      <Snackbar
        open={openSignSucess}
        autoHideDuration={6000}
        onClose={handleCloseSignSuccess}
      >
        <Alert
          onClose={handleCloseSignSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Signature Provider Integration Success!
        </Alert>
      </Snackbar>
      <ProfileAppbar
        name={"Dashboard"}
        isUser={true}
        btns={
          <>
            <YoutubeTuts
              name={"CFLO Intro"}
              dialogTitle={"Introduction to ContractFlo"}
            />
          </>
        }
      />
      {!isMobile ? (
        <div className={classes.mainContForDesktop}>
          {/* do the stuff here */}
          <div className={left_container}>
            <Paper className={left_top}>
              {/* background: #00345D; */}
              <div className={left_top_card}>
                <img className={left_top_img} src={AnalysisCardSvg} />
                <p className={left_top_header}>Investment Analysis</p>
              </div>
              <div className={left_top_card}>
                <img className={left_top_img} src={AccountingCardSvg} />
                <p className={left_top_header}>Accounting & Payments</p>
              </div>
              <div className={left_top_card}>
                <img className={left_top_img} src={DocumentCardSvg} />
                <p className={left_top_header}>Documents</p>
              </div>
              <div className={left_top_card}>
                <img className={left_top_img} src={ProjectManagementCardSvg} />
                <p className={left_top_header}>Project Management</p>
              </div>
            </Paper>
            <div className={left_cards}>
              <Paper className={card_container}>
                <div className={card_header}>
                  <p>Investment Analysis</p>
                  <IconButton
                    aria-label="add org"
                    // className={classes.createBtn}
                    color="primary"
                    onClick={() => {
                      history.push("/investment/analysis/new");
                    }}
                  >
                    <AddBoxIcon />
                  </IconButton>
                </div>
                <div className={criteria_section}>
                  <div className={criteria_head}>
                    <p>User Criteria</p>
                    <p
                      onClick={() => {
                        history.push("/investment/analysis/compare");
                      }}
                    >
                      Compare
                    </p>
                  </div>
                  <div className={criteria_tail}>
                    <Chip label="Rental Criteria" />
                    <Chip label="BRRRR Criteria" />
                    <Chip label="Flip Criteria" />
                    <IconButton
                      aria-label="add org"
                      // className={classes.createBtn}
                      color="primary"
                      onClick={() => {
                        history.push(
                          "/investment/analysis/criteria/management"
                        );
                      }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
                <div className={create_report_section}>
                  <p>Analyze real estate properties (Rentals, BRRRRs, Flips)</p>
                  <p
                    onClick={() => {
                      history.push("/investment/analysis/new");
                    }}
                  >
                    Create Report
                  </p>
                  {/* <img src={ReportAnalysisSvg} /> */}
                </div>
              </Paper>
              <Paper className={card_container}>
                <div className={card_header}>
                  <p>Documents</p>
                  <IconButton
                    aria-label="add org"
                    // className={classes.createBtn}
                    color="primary"
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    <AddBoxIcon />
                  </IconButton>
                </div>
                <img src={DocCardSvg} className={docCardLogo} />
              </Paper>
              {docDialogOpen && (
                <SelectDocDialog
                  // profileId={profileId}
                  setDialogOpen={setDialogOpen}
                  // avialableTemplates={avialableTemplates}
                />
              )}
              <Paper className={card_container}>
                <div className={card_header}>
                  <p>Accounts & Payments</p>
                  <IconButton
                    aria-label="add org"
                    // className={classes.createBtn}
                    color="primary"
                  >
                    <AddBoxIcon />
                  </IconButton>
                </div>
              </Paper>
              <Paper className={card_container}>
                <div className={card_header}>
                  <p>Project Management</p>
                  <IconButton
                    aria-label="add org"
                    // className={classes.createBtn}
                    color="primary"
                  >
                    <AddBoxIcon />
                  </IconButton>
                </div>
              </Paper>
            </div>
          </div>
          <div className={right_container}>
            <Paper
              className={orgContainer}
              // style={{ marginBottom: "15px" }}
            >
              <Organizations />
            </Paper>
            <Paper className={activity_card}></Paper>
          </div>
          {/* <div className={classes.cardsCont}>
            <ProfileData
              walletId={user.wallet}
              profileId={user.profile}
              isAdmin={true}
              isWithoutBG={true}
              cards={[
                "AnalysisAdmin",
                "AccountingAdmin",
                "DocsAdmin",
                "PMAdmin",
              ]}
            />
          </div> */}
          {/* <div className={classes.tablesCont}>

          </div> */}

          {/* <Paper elevation={2} className={classes.orgOrPortfolioCont} >
            <Portfolio
              walletId={user?.wallet}
            />
          </Paper> */}
        </div>
      ) : (
        <>
          <div className={classes.mainCont}>
            <ProfileData
              walletId={user.wallet}
              profileId={user.profile}
              isAdmin={true}
              isWithoutBG={true}
              cards={[
                "AnalysisAdmin",
                "AccountingAdmin",
                "DocsAdmin",
                "PMAdmin",
              ]}
            />

            {/* <MyNavBar
              title={""}
              show={show}
              setShow={setShow}
              walletId={user?.wallet}
              Component={null}
              isMenu={false}
              options={[
                {
                  value: "home",
                  label: "Home",
                  Component: (
                    <></>
                  ),
                },
                {
                  value: "explore",
                  label: "Explore",
                  Component:
                    <div className={classes.exploreCont} >
                      <Jobs />
                      <Investments />
                      <Posts />
                    </div>
                },
                {
                  value: "org",
                  label: "Organization",
                  Component: <Organizations />,
                },
                {
                  value: "portfolio",
                  label: "Portfolio",
                  Component: <Portfolio
                    walletId={user?.wallet}
                  />
                }
              ]}
            /> */}
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
