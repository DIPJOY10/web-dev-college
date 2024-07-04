import React, { useState, useEffect } from "react";
import { ConnectedRouter } from "connected-react-router";
import { Button, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Switch, Route } from "react-router-dom";

import BasicPrivateRoute from "./components/PrivateRoute/BasicPrivateRoute";
import { CssBaseline } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import AuthPage from "./components/auth/Auth";
import { firebaseLoginHelper } from "./components/auth/auth.utils";

import firebase from "firebase";
import GuestRoute from "./components/GuestRoute/GuestRoute";
import Chat from "./components/chat/chat";
import ProfileChat from "./components/profileChat/index";

import chatUtils, { setConvAndMessages } from "./components/chat/chatUtils";
import TeamView from "./components/team/team.view";
import Projects from "./components/projects/projects";

import CreateProject from "./components/projects/createProject";

import { useFeedData } from "./components/explore/feed.hooks";
import DashboardRoutes from "./routes/dashboard.routes";
import ExploreRoutes from "./routes/explore.routes";
import TeamRoutes from "./routes/team.routes";
import BlogRoutes from "./routes/blog.routes";

import AdminRoutes from "./routes/admin.route";
import { useGetTeams } from "./components/team/team.hooks";
import { setJobCats } from "./components/job/job.utils";
import { setPropCats } from "./components/dashboard/Property/prop.utils";
import Account from "./components/account/account";

import CreateOrgranization from "./components/organization/CreateOrganization";
import teamUtils from "./components/team/team.utils";
import InvitationLink from "./components/team/invitation.link.handler";
// import Checkout from "./components/checkout/checkout";
import Subscription from "./components/finance/checkout/subscription/index";
import Checkout from "./components/finance/checkout/index";
import CheckoutBackdrop from "./components/finance/checkout/checkoutBackdrop";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./utils/theme";
import Api from "./helpers/Api";
import useChatSocket from "./components/chat/chatSocketHooks";
// import useTeamSocket from "./components/team/teamSocketHooks";
import Backdrop from "./components/styled/backdrop.style";
import CircularProgress from "@material-ui/core/CircularProgress";
import useDashboardData from "./components/dashboard/useDashboardData";
import JobView from "./components/job/job.view";
import { makeStyles } from "@material-ui/core/styles";
// import UserAccountSetting from "./components/account/UserAccountSetting";
// import OrgAccountSetting from "./components/account/OrgAccountSetting";
import useProfile from "./components/profile/useProfile";

import Landing from "./components/landing/index";
import useSocketHook from "./helpers/socket/useSocketHook";
import { useGetUserNotification } from "./components/activity/activity.hooks";
import Organizations from "./components/organization/organizations";
import Layout from "./components/layout";
import { ThemeProvider } from "styled-components";
import "./components/styled/scroll.css";
// import Doclist from "./components/doc/doc.list";
// import DocFolderList from "./components/doc/docFolderList";
// import DocFolderFile from "./components/doc/docFoldersFile";
import BrandAppView from "./components/brandApp/brand.app.view";
import BrandAppNetwork from "./components/brandApp/app.network.manage";
import AssingRentalReq from "./components/brandApp/assign.rental.request";
import RentalRelationView from "./components/ProjectAnalysis/rental.relation.view";

import AppFeePayment from "./components/brandApp/feePayment/index";
import NotificationAlert from "./components/activity/NotificationAlert";
import PayBackTx from "./components/finance/payBackTx";

import PaymentSuccess from "./components/styled/CommonComponents/PaymentSuccess.js";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import AuthBox from "./components/auth/AuthBox";
import TermsAndConditions from "./components/landing/termsAndConditions/TermAndConditions";
import Privacy from "./components/landing/termsAndConditions/Privacy";
import CommunityRules from "./components/landing/termsAndConditions/CommunityRules";
import ApiAlert from "./components/styled/alert/api.alert";
import DwollaPaymentStatusPage from "./components/styled/CommonComponents/DwollaPaymentStatusPage";
import { fetchUserInfo } from "./components/profile/api";
import PortfolioHome from "./components/Portfolio/index";
import LandingInvestmentAnalysis from "./components/landing/investmentAnalysis/index";
import SharePageRouter from "./components/PrivateRoute/SharePageRoute";
import GuestReportView from "./components/ProjectAnalysis/GuestReportView";
import GuestLayoutHeader from "./components/Navbar/GuestLayout.Header";
import OrgView from "./components/organization/OrgView";
import ReportCompare from "./components/ProjectAnalysis/Report.Compare.js/ReportCompare";
// import useFirebaseDelete from "./components/useFirebaseDelete";
// import OneSignal from 'react-onesignal';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "white",
    backgroundColor: theme.palette.primary.main,
    opacity: 0.1,
  },
}));

const App = (props) => {
  const classes = useStyles();
  const Auth = firebase.auth();
  const dispatch = useDispatch();
  const themeMI = useTheme();

  const state = useSelector((state) => state);
  const { chat, dashboard, auth, project, team, appGlobal } = state;
  const { user } = auth;
  const { backdropVisible } = appGlobal;
  const userId = user?._id;
  const profileId = user?.profile;


  const isMobile = useMediaQuery(themeMI?.breakpoints.down("xs"));

  useSocketHook(profileId);
  useGetUserNotification();
  // useDashboardData(userId);
  useFeedData();
  useProfile();

  useGetTeams();
  // useFileManager hook

  // useChatSocket(userId)
  // useTeamSocket(userId)
  // useFirebaseDelete()
  // useApiTest()
  async function testAuth() {
    const fireBaseUser = await firebase.auth();
    if (user && user.error && fireBaseUser && fireBaseUser.currentUser)
      firebaseLoginHelper(fireBaseUser?.currentUser, dispatch);
  }

  const token = localStorage.getItem("token");

  useEffect(() => {
    // dispatch({ type:'FileUploadReset'})

    if (Auth.currentUser) {
      if (!user?._id) {
        const currentUser = Auth.currentUser;
        firebaseLoginHelper(currentUser, dispatch);
      }
    }
    testAuth();
  }, [Auth.currentUser]);

  // useEffect(() => {
  //   Api.post("job/getJobTypes", {}).then((jobCats) => {
  //     setJobCats(jobCats, dashboard, dispatch);
  //   });

  //   Api.post("job/getPropTypes", {}).then((propCats) => {
  //     setPropCats(propCats, dashboard, dispatch);
  //   });

  //   return () => {};
  // }, []);

  // useEffect(() => {
  //   OneSignal.init({
  //     appId: "dd8e5c00-523b-4735-b07d-2cd4af497f58"
  //   });
  // }, []);

  useEffect(() => {
    if (user && user._id) {
      // Api.post("chat/findOrCreateBotConversation", {
      //   userId: user.profile,
      //   model: user.model,
      // }).then((res) => {
      //   Api.post("chat/findUserChat", {
      //     userId: user.profile,
      //   }).then((res) => {
      //     const convos = res?.data;

      //     setConvAndMessages(convos, state, dispatch, true, true);
      //     // initiateChat(user._id,chat,convos,dispatch)
      //   });
      // });

      Api.post("invite/getUserInvites", {
        user: user.profile,
      }).then((res) => {
        const invitations = res.invitations;

        dispatch({
          type: "AddTeam",
          payload: {
            invitations,
          },
        });
      });

      // Api.post('team/getTeams',{
      //   user:user._id
      // }).then(teams=>{

      //   handleTeams(teams,state,dispatch);

      // })

      // Api.post("team/basic", {}).then((data) => {
      //   const { taskLabels, issueLabels } = data;

      //   dispatch({
      //     type: "AddTeam",
      //     payload: {
      //       taskLabels: taskLabels || [],
      //       issueLabels: issueLabels || [],
      //     },
      //   });
      // });
    }
  }, [user]);

  // useEffect(() => {
  //   dispatch({
  //     type: "AddAuth",
  //     payload: {
  //       user: {
  //         ...user,
  //       },
  //     },
  //   });

  // }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={props.history}>
          <CssBaseline />
          <Switch>
            {BlogRoutes()}
            {ExploreRoutes()}
            {DashboardRoutes()}
            {TeamRoutes()}
            {AdminRoutes()}
            <BasicPrivateRoute
              exact
              path="/projects"
              component={Projects}
              noAppbar={true}
              useBothSide={true}
            />
            {/* <BasicPrivateRoute exact path="/projects/create" component={CreateProject} /> */}
            <BasicPrivateRoute
              exact
              path="/projects/:teamId"
              noAppbar={true}
              component={TeamView}
            />
            <BasicPrivateRoute
              exact
              path="/portfolio/:portfolioId"
              noAppbar={true}
              component={PortfolioHome}
            />
            {/* <BasicPrivateRoute exact path="/account/organizations/create" component={CreateOrgranization} /> */}
            <BasicPrivateRoute exact path="/account" component={Account} />
            {/* what is this about? */}
            {/* <BasicPrivateRoute
              exact
              path="/account/user/settings"
              component={UserAccountSetting}
            /> */}
            {/* <BasicPrivateRoute
              exact
              path="/account/org/settings/:orgId"
              component={OrgAccountSetting}
            /> */}

            <BasicPrivateRoute
              exact
              path="/organizations"
              component={Organizations}
            />
            <BasicPrivateRoute
              exact
              path="/organizations/:teamId"
              noAppbar={true}
              component={TeamView}
            />
            <BasicPrivateRoute
              exact
              path="/organizations/:teamId/orgView"
              noAppbar={true}
              component={OrgView}
            />
            <BasicPrivateRoute
              exact
              path="/profile/chat/:profileId/:convId"
              hideDrawer={false}
              noAppbar={true}
              component={ProfileChat}
            />
            <BasicPrivateRoute
              exact
              path="/messages"
              noAppbar={true}
              hideDrawer={isMobile ? true : false}
              component={ProfileChat}
            />
            <Route exact path="/payment/:txId">
              <PayBackTx />
            </Route>
            <BasicPrivateRoute
              exact
              path="/messages/:conversationId"
              noAppbar={true}
              component={ProfileChat}
            />
            <BasicPrivateRoute
              exact
              path="/brandApp/:appId/view"
              component={BrandAppView}
            />,
            <SharePageRouter
              exact
              path="/shared/report/analysis/:reportId/view"
              component={GuestReportView}
              HeaderProp={GuestLayoutHeader}
              dontNeedFooter={true}
              headerHeight={"50px"}
            />
            <SharePageRouter
              exact
              path="/investment/analysis/compare/:compareId/:publicParam/share"
              component={ReportCompare}
              HeaderProp={GuestLayoutHeader}
              dontNeedFooter={true}
              headerHeight={"50px"}
            />
            <Route exact path="/brandApp/tx/:appId">
              <AppFeePayment />
            </Route>
            {/* relatedInfo = appId or relatedInfo = stripeAccount */}
            <Route
              exact
              path="/:paymentpurpose/paid/success/:relatedinfo/:txId"
            >
              <PaymentSuccess />
            </Route>
            ,
            <Route exact path="/invoice/payment/status/:dwollaTxId/:txId">
              <DwollaPaymentStatusPage />
            </Route>
            ,
            {/* <Route exact path="/:paymentpurpose/paidbrandapp/success/:appId/:txId">
              <PaymentSuccess />
            </Route>,

            <Route exact path="/:paymentpurpose/paidtx/success/:stripeAccount/:txId">
              <PaymentSuccess />
            </Route>, */}
            ,
            <BasicPrivateRoute
              exact
              path="/brandAppNetwork/:networkId"
              component={BrandAppNetwork}
            />
            <BasicPrivateRoute
              exact
              path="/rental/request/:rentalReqId"
              component={AssingRentalReq}
            />
            ,
            <BasicPrivateRoute
              exact
              path="/tenant/:tenantRelationId"
              component={RentalRelationView}
            />
            ,
            <GuestRoute exact path="/signIn" component={AuthPage} />
            <Route exact path="/layout">
              <Layout>
                <h1>TITLE OF THE PAGE</h1>
                This is Layout for logged in pages
              </Layout>
            </Route>
            <Route exact path="/user/subscription">
              <Subscription />
            </Route>
            <Route exact path="/invitation/:invitationId">
              <InvitationLink />
            </Route>
            <Route exact path="/forgot-password">
              <ForgotPassword />
            </Route>
            <Route exact path="/reset-password">
              <ResetPassword />
            </Route>
            <Route exact path="/authenticate">
              <AuthBox />
            </Route>
            <Route exact path="/terms">
              <TermsAndConditions />
            </Route>
            <Route exact path="/investment/analysis/new">
              <LandingInvestmentAnalysis />
            </Route>
            <Route exact path="/privacy">
              <Privacy />
            </Route>
            <Route exact path="/rules">
              <CommunityRules />
            </Route>
            <GuestRoute exact path="/about" component={Landing} />
          </Switch>
          <Backdrop open={backdropVisible} />
          <CheckoutBackdrop />
          {/* <AuthPage /> */}
        </ConnectedRouter>
        <NotificationAlert />
        <ApiAlert />
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
