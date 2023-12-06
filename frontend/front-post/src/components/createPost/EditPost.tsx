import * as React from "react"
import {
    Button,
    FormControl,
    FormGroup,
    FormLabel, Grid,
    styled,
    TextField, Typography
} from "@mui/material";
import {useEffect, useState} from "react"
import {updatePostRequest} from "../../utils/authRequest";
import {useNavigate, useParams} from "react-router-dom";
import {getShortPostInfo} from "../../utils/publicRequests";

export interface EditPostDto {
    title: string
    text: string
}

const CustomFormControl = styled(FormControl)(() => ({
    marginTop: '10px',
    marginBottom: '10px',
    '& label': {
        color: 'black',
        letterSpacing: 0.5,
        textIndent: 5,
        marginBottom: '5px'
    }
}))

export const EditPost = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [formData, setFormData] = useState<EditPostDto>({title: '', text: ''});
    useEffect(() => {
        if (id) getShortPostInfo(id).then((response) => setFormData(response))
    }, [id])

    function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault()
        if (id) {
            updatePostRequest(id, formData)
            return navigate(`/posts/${id}`)
        }
    }

    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                <Typography variant={"h3"} align={"center"}>
                    Edit the post
                </Typography>
                <form onSubmit={handleSubmit}>
                    <CustomFormControl fullWidth required>
                        <FormLabel htmlFor={"title"}>
                            Title
                        </FormLabel>
                        <TextField
                            id={"title"}
                            name={"title"}
                            type={"text"}
                            placeholder={"Enter a title"}
                            required
                            inputProps={{maxLength: 160}}
                            helperText={`${formData.title.length}/160 symbols used`}
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </CustomFormControl>
                    <CustomFormControl fullWidth required>
                        <FormLabel htmlFor={"text"}>
                            Text
                        </FormLabel>
                        <TextField id={"text"} name={"text"} type={"text"} placeholder={"Enter a text"}
                                   multiline
                                   rows={3}
                                   maxRows={50}
                                   required
                                   inputProps={{maxLength: 10000}}
                                   helperText={`${formData.text.length}/10000 symbols used`}
                                   value={formData.text}
                                   onChange={(e) => setFormData({...formData, text: e.target.value})}
                                   fullWidth/>
                    </CustomFormControl>
                    <FormControl fullWidth>
                        <Button variant="contained" type={"submit"}>Update the post</Button>
                    </FormControl>
                </form>
            </Grid>
        </Grid>


    )
}

export default EditPost