import React, { useState } from 'react'
import { ButtonBase, Dialog, DialogContent, DialogTitle, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Link from './links.json'
import YouTube from 'react-youtube';
import YoutubeSvg from "../../Assets/youtube.svg";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '5px',
        fontSize: '20px',
        fontWeight: "550",
        [theme.breakpoints.down('xs')]: {
            padding: '2px 0rem',
            fontSize: '16px',
            fontWeight: "550",
        },
    },
    dialogStyle: {
        fontWeight: 'bold'
    },

    textStyle: {
        fontWeight: '600',
        fontSize: 12,
        [theme.breakpoints.down('xs')]: {
            display: "none"
        }
    },

    imgStyle: {
        height: '0.9rem',
        width: '1.8rem'
    },
}))

class YoutubeFrame extends React.Component {
    render() {
        const {
            videoId
        } = this.props
        const opts = {
            height: '340',
            width: '400',
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: true
            },
        };

        return <YouTube videoId={videoId} opts={opts} onReady={this._onReady} />;
    }

    _onReady(event) {
        // access to player in all event handlers via event.target
        // event.target.pauseVideo();
    }
}

export default function YoutubeTuts(props) {
    const name = props.name;
    const dialogTitle = props.dialogTitle;
    const showFull = props.showFull;
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const vidLink = Link[name]
    console.log(vidLink, ' is the link')

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <ButtonBase onClick={() => setOpen(true)}>
                <div className={classes.root} square>
                    <img
                        className={classes.imgStyle}
                        src={YoutubeSvg}
                    />
                    <Typography className={classes.textStyle}>
                        {/* {name} */}Tutorial
                    </Typography>
                </div>
            </ButtonBase>
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogContent className={classes.dialogStyle}>
                    <DialogTitle id="simple-dialog-title">{dialogTitle || `${name} Tutorial`}</DialogTitle>
                    <YoutubeFrame videoId={vidLink} opt />
                </DialogContent>

            </Dialog>
        </>

    )
}