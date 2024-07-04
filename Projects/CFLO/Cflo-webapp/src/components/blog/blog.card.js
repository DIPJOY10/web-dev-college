import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import moment from 'moment';
import LessText from '../styled/CommonComponents/LessText';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: "center",
        marginBottom: "40px",
        cursor: "pointer",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        }
    },
    blogdpStyle: {
        width: "230px",
        height: "185px",
        backgroundImage: (props) => (`url(${props.img})`),
        backgroundPosition: "center",
        backgroundSize: "cover",
        objectFit: "cover",
        backgroundRepeat: "no-repeat",
        marginRight: "40px",
        [theme.breakpoints.down("xs")]: {
            marginRight: "0px",
            marginBottom: "15px"
        }
    },
    blogDetails: {
        width: "500px",
        "& h4": {
            fontSize: "14px",
            marginBottom: "2px",
            fontWeight: "510",
            textTransform: "uppercase",
            color: "rgba(28, 28, 28, 0.5)"
        },
        "& h3": {
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "5px"
        },
        "& h5": {
            fontSize: "14px",
            color: "rgba(28, 28, 28, 0.5)",
            marginBottom: "10px",
            fontWeight: "450"
        },
        "& p": {
            fontSize: "13px"
        },
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            "& h4": {
                fontSize: "12px",
            },
            "& h3": {
                fontSize: "16px",
            },
            "& h5": {
                fontSize: "10px",
            },
            "& p": {
                fontSize: "11px"
            },
        }
    }
}));

export default function BlogCard({ img, blog, isAdmin }) {
    const classes = useStyles({ img: img });
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <div onClick={() => {
            if (isAdmin) {
                var path = '/blog/edit/' + blog?._id
                history.push(path)
            } else {
                var path = '/blog/public/' + blog?._id
                history.push(path)
            }
        }} className={classes.root}>
            <div className={classes.blogdpStyle} ></div>
            <div className={classes.blogDetails} >
                <h4>{blog?.categories && blog?.categories.length > 0 && blog?.categories[0]?.name}</h4>
                <h3>{blog?.title}</h3>
                <h5>{blog?.profile?.parent?.displayName} <FiberManualRecordIcon style={{ fontSize: "8px" }} /> Last Updated at {moment(blog?.updatedAt).format('DD MMM YYYY')}</h5>
                <p>
                    <LessText
                        limit={350}
                        string={blog?.desc}
                    />
                </p>
            </div>
        </div>
    );
}
