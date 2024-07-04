import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import ReactHtmlParser from "react-html-parser";
import CircularProgress from '@material-ui/core/CircularProgress';
import { getBlog } from './api.call';
import moment from 'moment';
import NavbarLayout from '../layout/NavbarLayout';

const useStyles = makeStyles((theme) => ({
    mainComponentCont: {
        width: "100%",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "#f6f4f4",
        padding: "20px 200px",
        [theme.breakpoints.down("md")]: {
            padding: "0px 150px",
        },
        [theme.breakpoints.down("sm")]: {
            padding: "0px 50px",
        },
        [theme.breakpoints.down("xs")]: {
            padding: "0px 5px",
        },
    },
    blogCont: {
        width: "100%",
        backgroundColor: "white",
        padding: "50px 150px",
        [theme.breakpoints.down("md")]: {
            padding: "50px 100px",
        },
        [theme.breakpoints.down("sm")]: {
            padding: "25px 50px",
        },
        [theme.breakpoints.down("xs")]: {
            padding: "0px 10px",
        },
    },
    titleText: {
        fontWeight: '400',
        fontSize: '38px',
        [theme.breakpoints.down("xs")]: {
            fontSize: '25px',
        }
    },
    editorStyle: {
        display: "flex",
        alignItems: "center",
        margin: "20px 0px",
        "& img": {
            width: "40px",
            height: "40px",
            borderRadius: "50%"
        },
        "& h3": {
            fontSize: "14px",
            color: "#8f919d",
            fontWeight: "400"
        },
        "& p": {
            fontSize: "14px",
            color: "#8f919d",
            fontWeight: "400"
        }
    },
    imgCont: {
        display: "flex",
        flexDirection: "column",
        "& img": {
            width: "100%",
            border: "1px solid #d8d8d8",
            height: "auto",
            marginBottom: "15px"
        }
    },
    bodyCont: {
        "& ul": {
            marginLeft: "45px"
        }
    },
    progressCont: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
}));

export default function BlogView(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { blogId } = useParams();

    const [blog, setBlog] = useState(null);

    useEffect(() => {
        getBlog({ blogId: blogId })
            .then((data) => {
                console.log(data);
                setBlog(data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [blogId])

    return (
        <NavbarLayout
            navHeight={"60px"}
            bodyComponent={<>
                {blog ? (<>
                    <div className={classes.mainComponentCont} >
                        <div className={classes.blogCont} >
                            <Typography className={classes.titleText}>
                                {blog?.title?.length > 0 ? blog?.title : 'Untitled'}
                            </Typography>
                            <div className={classes.editorStyle} >
                                <img src={blog?.profile?.parent?.displayPicture?.url} />
                                <div style={{ marginLeft: "15px" }} >
                                    <h3>Written by <span style={{ fontWeight: "500" }} >{blog?.profile?.parent?.displayName}</span></h3>
                                    <p>Last Updated at {moment(blog?.updatedAt).format('DD MMM YYYY')}</p>
                                </div>
                            </div>
                            <div className={classes.bodyCont} >
                                {blog?.paras?.length && blog.paras.map(doc => {
                                    const files = doc?.files
                                    return (
                                        <>
                                            {ReactHtmlParser(
                                                doc?.description?.length > 0 ? doc?.description : ''
                                            )}
                                            <div className={classes.imgCont} >
                                                {files && files.map((file) => (
                                                    <img src={file.url} />
                                                ))}
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>) : (<div className={classes.progressCont} >
                    <CircularProgress />
                </div>)}
            </>}
        />
    );
}