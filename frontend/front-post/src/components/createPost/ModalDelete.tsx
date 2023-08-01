import React from 'react';
import {Box, Button, Modal, Typography} from "@mui/material";

interface ModalDeleteI {
    show: boolean,
    showModal: (prev: boolean) => void,
    file: File,
    deleteFile: (file: File) => void,
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    maxWidth: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
};

const ModalDelete = ({show, showModal, file, deleteFile}: ModalDeleteI) => {
    return (
        <Modal
            open={show}
            onClose={showModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography align={"center"} id="modal-modal-title" variant="h6" component="h2">
                    Delete the photo?
                </Typography>
                <img src={URL.createObjectURL(file)} width={'100%'} alt={"error 404"}/>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly'
                }}>
                    <Button color={'success'} variant={'contained'} onClick={() => {deleteFile(file)
                        showModal(false)}}>Yes, delete</Button>
                    <Button color={'info'} variant={'contained'} onClick={() => showModal(false)}>No, save this</Button>
                </Box>

            </Box>
        </Modal>
    );
};

export default ModalDelete;
