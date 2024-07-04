import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import BlogCard from './blog.card';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavbarLayout from '../layout/NavbarLayout';
import defaultBlogDP from "../../Assets/defaultBlogDP.jpg"
import { getAllPublishedBlogs } from './api.call';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import moment from 'moment';
import LessText from "../styled/CommonComponents/LessText"


const useStyles = makeStyles((theme) => ({
    headerText: {
        fontSize: '1.6rem',
        fontWeight: '800',
        margin: '1.5rem'
    },
    pinupBlog: {
        width: "100%",
        height: "60%",
        backgroundImage: (props) => (`url(${props.img})`),
        backgroundPosition: "center",
        backgroundSize: "cover",
        objectFit: "cover",
        backgroundRepeat: "no-repeat"
    },
    pinBlog: {
        width: "400px",
        height: "90%",
        cursor: "pointer",
        backgroundColor: "white",
        marginLeft: "70px",
        padding: "30px",
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
            fontSize: "14px"
        },
        [theme.breakpoints.down("xs")]: {
            width: "250px",
            marginLeft: "5px",
            padding: "10px",
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
    },
    titleCont: {
        display: "flex",
        alignItems: "center",
        marginTop: "10px",
        flexDirection: "column",
        "& h3": {
            fontSize: "35px"
        },
        "& div": {
            backgroundColor: "black",
            height: "3px",
            width: "80px"
        }
    },
    allBlogsCont: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "50px 0px",
        [theme.breakpoints.down("xs")]: {
            padding: "50px 20px",
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

export default function BlogsView(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { auth } = useSelector((state) => state);
    const [blogPinup, setBlogPinup] = useState(null);
    const [blogs, setBlogs] = useState([]);

    const classes = useStyles({ img: blogPinup?.DPBlog?.url });

    useEffect(() => {
        getAllPublishedBlogs()
            .then((data) => {
                let pinupB = null
                let unpinB = []
                data.map((d) => {
                    if (d?.isPinUp) {
                        if (d?.DPBlog?.url) {
                            pinupB = d
                        } else {
                            const updateObj = {
                                ...d,
                                DPBlog: {
                                    url: defaultBlogDP
                                }
                            }
                            pinupB = updateObj;
                        }
                    } else {
                        if (d?.DPBlog?.url) {
                            unpinB.push(d)
                        } else {
                            const updateObj = {
                                ...d,
                                DPBlog: {
                                    url: defaultBlogDP
                                }
                            }
                            unpinB.push(updateObj)
                        }
                    }
                })
                setBlogPinup(pinupB)
                setBlogs(unpinB)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <NavbarLayout
            navHeight={"60px"}
            currentSection={"blogs"}
            bodyComponent={<>
                {blogPinup || blogs.length > 0 ? (<>
                    {blogPinup && (
                        <div className={classes.pinupBlog} >
                            <div
                                className={classes.pinBlog}
                                onClick={() => {
                                    var path = '/blog/public/' + blogPinup?._id
                                    history.push(path)
                                }}
                            >
                                <h4>{blogPinup?.categories && blogPinup?.categories.length > 0 && blogPinup?.categories[0]?.name}</h4>
                                <h3>{blogPinup?.title}</h3>
                                <h5>{blogPinup?.profile?.parent?.displayName} <FiberManualRecordIcon style={{ fontSize: "8px" }} /> Last Updated at {moment(blogPinup?.updatedAt).format('DD MMM YYYY')}</h5>
                                <p>
                                    <LessText
                                        limit={360}
                                        string={blogPinup?.desc}
                                    />
                                </p>
                            </div>
                        </div>
                    )}
                    <div className={classes.titleCont} >
                        <h3>Blogs</h3>
                        <div></div>
                    </div>
                    <div className={classes.allBlogsCont}>
                        {blogs?.length > 0 ? blogs.map(blog => {
                            return <BlogCard
                                blog={blog}
                                img={blog?.DPBlog?.url}
                            />
                        }) : null}
                    </div>
                </>) : (<div className={classes.progressCont} >
                    <CircularProgress />
                </div>)}
            </>}
        />
    );
}