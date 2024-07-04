import { Box, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { ReactComponent as ForumIcon } from "../../Assets/forum_icon.svg";

const useStyles = makeStyles((theme) => ({
    menuIcon: {
        height: "24px",
        width: "24px",
        "& path": {
            fill: "rgba(0, 0, 0, 0.26)",
        },
    },
    text: {
        color: "rgba(0, 0, 0, 0.26)",
        marginTop: "-10%"
    },
    center: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer"
    }
}));

const IconWithText = ({ icon, text }) => {
    const classes = useStyles();
    return (
        <Box className={classes.center}>
            {icon}
            <Typography className={classes.text} variant="caption" display="block">{text}</Typography>
        </Box>
    )
}

export default IconWithText