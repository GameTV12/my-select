import React, {useState} from 'react'
import {Box, Button, DialogProps, FormControl, FormLabel, Modal, ModalProps, TextField, Typography} from "@mui/material"
import {reportCommentRequest} from "../utils/authRequests";

type ReportCommentModalProps = {
    userId: string
    commentId: string
    linkNickname: string
}

export interface CreateReportInterface {
    text: string
    reportedUserId: string
}


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
}
const ReportCommentModal = ({open, onClose, userId, commentId, linkNickname}: DialogProps & ReportCommentModalProps) => {
    const [reportMessage, setReportMessage] = useState<string>('')

    function sendReport(e: any) {
        e.preventDefault()
        e.stopPropagation()
        console.log({ reportedUserId: userId, text: "User - " + linkNickname + "\nCommentId - " + commentId + "\nText - " + reportMessage})
        reportCommentRequest({ reportedUserId: userId, text: "User - " + linkNickname + "\nCommentId - " + commentId + "\nText - " + reportMessage})
        setReportMessage('')
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{...style, width: 400}}>
                <Typography variant={"h5"} sx={{my: 1}} align={"center"} id="parent-modal-title">Report this comment</Typography>
                <Typography sx={{textAlign: 'justify'}} variant={"body1"} id="parent-modal-description">
                    Describe a violation (spam, harassment, etc)
                </Typography>
                <form>
                    <FormControl fullWidth>
                        <TextField id={"text"}
                                   name={"text"}
                                   type={"text"}
                                   placeholder={"Enter a text"}
                                   multiline
                                   rows={6}
                                   required
                                   value={reportMessage}
                                   onChange={(e) => setReportMessage(e.target.value)}
                                   fullWidth
                                   sx={{my: 1}}
                                   inputProps={{maxLength: 200}}
                                   helperText={`${reportMessage.length}/200 symbols used`}
                        />

                    </FormControl>
                    <FormControl fullWidth sx={{my: 1}}>
                        <Button variant="contained" onClick={(e) => sendReport(e)}>Send report</Button>
                    </FormControl>
                </form>
            </Box>
        </Modal>
    );
};

export default ReportCommentModal;