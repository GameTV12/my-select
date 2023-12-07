import {Box, Button, FormControlLabel, FormGroup, FormHelperText, Grid, Typography,} from '@mui/material'
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form'
import {literal, z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useEffect, useState} from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormInput from '../components/FormInput'
import {MuiFileInput} from "mui-file-input";
import {checkUniqueEmailOrLink, findUserByNickname} from "../utils/publicRequests";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useCookies} from "react-cookie";
import {UserI} from "../utils/axiosInstance";
import {jwtDecode} from "jwt-decode";
import {editRequest} from "../utils/authRequests";

export interface EditType {
    nickname: string,
    photo?: string,
}

const UpdatePage = () => {
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);

    const registerSchema = z.object({
        nickname: z.string()
            .nonempty('Name is required')
            .min(2, 'Name must be more than 2 characters')
            .max(80, 'Name must be less than 80 characters')
        ,
        terms: literal(true, {
            invalid_type_error: 'Accept Terms is required',
        }),
    });

    type RegisterInput = z.infer<typeof registerSchema>;

    const [loading, setLoading] = useState(false);
    const methods = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });
    const [photo, setPhoto] = useState<null | File>(null);
    const navigate = useNavigate()


    useEffect(() => {
        if (cookies.myselect_refresh) {
            setCurrentUser(jwtDecode(cookies.myselect_refresh))
        }
        else setCurrentUser(null)
    }, [cookies])

    useEffect(() => {
        if (currentUser) {
            findUserByNickname(currentUser.linkNickname)
        }
    }, [currentUser]);


    const {
        reset,
        handleSubmit,
        register,
        formState: {isSubmitSuccessful, errors},
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    const handlePhotoChange = (newValue: File | null) => {
        setPhoto(newValue)
    }

    const fileUpload = async (file: File) => {
        const photoData = new FormData()
        photoData.append("file", file)
        photoData.append("upload_preset", "myselectpostphotos")
        photoData.append("cloud_name", "doheyc7ux")
        let answer = ""
        await axios.post(`https://api.cloudinary.com/v1_1/doheyc7ux/image/upload`,
            photoData).then((response) => {
            answer = response.data["secure_url"]
        })
        return answer
    }


    const onSubmitHandler: SubmitHandler<RegisterInput> = (data) => {
        const sendingData: EditType = {
            ...data
        }
        if (!photo) {
            editRequest(sendingData).then(r => {
                console.log(r)
            })
            navigate(`/`)
        }
        else {
            fileUpload(photo).then((response) => {
                sendingData.photo = response;
                editRequest(sendingData);
                navigate(`/`)
            })
        }
    };

    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                <Typography variant='h4' component='h1' sx={{mb: '2rem', alignItems: 'center'}}>
                    Edit the profile
                </Typography>
                <FormProvider {...methods}>
                    <Box
                        noValidate
                        component='form'
                        autoComplete='off'
                        onSubmit={handleSubmit(onSubmitHandler)}
                    >

                        <FormInput
                            name='nickname'
                            required
                            fullWidth
                            label='Nickname'
                            sx={{mb: 2}}
                            placeholder={"Enter your new email..."}
                        />

                        <MuiFileInput
                            label="Upload a photo (optional)"
                            name='photo'
                            fullWidth
                            sx={{my: 2}}
                            value={photo}
                            onChange={handlePhotoChange}
                        />


                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox required/>}
                                {...register('terms')}
                                label={
                                    <Typography color={errors['terms'] ? 'error' : 'inherit'}>
                                        You must confirm these changes
                                    </Typography>
                                }
                            />
                            <FormHelperText error={!!errors['terms']}>
                                {errors['terms'] ? errors['terms'].message : ''}
                            </FormHelperText>
                        </FormGroup>

                        <Button
                            variant='contained'
                            fullWidth
                            type='submit'
                            sx={{py: '0.8rem', mt: '1rem'}}
                        >
                            Update the account
                        </Button>
                    </Box>
                </FormProvider>
            </Grid>
        </Grid>
    );
};

export default UpdatePage
