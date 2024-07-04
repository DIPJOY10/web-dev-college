import { Typography } from '@material-ui/core';
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        padding: '.5vh 1vw',
        backgroundColor: "#edebeb",
        borderRadius: "2vw",
        marginRight: '1vw',
        [theme.breakpoints.down('xs')]: {
            // padding:''
            margin: '.5vh 0',
        },
    },
}))
export default function SkillsList(props) {
    const classes = useStyles();
    const { skill } = props;
    return (
        <div className={classes.root}>
            <Typography variant="subtitle">{skill}</Typography>
        </div>
    )
}
