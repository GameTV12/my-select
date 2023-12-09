import React from 'react';
import {Box, Button, ButtonGroup, FormControl, Modal, ModalProps, Typography} from "@mui/material";
import { Cookies } from 'react-cookie'

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

const LogoutModal = ({open, onClose}: ModalProps) => {

    const handleLogout = () => {
        const rigthCookie = new Cookies();
        console.log('Logout')
        rigthCookie.set('myselect_refresh', null, { expires: new Date(new Date().getTime() - 1000), domain: 'myselect.airule.io', path: '/'})
        rigthCookie.set('myselect_access', null, { expires: new Date(new Date().getTime() - 1000), domain: 'myselect.airule.io', path: '/'})
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
                <Typography variant={"h5"} sx={{ my: 1 }} align={"center"} id="parent-modal-title">Logout</Typography>
                <Typography sx={{ textAlign: 'justify' }} variant={"body1"} id="parent-modal-description">
                    Are you sure? You will be log outed. If you want to use your account again, you must log in and write right data.
                </Typography>
                <form>
                    <FormControl fullWidth sx={{ my: 1 }}>
                        <ButtonGroup variant="contained" fullWidth>
                            {onClose && <Button color={"success"} onClick={(e) => onClose(e, "backdropClick")}>Continue</Button>}
                            <Button color={"error"} type={"submit"}>Log Out</Button>
                        </ButtonGroup>
                    </FormControl>
                </form>
            </Box>
        </Modal>
    )
}

export default LogoutModal