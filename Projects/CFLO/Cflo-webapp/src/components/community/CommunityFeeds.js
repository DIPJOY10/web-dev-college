import React, { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { getCommunityPostWithFilter } from "./api.call";
import { useSelector, useDispatch } from "react-redux";
import PostFile from "../post/PostFile";
import arrayToReducer from "../../helpers/arrayToReducer";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    feedBodyXCont: {
        width: "100%",
        overflow: "auto",
    },
    progressBox: {
        width: "100%",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
}));

export default function CommunityFeeds(props) {
    const classes = useStyles();
    const postFromBackend = 10
    const { user } = useSelector((state) => state.auth);

    const { locationTags = [], filterSelectedCategories = [], searchTitle = "", communityId } = props;

    const [joinedCommunitiesPostsIds, setjoinedCommunitiesPostsIds] = useState([]);
    const [joinedCommunitiesPostsDict, setjoinedCommunitiesPostsDict] = useState([]);
    const [hasMoreItems, sethasMoreItems] = useState(true);
    const [currPage, setCurrPage] = useState(0)
    const [changePageState, setChangePageState] = useState(false)
    const [postsC, setPostsC] = useState([])
    const [loading, setLoading] = useState(true)
    const observer = useRef();

    const findPostsForScroll = async () => {
        setLoading(true)

        console.log("get api call")

        let stateTags = new Set([]);
        let categoryTags = new Set([]);

        locationTags.map((loc) => {
            stateTags.add(loc);
        })
        filterSelectedCategories.map((cat) => {
            categoryTags.add(cat);
        })
        let statesArr = [...stateTags]
        let categoryTagsArr = [...categoryTags]

        console.log("currPage ", currPage)

        await getCommunityPostWithFilter({
            searchTitle,
            stateTags: statesArr,
            selectedCategories: categoryTagsArr,
            communityId: communityId,
            userProfile: user?.profile,
            limit: postFromBackend,
            page: currPage,
        })
            .then((data) => {
                console.log(data)

                if (currPage === 0) {
                    setPostsC(data)
                } else {
                    setPostsC((prev) => [...prev, ...data])
                }

                if (data.length < postFromBackend) {
                    sethasMoreItems(false);
                } else {
                    sethasMoreItems(true);
                }

                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const lastElementRef = useCallback(
        (node) => {
            console.log("scroll listener")
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreItems) {
                    setCurrPage((prev) => {
                        return prev + 1;
                    });
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMoreItems]
    );

    useEffect(() => {
        if (currPage === 0) {
            setChangePageState(!changePageState)
        } else {
            setCurrPage(0);
        }
    }, [locationTags, filterSelectedCategories])


    useEffect(() => {
        findPostsForScroll()
    }, [currPage, changePageState]);


    useEffect(() => {
        const { idArr, newDict } = arrayToReducer(
            postsC || []
        );
        setjoinedCommunitiesPostsIds(idArr);
        setjoinedCommunitiesPostsDict(newDict);
    }, [postsC])


    return (
        <div className={classes.feedBodyXCont} >
            {joinedCommunitiesPostsIds && joinedCommunitiesPostsIds.length > 0 && (
                joinedCommunitiesPostsIds.map((el, idx) => {
                    let lastItem = joinedCommunitiesPostsIds.length - 1;

                    return joinedCommunitiesPostsDict[el] ? (
                        idx === lastItem ? (
                            <div ref={lastElementRef} >
                                <PostFile
                                    commentLimit={5}
                                    key={joinedCommunitiesPostsDict[el]._id}
                                    post={joinedCommunitiesPostsDict[el]}
                                    sentProfile={user?.profile}
                                    addLink={false}
                                />
                            </div>
                        ) : (
                            <div>
                                <PostFile
                                    commentLimit={5}
                                    key={joinedCommunitiesPostsDict[el]._id}
                                    post={joinedCommunitiesPostsDict[el]}
                                    sentProfile={user?.profile}
                                    addLink={false}
                                />
                            </div>
                        )
                    ) : (
                        <></>
                    );
                })
            )}
            {hasMoreItems && (
                <div className={classes.progressBox}>
                    {loading && (
                        <CircularProgress />
                    )}
                </div>
            )}
        </div>
    );
};


