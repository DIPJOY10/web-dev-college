import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import EmailIcon from "@material-ui/icons/Email";
import config from '../../../config/index'


const useStyles = makeStyles((theme) => ({

    footerMainCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "76px",
        marginBottom: "0px",
        padding: "0px 30px",
        backgroundColor: "#2e73f8",
        position: "absolute",
        bottom: "0px",
        [theme.breakpoints.down("sm")]: {
            position: "relative",
        },
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
            justifyContent: "center",
            paddingBottom: "20px",
            paddingTop: "30px",
        },
    },

    socialMediaCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            marginTop: "30px",
        },
    },

    iconCont: {
        padding: "5px",
        borderRadius: "50%",
        border: "2px solid",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "10px",
        cursor: "pointer",
        color: "white",
        textDecoration: "none",
    },

    tagLine: {
        fontSize: "16px",
        fontWeight: "550",
        textAlign: "center",
        color: "white",
    },

    copyright: {
        fontSize: "14px",
        fontWeight: "550",
        opacity: "0.8",
        textAlign: "center",
        color: "white",
    },

    subFooter: {
        width: "300px",
    },
    footerTop: {
        borderTop: "1px solid #d2cece",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "100px",
        padding: "30px 0px",
        marginBottom: "-1px",
        backgroundColor: theme.palette.primary.main,
        "& a": {
            textDecoration: "none",
            fontSize: "13px",
            textAlign: "center",
            color: "white"
        }
    },


}));

const Footer = (props) => {

    const classes = useStyles();
    const { position } = props;
    const {

    } = classes;


    return (
        <div className={classes.footerMainCont} style={position ? { position: position, marginTop: "0px" } : {}}  >
            <div className={classes.subFooter}>
                <p className={classes.tagLine}>
                    A Real Estate Network Company
                </p>
                <p className={classes.copyright}>
                    Copyright © 2021-2022
                </p>
            </div>
            <div className={classes.subFooter}>
                <div className={classes.socialMediaCont}>

                    <a className={classes.iconCont}>
                        {" "}
                        <FacebookIcon
                            style={{ fontSize: "30px" }}
                        />{" "}
                    </a>


                    <a
                        target="_blank"
                        href="https://twitter.com/ContractFloHQ"
                        className={classes.iconCont}
                    >
                        {" "}
                        <TwitterIcon
                            style={{ fontSize: "30px" }}
                        />{" "}
                    </a>


                    <a
                        target="_blank"
                        href="https://www.linkedin.com/company/13470291/"
                        className={classes.iconCont}
                    >
                        {" "}
                        <LinkedInIcon
                            style={{ fontSize: "30px" }}
                        />{" "}
                    </a>


                    <a
                        target="_blank"
                        href={`mailto:${config?.landingPageMailID}`}
                        className={classes.iconCont}
                    >
                        {" "}
                        <EmailIcon
                            style={{ fontSize: "30px" }}
                        />{" "}
                    </a>

                </div>
            </div>
        </div>
    );
};


export default Footer;
