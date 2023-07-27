import React, {useState} from 'react'
import {Box, Button, DialogProps, FormControl, FormLabel, Modal, ModalProps, TextField, Typography} from "@mui/material"

export type ReportMessage = {
    user: string
    text: string
}

type ReportCommentModalProps = {
    user: string
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
const ReportCommentModal = ({open, onClose, user}: DialogProps & ReportCommentModalProps) => {
    const [reportMessage, setReportMessage] = useState<ReportMessage>({user: user, text: ''})

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault()
        e.stopPropagation()
        console.log(reportMessage)
        setReportMessage((prevState) => ({ user: '', text: ''}))
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
                <form onSubmit={() => handleSubmit}>
                    <FormControl fullWidth>
                        <TextField id={"text"}
                                   name={"text"}
                                   type={"text"}
                                   placeholder={"Enter a text"}
                                   multiline
                                   rows={6}
                                   required
                                   value={reportMessage.text}
                                   onChange={(e) => setReportMessage((prevState) => ({
                                       ...prevState,
                                       text: e.target.value
                                   }))}
                                   fullWidth
                                   sx={{my: 1}}
                                   inputProps={{maxLength: 200}}
                                   helperText={`${reportMessage.text.length}/200 symbols used`}
                        />

                    </FormControl>
                    <FormControl fullWidth sx={{my: 1}}>
                        <Button variant="contained" type={"submit"}>Send a report</Button>
                    </FormControl>
                </form>
            </Box>
        </Modal>
    );
};

export default ReportCommentModal;