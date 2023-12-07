import React, {useState} from 'react'
import {Box, Button, FormControl, Modal, ModalProps, TextField, Typography} from "@mui/material";
import {banUserRequest, createModeratorRequest} from "../utils/authRequests";

interface deleteModalI {
    userId: string
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
const DeleteModal = ({open, onClose, userId}: ModalProps & deleteModalI) => {
    const [confirmation, setConfirmation] = useState<string>("")

    function handleSubmit(e: React.MouseEvent) {
        console.log('UserId - ' + userId)
        banUserRequest(userId).then(() => {
            setConfirmation('')
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
                <Typography variant={"h5"} sx={{ my: 1 }} align={"center"} id="parent-modal-title">Delete the account</Typography>
                <Typography sx={{ textAlign: 'justify' }} variant={"body1"} id="parent-modal-description">
                    Are you sure? You cannot recover the account after deleting.
                </Typography>
                <form>
                    <FormControl fullWidth>
                        <TextField id={"text"}
                                   name={"text"}
                                   type={"text"}
                                   placeholder={"Enter a word \"Delete\""}
                                   required
                                   value={confirmation}
                                   onChange={(e) => setConfirmation((e.target.value))}
                                   fullWidth
                                   sx={{ my: 1 }}
                                   inputProps={{ maxLength: 30 }}
                                   helperText={`Write a word \"Delete\"`}
                        />

                    </FormControl>
                    <FormControl fullWidth sx={{ my: 1 }}>
                        <Button variant="contained" onClick={handleSubmit} disabled={confirmation != 'Delete'}>Delete</Button>
                    </FormControl>
                </form>
            </Box>
        </Modal>
    );
};

export default DeleteModal;