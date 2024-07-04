import React, { useState, useEffect, useRef, useCallback } from "react";
import { CircularProgress, makeStyles, Paper, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { getCategoryWithCount, searchDocsByFilter } from "./api";
import LocationFilter from "../styled/CommonComponents/Location.Filter";
import { useTheme } from "@material-ui/core/styles";
import { useDebounce } from "react-use";
import moment from 'moment';
import { countriesStateMap } from "../styled/countryState";
import ReactHtmlParser from "react-html-parser";
import LaunchIcon from '@material-ui/icons/Launch';
import CategoryFilter from "../styled/CommonComponents/Category.Filter";


const useStyles = makeStyles((theme) => ({
    mainCont: {
        width: "100%",
        height: `calc(100vh - ${theme.appbar.height})`,
        display: "flex",
        justifyContent: "space-between",
        padding: "5px"
    },
    feedCont: {
        width: "45%",
        height: "100%",
        padding: "0px 15px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
            display: "none"
        },
        scrollbarWidth: "none",
    },
    leftSideCont: {
        width: "23%",
        height: "100%",
        backgroundColor: "white",
        border: "1.5px solid rgba(0, 0, 0, 0.12)",
    },
    catCont: {
        fontSize: "16px",
        fontWeight: "500",
        padding: "5px 10px",
        cursor: "pointer"
    },
    titleSty: {
        fontSize: "20px",
        margin: "15px 10px",
    },
    categoryCont: {
        height: "38%",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
            display: "none"
        },
        scrollbarWidth: "none",
    },
    rightSideCont: {
        width: "23%",
        height: "100%",
    },
    locationCont: {
        height: "42%",
        width: "100%",
        padding: "0px 10px"
    },
    userCont: {
        display: "flex",
        alignItems: "center",
        "& img": {
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            marginRight: "15px"
        }
    },
    tagCont: {
        display: "flex",
        flexWrap: "wrap",
        marginTop: "7px",
        paddingLeft: "10px",
        "& div": {
            marginRight: "10px",
            fontSize: "16px",
            fontWeight: "500"
        }
    },
    linkCont: {
        marginTop: "5px",
        paddingLeft: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        "& a": {
            fontSize: "18px",
            textDecoration: "none",
            marginTop: "7px"
        }
    },
    bodyCont: {
        "& ul": {
            marginLeft: "45px"
        }
    },
}));

function DocResources() {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme()
    const { } = useSelector((state) => state);

    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [locationTags, setLocationTags] = useState([])
    const [docPosts, setDocPosts] = useState([])
    const [changeBool, setChangeBool] = useState(false)
    const [loadingBool, setLoadingBool] = useState(false)

    useEffect(() => {
        getAllCategoryWithCount()
    }, [])

    const getAllCategoryWithCount = async () => {
        await getCategoryWithCount({})
            .then((data) => {
                let arr = data[0]?.category_details
                arr.sort((a, b) => {
                    return b.count - a.count;
                })
                setCategories(arr)
            })
            .catch((err) => {
                console.log(err);
            })
    }



    useEffect(() => {
        findDocs()
    }, [])

    const findDocs = async () => {
        setLoadingBool(true)
        let countryTag = []
        let nationwide = []
        let stateTags = []

        locationTags.map((loc) => {
            let locationArr = loc?.arr;
            countryTag.push(locationArr[0]?.name)
            if (locationArr[0]?.selected) {
                nationwide.push(locationArr[0]?.name)
            }
            locationArr.map((state, i) => {
                if (i !== 0 && state?.selected) {
                    let str = `${state?.name}_${locationArr[0]?.name}`
                    stateTags.push(str)
                }
            })
        })

        nationwide.map((nation) => {
            let nStates = countriesStateMap?.[nation]
            nStates.map((state) => {
                let str = `${state}_${nation}`
                stateTags.push(str)
            })
        })

        let stateSet = new Set([]);
        stateTags.map((state) => {
            stateSet.add(state)
        })

        stateTags = [...stateSet]

        await searchDocsByFilter({
            nationwide,
            stateTags,
            selectedCategories
        })
            .then((data) => {
                console.log(data)
                setDocPosts(data)
                setLoadingBool(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }


    useDebounce(
        () => {
            findDocs();
        },
        500,
        [selectedCategories, locationTags, changeBool]
    )


    return (
        <div className={classes.mainCont} >
            <div className={classes.leftSideCont} >
                <h3 className={classes.titleSty} >Category</h3>
                <div className={classes.categoryCont} >
                    <CategoryFilter
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        categories={categories}
                    />
                </div>
                <h3 className={classes.titleSty} >Location</h3>
                <div className={classes.locationCont} >
                    <LocationFilter
                        locationTags={locationTags}
                        setLocationTags={setLocationTags}
                        setChangeBool={setChangeBool}
                        changeBool={changeBool}
                    />
                </div>
            </div>



            <div className={classes.feedCont} >
                <FormControl size="small" style={{ width: "100%", borderRadius: "10px" }} variant="outlined">
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                        labelWidth={0}
                        placeholder={"Search by title"}
                    />
                </FormControl>

                {docPosts.length > 0 && docPosts.map((doc) => (
                    <Paper
                        elevation={1}
                        style={{ margin: "15px 0px", padding: "10px" }}
                        onClick={() => { history.push(`/doc/view/${doc?._id}`) }}
                    >

                        <div className={classes.userCont} >
                            <img src={doc?.profile?.parent?.displayPicture?.url || doc?.profile?.parent?.displayPicture?.thumbUrl} />
                            <div>
                                <h3>{doc?.profile?.parent?.displayName}</h3>
                                <p>{moment(doc?.createdAt).format('DD MMM YYYY')}</p>
                            </div>
                        </div>


                        <h3>{doc?.title}</h3>
                        <div className={classes.bodyCont} >
                            {doc?.description && (
                                <>
                                    {ReactHtmlParser(
                                        doc?.description?.length > 0 ? doc?.description : ''
                                    )}
                                </>
                            )}
                        </div>

                        <div className={classes.linkCont} >
                            {doc?.links && doc?.links.map((link) => (
                                <a target="_blank" href={link?.link} >{link?.title} <LaunchIcon style={{ fontSize: "18px", marginBottom: "-3px" }} /> </a>
                            ))}
                        </div>

                        <div className={classes.tagCont} >
                            {doc?.tagStrs && doc.tagStrs.map((tag) => (<div>#{tag}</div>))}
                        </div>

                        <h3 className={classes.sectionTitle} >🌏</h3>
                        <div className={classes.tagCont} >
                            {doc?.nationwide && doc.nationwide.map((tag) => (<div style={{ fontWeight: "510" }} >#{tag}</div>))}
                            {doc?.stateTags && doc.stateTags.map((tag) => (<div>#{tag.split("_")[0]}</div>))}
                        </div>

                        <h3>Number of File(s)</h3>
                        <div>
                            {doc?.files ? doc?.files.length : 0}
                        </div>

                    </Paper>
                ))}
            </div>
            <div className={classes.rightSideCont} ></div>
        </div>
    );

}
export default DocResources;