import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import RedditIcon from '@material-ui/icons/Reddit';
import EmailIcon from '@material-ui/icons/Email';
import TelegramIcon from '@material-ui/icons/Telegram';
import {
    FacebookShareButton, RedditShareButton, TwitterShareButton,
    LinkedinShareButton, EmailShareButton, TelegramShareButton,
} from "react-share";
import { Box } from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        alignItems: "center"
    },
    socialIconMargin: {
        marginRight: "10px",
        [theme.breakpoints.down("xs")]: {
            marginRight: "5px",
        }
    }
}));

export default function SocialShareBtn(props) {
    const { shareLink } = props
    const classes = useStyles();



    return (
        <Box className={classes.container}>
            <FacebookShareButton url={shareLink} >
                <FacebookIcon
                    style={{
                        color: "#6E89C7",
                        fontSize: "40px",
                    }}
                    className={classes.socialIconMargin}
                />
            </FacebookShareButton>
            <TwitterShareButton url={shareLink} >
                <TwitterIcon
                    style={{
                        backgroundColor: "#81D9FC",
                        color: "white",
                        padding: "4px",
                        fontSize: "30px",
                        borderRadius: "3px",
                    }}
                    className={classes.socialIconMargin}
                />
            </TwitterShareButton>
            <LinkedinShareButton url={shareLink} >
                <LinkedInIcon
                    style={{
                        color: "#0A66C2",
                        fontSize: "40px",
                    }}
                    className={classes.socialIconMargin}
                />
            </LinkedinShareButton>
            <RedditShareButton url={shareLink} >
                <RedditIcon
                    style={{
                        backgroundColor: "#FF4500",
                        color: "white",
                        padding: "4px",
                        fontSize: "30px",
                        borderRadius: "3px",
                    }}
                    className={classes.socialIconMargin}
                />
            </RedditShareButton>
            <TelegramShareButton url={shareLink} >
                <TelegramIcon
                    style={{
                        backgroundColor: "#81D9FC",
                        color: "white",
                        padding: "4px",
                        fontSize: "30px",
                        borderRadius: "3px",
                    }}
                    className={classes.socialIconMargin}
                />
            </TelegramShareButton>
            <EmailShareButton url={shareLink} >
                <EmailIcon
                    style={{
                        color: "#6E89C7",
                        fontSize: "40px",
                    }}
                    className={classes.socialIconMargin}
                />
            </EmailShareButton>
        </Box>
    );
}
