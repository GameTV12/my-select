import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle} from "@mui/material";
import comment from "./Comment";
import {deleteCommentRequest} from "../utils/authRequests";

type DeleteCommentModalProps = {
    deleteComment: (commentId: string) => void
    commentId: string
}


const DeleteCommentModal = ({onClose, open, deleteComment, commentId}: DialogProps & DeleteCommentModalProps) => {
    const handleDelete = (e: any) => {
        deleteComment(commentId)
        deleteCommentRequest(commentId)
        if (onClose) {
            onClose(e, "backdropClick")
        }
    }

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle sx={{ textAlign: "center" }}>{"Delete this comment?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                   Do you really want to delete this comment?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {onClose && <Button onClick={(e) => onClose(e, "backdropClick")}>No</Button>}
                {onClose && <Button onClick={(e) => handleDelete(e)}>Yes</Button>}
            </DialogActions>
        </Dialog>
    );
};

export default DeleteCommentModal;