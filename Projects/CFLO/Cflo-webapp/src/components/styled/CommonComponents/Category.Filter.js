import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    catCont: {
        fontSize: "16px",
        fontWeight: "400",
        padding: "3px 9px",
        cursor: "pointer",
        color: "#505050",
        borderRadius: "5px",
        marginBottom: "8px",
    },
}));

const colorArr = [
    "#FFE7E7",
    "#FFEDD8",
    "#FFEFEF",
    "#F8F6E9",
    "#F8E9E9",
    "#E9F8F0",
    "#E9F8F0"
]


function CategoryFilter(props) {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { selectedCategories, setSelectedCategories, categories } = props

    const clickCategory = (cate) => {
        let updatedArr = [...selectedCategories]
        if (selectedCategories.includes(cate)) {
            updatedArr = selectedCategories.filter((d) => d !== cate)
        } else {
            updatedArr.push(cate)
        }
        setSelectedCategories(updatedArr)
    }

    return (
        <>
            {categories && categories.map((category, i) => (
                <div
                    className={classes.catCont}
                    onClick={() => { clickCategory(category?.tagStrs) }}
                    style={selectedCategories.includes(category?.tagStrs) ? { backgroundColor: colorArr[i % 7], border: `2px solid ${theme.palette.primary.main}`, } : { backgroundColor: colorArr[i % 7] }}
                >{category?.tagStrs}</div>
            ))}
        </>
    );
}

export default CategoryFilter;
