import React from 'react';
import {Box, Button, Dialog, DialogProps, Grid, IconButton, Modal, ModalProps, Typography} from "@mui/material"
import WestIcon from '@mui/icons-material/West'
import EastIcon from '@mui/icons-material/East'

interface ImageSliderProps {
    currentImage: number
    images: string[]
    nextImage: () => void
    prevImage: () => void
}

const ImageSliderModal = ({
                              onClose,
                              open,
                              currentImage,
                              images,
                              prevImage,
                              nextImage
                          }: ModalProps & ImageSliderProps) => {
    function handleClose (e: React.MouseEvent) {
        if (onClose) {
            onClose(e, "backdropClick")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextImage()
        else if (e.key === 'ArrowLeft') prevImage()
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{maxWidth: '100vw', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onKeyDown={handleKeyDown}
        >
            <Grid container sx={{
                width: '100%',
                p: 4,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Grid item xs={1} sm={1} md={1} lg={1}
                      xl={1}><IconButton onClick={prevImage}><WestIcon/></IconButton></Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} onDoubleClick={(e) => handleClose(e)}
                      xl={10} sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100vh' }}>
                    <img
                        src={images[currentImage]}
                        srcSet={images[currentImage]}
                        alt="Error loading"
                        width={'100%'}
                    />
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1}
                      xl={1} sx={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}><IconButton onClick={nextImage}><EastIcon/></IconButton></Grid>
            </Grid>
        </Modal>
    );
};

export default ImageSliderModal;