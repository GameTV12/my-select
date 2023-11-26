import React, {useState} from 'react';
import {
    Box, Button,
    FormControl, Modal, ModalProps, TextField,
    Typography
} from "@mui/material";

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

interface LoginCard {
    email: string
    password: string
}

const LoginModal = ({open, onClose}: ModalProps) => {
    const [data, setData] = useState<LoginCard>({
        email: '',
        password: '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault()
        console.log(data)
    }



    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
                <Typography variant={"h5"} sx={{ my: 1 }} align={"center"} id="parent-modal-title">Login</Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth>
                        <TextField
                            id={"email"}
                            name={"email"}
                            placeholder={"Enter a email"}
                            required
                            value={data.email}
                            onChange={(e) => setData((prevState) => ({...prevState, email: e.target.value }))}
                            fullWidth
                            inputProps={{ maxLength: 80 }}
                            sx={{ mb: 1 }}
                        />

                        <TextField
                            id={"password"}
                            name={"password"}
                            placeholder={"Enter a password"}
                            required
                            type={"password"}
                            value={data.password}
                            onChange={(e) => setData((prevState) => ({...prevState, password: e.target.value }))}
                            fullWidth
                            inputProps={{ maxLength: 200 }}
                            sx={{ mb: 1 }}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ my: 1 }}>
                        <Button variant="contained" type={"submit"}>Login</Button>
                    </FormControl>
                </form>
            </Box>
        </Modal>
    )
};

export default LoginModal;