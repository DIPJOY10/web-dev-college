import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Api from "../../helpers/Api";
import { setJobs } from "../job/job.utils";
import { setInvestments } from "../Investment/investment.utils";
import { setPosts } from "./Post/post.utils";
import { setApps } from "../apply/apply.utils";

function useDashboardData() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);
  const auth = useSelector((state) => state.auth);
  const { adminProfileIds, user } = auth;

  const userProfile = user?.profile;
  const userId = user?._id;

  useEffect(() => {
    // ;
    Api.post("dashboard/data", {
      user: userId,
      adminProfileIds:
        adminProfileIds?.length > 1 ? adminProfileIds : [userProfile],
    }).then((res) => {
      const data = res.data;

      if (data) {
        const { jobs, investments, applications, posts } = data;
        console.log(jobs, "Are the jobs");
        var jobDraft = [];
        var jobPublished = [];
        jobs.map((job) => {
          const jobId = job?._id;
          if (jobId) {
            if (job.published) {
              jobPublished.push(jobId);
            } else {
              jobDraft.push(jobId);
            }
          }
        });

        setJobs(jobs, dashboard, dispatch);

        var investmentDraft = [];
        var investmentPublished = [];
        investments.map((investment) => {
          const investmentId = investment?._id;
          if (investmentId) {
            if (investment.published) {
              investmentPublished.push(investmentId);
            } else {
              investmentDraft.push(investmentId);
            }
          }
        });

        setInvestments(investments, dashboard, dispatch);

        var postDraft = [];
        var postPublished = [];
        posts.sort((a, b) => (a.createdAt >= b.createdAt ? -1 : 1));
        posts.map((post) => {
          const postId = post?._id;
          if (postId) {
            if (post.published) {
              postPublished.push(postId);
            } else {
              postDraft.push(postId);
            }
          }
        });

        setPosts(posts, dashboard, dispatch);

        dispatch({
          type: "AddDashboard",
          payload: {
            jobDraftIds: jobDraft,
            jobPublishedIds: jobPublished,
            investmentDraftIds: investmentDraft,
            investmentPublishedIds: investmentPublished,
            postDraftIds: postDraft,
            postPublishedIds: postPublished,
          },
        });
      }
    });
  }, [adminProfileIds?.length]);

  // useEffect(() => {
  //   Api.post('apply/getProfileApps', {
  //     profileIds,
  //   }).then((data)=>{
  //     const {
  //       apps,
  //     } = data;

  //     setApps(apps, dashboard, dispatch);
  //   });
  // }, []);
}

export default useDashboardData;
