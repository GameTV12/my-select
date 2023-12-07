import React, {useState} from 'react'
import {Box, Button, DialogProps, Modal, Paper, TextField, Typography} from "@mui/material"
import {reportPostRequest} from "../../utils/authRequest";



export type ReportMessage = {
    user: string
    text: string
}

type ReportPostModalProps = {
    userId: string
    postId: string
    linkNickname: string
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
const ReportPostModal = ({open, onClose, userId, postId, linkNickname}: DialogProps & ReportPostModalProps) => {
    const [reportMessage, setReportMessage] = useState<string>('')

    function sendReport(e: any) {
        e.preventDefault()
        e.stopPropagation()
        reportPostRequest({ reportedUserId: userId, text: "User - " + linkNickname + "\nPostId - " + postId + "\nText - " + reportMessage})
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
                <Typography variant={"h5"} sx={{my: 1}} align={"center"} id="parent-modal-title">Report this
                    post</Typography>
                <Typography sx={{textAlign: 'justify'}} variant={"body1"} id="parent-modal-description">
                    Describe a violation (spam, harassment, etc)
                </Typography>
                <Paper component={"form"} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', border: 0, boxShadow: 0 }}>
                    <TextField id={"text"}
                               name={"text"}
                               type={"text"}
                               placeholder={"Enter a text"}
                               multiline
                               rows={6}
                               required
                               value={reportMessage}
                               onChange={(e) => setReportMessage((prevState) => (e.target.value))}
                               fullWidth
                               sx={{my: 1}}
                               autoFocus
                               inputProps={{maxLength: 300}}
                               helperText={`${reportMessage.length}/300 symbols used`}
                    />
                    <Button disabled={reportMessage.split(' ').join('').length == 0} fullWidth variant="contained" type={"submit"} onClick={(e) => sendReport(e)}>Send a report</Button>
                </Paper>
            </Box>
        </Modal>
    );
};

export default ReportPostModal;