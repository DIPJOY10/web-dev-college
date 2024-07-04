import React, { useState, useEffect } from "react";
import BasicPrivateRoute from "../components/PrivateRoute/BasicPrivateRoute";
import PublicPrivateRoute from "../components/PrivateRoute/PublicPrivateRoute";
import Explore from "../components/explore/explore";

import Search from "../components/profile/advanced.search";

import PostView from "../components/dashboard/Post/post.view";
import JobView from "../components/job/job.view";
import InvestmentView from "../components/Investment/investment.view";
import Apply from "../components/apply/apply.create";

import { Switch, Route } from "react-router-dom";

import EntityView from "../components/profile/entity.view";
import InvestmentFeed from "../components/explore/investment.feed";
import JobFeed from "../components/explore/job.feed";
import PostFeed from "../components/explore/post.feed";
import ProfileView from "../components/profile/profile.view";
import ExploreCommunity from "../components/community/ExploreCommunity";
import CommunityPage from "../components/community/CommunityPage";
import UploadPost from "../components/community/UploadPost";
import EditPost from "../components/community/EditPost";
import Post from "../components/post/Post";
import PostFile from "../components/post/PostFile";
import MentionInput from "../components/file/Viewer/FilesObjectViewer";
import AuthBox from "../components/auth/AuthBox";
import JobApply from "../components/job/job.apply";
import InvestmentApply from "../components/Investment/investment.apply";
import JobApplyForm from "../components/job/jobapply.form";
import ApplyCreate from "../components/apply/apply.create";
import ApplyInvestmentCreate from "../components/Investment/apply.create";
import PostPageLayout from "../components/post/PostPageLayout";
import Forum from "../components/community/Forum";
import CreateCommunityPost from "../components/community/createCommunityPost";
import Moderation from "../components/community/moderation/Moderation";
import SchedulerFormTester from "../components/scheduler/SchdeulerFormTester";
import PublicProfileView from "../components/profile/public.profile.view";
import PreLogin from "../components/preLogin/PreLogin";
import YourForum from "../components/community/YourForum";
import PublicPostView from "../components/profile/public.post.view";
import DocResources from "../components/resources/Doc.Resources"


const Routes = () => {
  return [
    // <BasicPrivateRoute
    // 	exact
    // 	path="/"
    // 	component={PostPageLayout}
    // 	useRightSide
    // />,
    <BasicPrivateRoute
      exact
      path="/feed"
      component={PostPageLayout}
      useRightSide
    />,
    <BasicPrivateRoute exact path="/feed/apply" component={Apply} />,
    <BasicPrivateRoute exact path="/explore" component={Explore} />,
    <BasicPrivateRoute
      //   useBothSide
      exact
      path="/temp"
      component={SchedulerFormTester}
    />,
    <BasicPrivateRoute
      exact
      path="/explore/invest"
      component={InvestmentFeed}
    />,
    <BasicPrivateRoute exact path="/explore/jobs" component={JobFeed} />,
    <BasicPrivateRoute
      exact
      path="/dashboard/job/apply/:jobId"
      component={JobApply}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/investment/apply/:investmentId"
      component={InvestmentApply}
      noAppbar={true}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/investment/apply/:investmentId/applyform/:userId"
      component={ApplyInvestmentCreate}
      noAppbar={true}
    />,
    <BasicPrivateRoute
      exact
      path="/dashboard/job/apply/:jobId/applyform/:userId"
      noAppbar={true}
      component={ApplyCreate}
    />,
    // <BasicPrivateRoute exact path="/explore/forum" component={PostFeed} />,
    <BasicPrivateRoute
      exact
      path="/explore/forum/"
      component={Forum}
      useRightSide
    />,
    <BasicPrivateRoute
      exact
      path="/explore/doc/resources"
      component={DocResources}
      useBothSide={true}
      useRightSide
    />,
    <BasicPrivateRoute
      exact
      path="/explore/forum/yourforums"
      component={YourForum}
      useRightSide
    />,
    <BasicPrivateRoute
      exact
      path="/explore/forum/communities"
      component={ExploreCommunity}
    />,
    <BasicPrivateRoute
      exact
      path="/explore/forum/draft/:postId"
      component={EditPost}
    />,
    <BasicPrivateRoute
      exact
      path="/explore/forum/draft"
      component={UploadPost}
    />,
    <BasicPrivateRoute
      exact
      path="/explore/forum/communities/:communityNameSlug"
      component={CommunityPage}
      useBothSide
    />,
    <BasicPrivateRoute
      exact
      path="/explore/forum/communities/:communityId/new"
      component={CreateCommunityPost}
      useBothSide
    />,
    <BasicPrivateRoute
      exact
      path="/explore/forum/communities/:communityId/mod"
      component={Moderation}
      hideDrawer
      modDrawer
    />,
    <Route exact path="/explore/test" component={AuthBox} />,
    <Route exact path="/preLogin" component={PreLogin} />,
    <BasicPrivateRoute exact path="/feed/post/:postId" component={PostView} />,
    <BasicPrivateRoute exact path="/feed/job/:jobId" component={JobView} />,
    <BasicPrivateRoute
      exact
      path="/feed/investment/:investmentId"
      component={InvestmentView}
    />,
    <PublicPrivateRoute
      path="/profile/view/:profileId"
      component={ProfileView}
      PublicComponent={PublicProfileView}
    />,
    <PublicPrivateRoute
      path="/explore/forum/post/:id"
      component={PostFile}
      PublicComponent={PublicPostView}
    />,
    <BasicPrivateRoute path="/search" component={Search} />,
  ];
};

export default Routes;
