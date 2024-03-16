import React, {useState} from 'react';
import {Box, Button, DialogProps, Modal, Paper, TextField, Typography} from "@mui/material";
import {addVariantRequest} from "../../utils/authRequest";

export type VariantMessage = {
    id: string
    text: string
}

type AddNewVariantModalProps = {
    postId: string
    addVariant: ({id, text}: VariantMessage) => void
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

const AddNewVariantModal = ({open, onClose, addVariant, postId}: DialogProps & AddNewVariantModalProps) => {
    const [variantMessage, setVariantMessage] = useState<VariantMessage>({id: '1152', text: ''})

    function sendVariantMessage(e: React.MouseEvent | React.KeyboardEvent) {
        e.preventDefault()
        console.log(variantMessage)
        addVariant(variantMessage)
        addVariantRequest(postId, {variant: variantMessage.text.trim()})
        setVariantMessage((prevState) => ({...prevState, text: ''}))
        if (onClose) onClose(e, "backdropClick")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && variantMessage.text.split(' ').join('').length > 0) {
            sendVariantMessage(e)
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{...style, width: 400}}>
                <Typography variant={"h5"} sx={{my: 1}} align={"center"} id="parent-modal-title">Add a new option</Typography>
                <Typography sx={{textAlign: 'justify'}} variant={"body1"} id="parent-modal-description">
                    Add a new option (you will vote for this option automatically)
                </Typography>
                <Paper component={"form"} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', border: 0, boxShadow: 0 }}>
                    <TextField id={"text"}
                               name={"text"}
                               type={"text"}
                               placeholder={"Enter a text"}
                               required
                               value={variantMessage.text}
                               onChange={(e) => setVariantMessage((prevState) => ({
                                   ...prevState,
                                   text: e.target.value
                               }))}
                               fullWidth
                               onKeyDown={handleKeyDown}
                               sx={{my: 1}}
                               autoFocus
                               inputProps={{maxLength: 80}}
                               helperText={`${variantMessage.text.length}/80 symbols used`}
                    />
                    <Button disabled={variantMessage.text.split(' ').join('').length == 0} fullWidth variant="contained" type={"submit"} onClick={(e) => sendVariantMessage(e)}>Send a report</Button>
                </Paper>
            </Box>
        </Modal>
    )
};

export default AddNewVariantModal;