import React, {FC} from 'react';
import {
    Box,
    Button, ButtonGroup,
    Checkbox,
    Container, FormControl,
    FormControlLabel,
    FormGroup,
    Grid, InputLabel,
    TextField,
    Typography
} from "@mui/material";

export const CreatePost: FC = () => {
    return (
        <Container sx={{ mt: 2 }}>
            <Typography align={"center"} variant={"h4"}>
                Write post
            </Typography>
            <Grid sx={{
                '& .MuiTextField-root': { my: 1},
                '& .MuiButton-root': { my: 1},
            }}>
                <FormGroup>
                    <FormGroup>
                        <InputLabel htmlFor={"form__title"}>
                            Title
                        </InputLabel>
                        <TextField
                            id={"form__title"}
                            fullWidth
                            placeholder={"Enter a title"}
                        />
                    </FormGroup>
                    <FormGroup>
                        <InputLabel htmlFor={"form__text"}>
                            Text
                        </InputLabel>
                        <TextField
                            id={"form__text"}
                            fullWidth
                            multiline
                            placeholder={"Enter a text"}
                            rows={4}
                        />
                    </FormGroup>


                    <FormControlLabel control={<Checkbox defaultChecked />} label="People can add variants" />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="People can comment the post" />
                    <Button fullWidth size="large" variant="contained" color="primary">
                        Clear data
                    </Button>
                    <Button fullWidth size="large" variant="contained" color="success">
                        Create post
                    </Button>

                    <ButtonGroup fullWidth>
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                        >
                            Updates
                        </Button>
                        <Button
                            size="large"
                            variant="contained"
                            color="error"
                        >
                            Discard
                        </Button>
                    </ButtonGroup>
                </FormGroup>
            </Grid>

        </Container>
    );
};
