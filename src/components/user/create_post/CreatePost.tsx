import React, {FC, SyntheticEvent, useEffect, useState} from 'react';
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

interface NewPost {
    title: string,
    text: string,
    allowedVariants: boolean,
    allowedComments: boolean
}

export const CreatePost: FC = () => {
    const postTemplate: NewPost = {
        title: "",
        text: "",
        allowedVariants: true,
        allowedComments: true
    }



    // @ts-ignore
    const [data, setData] = useState<NewPost>(localStorage.getItem('postData')==null ? postTemplate : JSON.parse(localStorage.getItem('postData')));

    useEffect(()=> {
        localStorage.setItem('postData', JSON.stringify(data));
    }, [data])

    function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const newdata: any = { ...data };
        newdata[e.target.id] = e.target.value;
        setData(newdata);
    }

    function handleCheck(e: any): void{
        const newdata: any = { ...data };
        newdata[e.target.id] = e.target.checked;
        setData(newdata);
        console.log(e.target.checked);
    }

    function submit(e: any): void {
        e.preventDefault();
        console.log(data);
        setData(postTemplate);
    }

    function clearData(e: any): void {
        e.preventDefault();
        setData(postTemplate);
    }

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
                    <form onSubmit={(e) => submit(e)}>
                    <FormGroup>
                        <InputLabel htmlFor={"form__title"}>
                            Title
                        </InputLabel>
                        <TextField
                            id={"title"}
                            fullWidth
                            placeholder={"Enter a title"}
                            value={data.title}
                            onChange={(e) => handle(e)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <InputLabel htmlFor={"form__text"}>
                            Text
                        </InputLabel>
                        <TextField
                            id={"text"}
                            fullWidth
                            multiline
                            placeholder={"Enter a text"}
                            rows={4}
                            maxRows={Infinity}
                            value={data.text}
                            onChange={(e) => handle(e)}
                        />
                    </FormGroup>


                    <FormControlLabel control={<Checkbox id={"allowedVariants"} checked={data.allowedVariants} onChange={(e) => handleCheck(e)} defaultChecked />} label="People can add variants" />
                    <FormControlLabel control={<Checkbox id={"allowedComments"} checked={data.allowedComments} onChange={(e) => handleCheck(e)} defaultChecked />} label="People can comment the post" />
                    <Button fullWidth onClick={(e) => clearData(e)} size="large" variant="contained" color="primary" type="reset">
                        Clear data
                    </Button>
                    <Button type="submit" fullWidth size="large" variant="contained" color="success">
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
                    </form>
                </FormGroup>
            </Grid>

        </Container>
    );
};
