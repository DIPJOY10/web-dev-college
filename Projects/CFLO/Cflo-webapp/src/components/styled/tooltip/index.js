import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: theme.palette.primary.main,

    },
    tooltip: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();
    return <Tooltip arrow placement="top" classes={classes} {...props} />;
}

export default BootstrapTooltip;