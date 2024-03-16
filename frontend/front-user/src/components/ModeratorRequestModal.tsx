import React, {useState} from 'react'
import {Box, Button, FormControl, FormLabel, Modal, ModalProps, TextField, Typography} from "@mui/material"
import {createModeratorRequest} from "../utils/authRequests";

export type ModeratorRequest = {
    user: string
    text: string
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
const ModeratorRequestModal = ({open, onClose}: ModalProps) => {
    const userID = '2113-7810-IDSL-1238'
    const [moderatorRequest, setModeratorRequest] = useState<ModeratorRequest>({user: userID, text: ''})

    function handleSubmit(e: React.MouseEvent) {
        console.log(moderatorRequest)
        createModeratorRequest({ text: moderatorRequest.text }).then(() => {
            setModeratorRequest((prevState) => ({...prevState, text: ''}))
            if (onClose) {
                onClose(e, "backdropClick")
            }
        })
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
                <Typography variant={"h5"} sx={{ my: 1 }} align={"center"} id="parent-modal-title">Send a moderator request</Typography>
                <Typography sx={{ textAlign: 'justify' }} variant={"body1"} id="parent-modal-description">
                    Describe a reason of why you want to become a moderator
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
                               value={moderatorRequest.text}
                               onChange={(e) => setModeratorRequest((prevState) => ({...prevState, text: e.target.value}))}
                               fullWidth
                               sx={{ my: 1 }}
                               inputProps={{ maxLength: 300 }}
                               helperText={`${moderatorRequest.text.length}/300 symbols used`}
                        />

                    </FormControl>
                    <FormControl fullWidth sx={{ my: 1 }}>
                        <Button variant="contained" onClick={(e) => handleSubmit(e)}>Send a request</Button>
                    </FormControl>
                </form>
            </Box>
        </Modal>
    );
};

export default ModeratorRequestModal;