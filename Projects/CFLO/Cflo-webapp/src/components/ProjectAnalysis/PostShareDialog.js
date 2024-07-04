import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import React from 'react'
import SocialShareBtn from '../styled/CommonComponents/Social.Share.Btn'

const PostShareDialog = ({ isOpen, shareLink, handleClose }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="share-post"
        >
            <DialogTitle id="share-post-title">
                Share post on Social
            </DialogTitle>
            <DialogContent>
                <SocialShareBtn shareLink={shareLink} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cencel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PostShareDialog