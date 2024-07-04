import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Api from "../../helpers/Api";
import Facebook from "@material-ui/icons/Facebook";
import Twitter from "@material-ui/icons/Twitter";
import LinkedIn from "@material-ui/icons/LinkedIn";
import Email from "@material-ui/icons/Email";
import nonLogin from "../styled/nonLogin";
import OrgProfileTopView from "./OrgProfileTopView";
import useGetAdminProfiles from "./useGetAdminProfiles";
import UserProfileTopView from "./UserProfileTopView";
import { Typography, useMediaQuery } from "@material-ui/core";
import GuestLayoutHeader from "../Navbar/GuestLayout.Header";
import GuestLayout from "../layout/GuestLayout";
import PostSideBar from "../post/PostSideBar";
import { Skeleton } from "@material-ui/lab";
import SuggestedCommunitySidebar from "../community/SuggestedCommunitiesSidebar";
import Community from "../community/Community";
import PostFile from "../post/PostFile";



// material Ui
const useStyles = makeStyles((theme) => ({
  ...nonLogin,
  container: {
    display: 'flex',
    flexDirection: "column",
    padding: "1rem",
    gap: "1rem",
    maxWidth: "1200px",
    margin: "0 auto",
    [theme.breakpoints.up('md')]: {
      flexDirection: "row",
      padding: "2rem",
    },
  }
}));

const guestSuggestedIds = ["62f77ad5f52e0962f99006a7",
  "62ee99802bc3474adcd97860",
  "62dbad48c4244f5181eefadf",
  "62dbad9ed905a051d6b36009",
  "6212006feb00153b85e09e78"]

const guestCommunity = {
  "62f77ad5f52e0962f99006a7": { displayName: 'joinPrivate' },
  "62ee99802bc3474adcd97860": { displayName: 'batCommunity' },
  "62dbad48c4244f5181eefadf": { displayName: 'test2' },
  "62dbad9ed905a051d6b36009": { displayName: 'test3' },
  "6212006feb00153b85e09e78": { displayName: 'new Community Test' }
}

export default function PublicPostView() {
  const classes = useStyles();

  const { root, col, suggested, community } = classes;
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const getProfile = async () => {
      Api.post("post/get", {
        _id: id,
      }).then((res) => {
        setPost(res);
      }).catch((err) => {
        console.log(err)
      })

    };
    getProfile()
  }, [])

  return (
    <GuestLayout
      HeaderProp={GuestLayoutHeader}
      headerHeight={"50px"}
    >
      <div className={classes.container}>
        <div style={{ flex: 1 }}>
          {post ? (
            <PostFile post={post} />
          ) : <>
            <Skeleton variant="rectangular" width={"100%"} height={400} />
          </>}
        </div>
        <div>
          <div><PostSideBar /></div>
          <div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                marginTop: "1rem"
              }}
            >
              <div style={{ padding: "0.5rem 1rem 0" }}>
                <Typography variant="h6" style={{ fontSize: "1.1rem" }}>
                  Suggested Communities
                </Typography>
              </div>
              <div style={{ padding: "1rem" }}>
                {(guestSuggestedIds).map((id) => (
                  <Community
                    key={id}
                    community={guestCommunity[id]}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </GuestLayout>
  )

}