import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import BlogCard from './blog.card';
import defaultBlogDP from "../../Assets/defaultBlogDP.jpg"
import LogoPrimary from "../../Assets/LogoPrimary.svg"
import { createNewBlog, getAllAdminBlog } from './api.call';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
    },
    imgStyle: {
        width: "40px",
        height: "auto",
        cursor: "pointer",
    },
    navbar: {
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px",
        padding: "0px 5px",
    },
    loaderCont: {
        position: 'fixed',
        top: "0px",
        right: "0px",
        width: "100vw",
        height: "100vh",
        zIndex: "1000",
        paddingLeft: "0px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    logoCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleStyle: {
        color: theme.palette.primary.main,
        fontSize: "20px",
        fontWeight: "510",
    },
    mainComponentCont: {
        width: "100%",
        height: "calc(100vh - 60px)",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "#F5F7FA",
        padding: "40px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    }
}));

export default function BlogsAdmin(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { auth } = useSelector((state) => state);
    const profile = auth?.user?.profile
    const userId = auth?.user?._id

    const [blogs, setBlogs] = useState([]);
    const [loadingBool, setLoadingBool] = useState(false);

    useEffect(() => {
        if (!profile || !userId) {
            history.push("/")
        }
    }, [profile])

    const create = async () => {
        setLoadingBool(true)
        await createNewBlog({ profile })
            .then((data) => {
                setBlogs([...blogs, data])
            })
            .catch((err) => {
                console.log(err)
            })
        setLoadingBool(false)
    }

    useEffect(() => {
        setLoadingBool(true)
        getAllAdminBlog({ profile })
            .then((data) => {
                let blogArr = []
                data.map((d) => {
                    if (d?.DPBlog?.url) {
                        blogArr.push(d)
                    } else {
                        const updateObj = {
                            ...d,
                            DPBlog: {
                                url: defaultBlogDP
                            }
                        }
                        blogArr.push(updateObj)
                    }
                })
                setBlogs(blogArr)
            })
            .catch((err) => {
                console.log(err);
            })
        setLoadingBool(false)
    }, [])

    console.log(blogs)


    return (
        <div className={classes.root}>
            <div className={classes.navbar} >
                <div className={classes.logoCont} >
                    <img
                        className={classes.imgStyle}
                        src={LogoPrimary}
                        onClick={() => { history.push("/") }}
                    />
                    <p className={classes.titleStyle} >ContractFlo</p>
                </div>
                <div className={classes.logoCont} >
                    <Button
                        onClick={() => {
                            create()
                        }}
                        style={{ marginRight: "10px" }}
                    >
                        Create
                    </Button>
                </div>
            </div>
            <div className={classes.mainComponentCont} >
                <div className={classes.col}>
                    {blogs?.length > 0 ? blogs.map(blog => {
                        return <BlogCard
                            blog={blog}
                            isAdmin={true}
                            img={blog?.DPBlog?.url}
                        />
                    }) : null}
                </div>
            </div>
            {loadingBool &&
                <div className={classes.loaderCont} >
                    <CircularProgress
                        size={60}
                        thickness={3}
                        style={{ color: 'rgb(92, 144, 242)' }}
                    />
                </div>
            }
        </div>
    );
}
