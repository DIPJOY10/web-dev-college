import React, { useState, useEffect } from "react";
import BasicPrivateRoute from "../components/PrivateRoute/BasicPrivateRoute";

import ProfileIssues from "../components/issue/profile.issues";
import ProfileIssueCreate from "../components/issue/profile.issue.create";
import ProfileIssueView from "../components/issue/profile.issue.view.manager";

import Docs from "../components/doc/profile.docs";
import DocCreate from "../components/doc/profile.doc.create";
import DocSign from "../components/doc/profile.doc.sign";
import DocTemplate from "../components/doc/profie.doc.template";
import DocEdit from "../components/doc/profile.doc.edit";
import DocEnvelope from "../components/doc/profile.doc.envelope";

import DocFolderCreate from "../components/doc/profile.doc.folder.create";
import DocView from "../components/doc/doc.view";
import DocFolderView from "../components/doc/folder.view";



// import DocView from "../components/doc/doc.view";
// import DocFolderView from "../components/doc/folder.view";

import AnalysisHome from "../components/ProjectAnalysis/AnalysisHome";
import { Loadinglogo } from "../helpers/loadinglogo";
import EditProfileIssue from "../components/issue/profile.issue.edit";
import ProfileIssueViewManager from "../components/issue/profile.issue.view.manager";
import IssueTimeline from "../components/issue/issue.timeline";
import IssueTimelineCreate from "../components/issue/issue.timeline.create";
import PropertyManagementHome from "../components/propertyManagement/index.js";
import IssueTimelineUpdate from "../components/issue/issue.timeline.update";
import BasicInfoSetup from "../components/brandApp/basic.info.setup";
import IssueTemplateViewManager from "../components/issue/issue.template.view.manager";
import IssueTemplateView from "../components/issue/issue.template.view";
import Disclaimer from "../components/ProjectAnalysis/Disclaimer.js";
import CriteriaManagement from "../components/ProjectAnalysis/Criteria.Management";
import ReportCompare from "../components/ProjectAnalysis/Report.Compare.js/ReportCompare";
import DocusignCallBack from "../components/callbacks/DocusignCallback";
import { Route } from "react-router-dom";
import PublicDocCreate from "../components/doc/public.doc/Public.Doc.Create";
import PublicDocEdit from "../components/doc/public.doc/Public.Doc.Edit";

// import Transactions from "../components/finance/transaction/transactions";

const Routes = () => {
  return [
    <BasicPrivateRoute
      exact
      path="/analysis/:teamId"
      noAppbar={true}
      useBothSide={true}
      component={AnalysisHome}
    />,
    <BasicPrivateRoute
      exact
      path="/investment/analysis/criteria/management"
      noAppbar={true}
      useBothSide={true}
      component={CriteriaManagement}
    />,
    <BasicPrivateRoute
      exact
      path="/investment/analysis/compare"
      noAppbar={true}
      useBothSide={true}
      component={ReportCompare}
    />,
    <BasicPrivateRoute
      exact
      path="/investment/analysis/compare/:compareId"
      noAppbar={true}
      useBothSide={true}
      component={ReportCompare}
    />,
    <BasicPrivateRoute
      exact
      path="/analysis/:direct/:teamId/new"
      noAppbar={true}
      useBothSide={true}
      component={AnalysisHome}
    />,
    <BasicPrivateRoute
      exact
      path="/analysis/disclaimer/:reportType"
      noAppbar={true}
      useBothSide={true}
      component={Disclaimer}
    />,
    <BasicPrivateRoute
      exact
      path="/brand/app/create/order/:brandAppId"
      noAppbar={true}
      useBothSide={true}
      component={BasicInfoSetup}
    />,
    // <BasicPrivateRoute
    //   exact
    //   path="/analysis/:teamId/:reportId"
    //   noAppbar={true}
    //   component={ReportCard}
    // />,
    // <BasicPrivateRoute
    // 	exact
    // 	path="/tasks/:teamId"
    // 	noAppbar={false}
    // 	component={Tasks}
    // />,
    // <BasicPrivateRoute
    // 	exact
    // 	path="/task/:teamId/create"
    // 	noAppbar={true}
    // 	component={TaskCreate}
    // />,
    // <BasicPrivateRoute
    // 	exact
    // 	path="/task/edit/:taskId"
    // 	component={TaskEdit}
    // />,
    // <BasicPrivateRoute exact path="/task/:taskId" component={TaskView} />,

    <BasicPrivateRoute
      exact
      useBothSide
      path="/issues/profile/:profileId"
      noAppbar={true}
      component={ProfileIssues}
    />,

    <BasicPrivateRoute
      exact
      path="/issues/create/:profileId/new"
      noAppbar={true}
      component={ProfileIssueCreate}
    />,

    <BasicPrivateRoute
      exact
      path="/issue/view/:issueId"
      noAppbar={true}
      component={ProfileIssueView}
    />,

    <BasicPrivateRoute
      exact
      path="/issue/edit/:issueId"
      editModeValue={true}
      noAppbar={true}
      component={ProfileIssueViewManager}
    />,

    <BasicPrivateRoute
      exact
      path="/issue/template/:templateId/edit"
      noAppbar={true}
      useBothSide
      component={IssueTemplateViewManager}
    />,
    <BasicPrivateRoute
      exact
      path="/issue/template/:templateId/view"
      noAppbar={true}
      useBothSide
      component={IssueTemplateView}
    />,

    // <BasicPrivateRoute
    //   exact
    //   path="/issues/:teamId"
    //   noAppbar={false}
    //   component={Issues}
    // />,
    // <BasicPrivateRoute
    //   exact
    //   path="/issue/:teamId/create"
    //   noAppbar={true}
    //   component={IssueCreate}
    // />,

    // <BasicPrivateRoute exact path="/issue/:issueId" component={IssueView} />,
    <BasicPrivateRoute
      exact
      noAppbar={true}
      path="/issue/timeline/:profileId"
      component={IssueTimeline}
    />,
    <BasicPrivateRoute
      exact
      noAppbar={true}
      path="/issue/timeline/:profileId/new"
      component={IssueTimelineCreate}
    />,
    <BasicPrivateRoute
      exact
      noAppbar={true}
      path="/issue/timeline/:profileId/update/:projectId"
      component={IssueTimelineUpdate}
    />,

    <BasicPrivateRoute
      exact
      path="/docs/:profileId"
      noAppbar={true}
      component={Docs}
    />,

    <BasicPrivateRoute
      exact
      path="/doc/folder/:folderId"
      noAppbar={true}
      component={DocFolderView}
    />,
    <BasicPrivateRoute
      exact
      path="/doc/view/:docId"
      noAppbar={true}
      useBothSide={true}
      component={DocView}
    />,

    <BasicPrivateRoute
      exact
      path="/docs/:profileId"
      noAppbar={false}
      component={Docs}
    />,
    <Route
      exact
      path="/docusign/callback"
      noAppbar={false}
      component={DocusignCallBack}
    />,
    <BasicPrivateRoute
      exact
      path="/doc/create/:profileId/new"
      noAppbar={true}
      useBothSide={true}
      component={DocCreate}
    />,
    <BasicPrivateRoute
      exact
      path="/publicdoc/create/:profileId/new"
      noAppbar={true}
      useBothSide={true}
      component={PublicDocCreate}
    />,
    <BasicPrivateRoute
      exact
      path="/doc/sign/:profileId/new"
      noAppbar={true}
      component={DocSign}
    />,
    <BasicPrivateRoute
      exact
      path="/doc/envelope/:profileId/new"
      noAppbar={true}
      component={DocEnvelope}
    />,
    <BasicPrivateRoute
      exact
      path="/doc/template/:profileId/new"
      noAppbar={true}
      component={DocTemplate}
    />,
    <BasicPrivateRoute
      exact
      path="/doc/edit/:docId"
      noAppbar={true}
      useBothSide={true}
      component={DocEdit}
    />,
    <BasicPrivateRoute
      exact
      path="/publicdoc/edit/:docId"
      noAppbar={true}
      useBothSide={true}
      component={PublicDocEdit}
    />,
    <BasicPrivateRoute
      exact
      path="/doc/folder/create/:profileId/new"
      noAppbar={true}
      component={DocFolderCreate}
    />,
    <BasicPrivateRoute
      exact
      path="/doc/folder/:folderId"
      noAppbar={true}
      component={DocFolderView}
    />,
    <BasicPrivateRoute
      exact
      path="/doc/:docId"
      noAppbar={true}
      component={DocView}
    />,

    // <BasicPrivateRoute exact path="/payments/:teamId" noAppbar={true} component={Transactions} />,

    //this logo is temp route. just to get approval
    <BasicPrivateRoute
      exact
      path="/logo"
      noAppbar={true}
      component={Loadinglogo}
    />,
    <BasicPrivateRoute
      exact
      path="/propertymanagement/:teamId"
      noAppbar={true}
      useBothSide={true}
      component={PropertyManagementHome}
    />,
  ];
};

export default Routes;
