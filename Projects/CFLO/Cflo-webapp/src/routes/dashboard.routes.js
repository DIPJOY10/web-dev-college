import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import BasicPrivateRoute from "../components/PrivateRoute/BasicPrivateRoute";


import Dashboard from "../components/dashboard/index";

import EditInvestment from "../components/Investment/edit.investment";
import InvestmentView from "../components/Investment/investment.view";
import Investments from "../components/Investment/investments";

import Jobs from "../components/job/jobs";
import CreateJob from "../components/dashboard/Job/CreateJob";
import EditJob from "../components/job/EditJob";
import JobTypes from "../components/dashboard/Job/job.types";
import JobPropTypes from "../components/dashboard/Job/prop.types";
import JobView from "../components/job/job.view";
import JobManageView from "../components/job/job.manage.view";
import JobAppView from "../components/job/job.app";

import CreatePost from "../components/dashboard/Post/create.post";
import PostView from "../components/dashboard/Post/post.view";
import Post from "../components/dashboard/Post/posts";
import ForumActivity from "../components/dashboard/Post/posts";
import JobApplications from "../components/job/job.applications";
import JobApplicationView from "../components/job/job.application.view";
import CreateCommunity from "../components/community/CreateCommunity";
import InvestmentApplicationView from "../components/Investment/investment.application.view";
import InvestmentApplications from "../components/Investment/investment.applications";


import Test from "../components/activity/Test";

const Routes = (props) => {
  return [
    <BasicPrivateRoute
      exact
      path="/dashboard/test"
      noAppbar={true}
      component={Test}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/investment/manage/:investmentId"
      noAppbar={true}
      component={InvestmentApplications}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/investment/manage/:investmentId/:appId"
      noAppbar={true}
      component={InvestmentApplicationView}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/job/manage/:jobId"
      noAppbar={true}
      component={JobApplications}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/job/manage/:jobId/:appId"
      noAppbar={true}
      component={JobApplicationView}
    />,
    <BasicPrivateRoute
      exact
      path="/"
      component={Dashboard}
      noAppbar={true}
      useBothSide={true}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/test"
      component={CreateCommunity}
    />,

    <BasicPrivateRoute
      exact
      path="/dashboard/create/post"
      noAppbar={true}
      component={CreatePost}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/ForumActivity"
      component={ForumActivity}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/post/:postId"
      component={PostView}
    />,

    <BasicPrivateRoute
      exact
      path="/dashboard/create/job"
      component={CreateJob}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/jobs"
      component={Jobs}
      noAppbar={true}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/job/:jobId"
      component={JobView}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/job/app/:appId"
      component={JobAppView}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/job/categories/:jobId"
      component={JobTypes}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/job/property/categories/:jobId"
      component={JobPropTypes}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/edit/job/:jobId"
      noAppbar={true}
      component={EditJob}
    />,


    <BasicPrivateRoute
      exact
      path="/dashboard/investments"
      noAppbar={true}
      component={Investments}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/investment/:investmentId"
      component={InvestmentView}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/edit/investment/:investmentId"
      noAppbar={true}
      component={EditInvestment}
    />,

    <BasicPrivateRoute
      exact
      path="/dashboard/forum"
      noAppbar={true}
      component={Post}
    />,
  ];
};

export default Routes;
