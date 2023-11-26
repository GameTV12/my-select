import {Box, FormControlLabel, FormGroup, FormHelperText, Grid, Typography,} from '@mui/material'
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form'
import {literal, object, string, TypeOf} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useEffect, useState} from 'react'
import {LoadingButton} from '@mui/lab'
import Checkbox from '@mui/material/Checkbox'
import FormInput from '../components/FormInput'
import {MuiTelInput} from "mui-tel-input";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"
import {MuiFileInput} from "mui-file-input";
import {findUserByNickname, signUpRequest} from "../serverRequests";

export interface RegisterType {
    firstName: string,
    lastName?: string,
    nickname: string,
    linkNickname: string,
    email: string,
    password: string,
    phone: string,
    photo?: string,
    birthday: number
}


const registerSchema = object({
    firstName: string()
        .nonempty('First name is required')
        .min(2, 'Password must be more than 4 characters')
        .max(32, 'Name must be less than 32 characters'),
    lastName: string()
        .max(80, 'Last name must be less than 80 characters'),
    nickname: string()
        .nonempty('Name is required')
        .min(2, 'Name must be more than 2 characters')
        .max(80, 'Name must be less than 80 characters'),
    linkNickname: string()
        .nonempty('Link nickname is required')
        .min(2, 'Link nickname must be more than 2 characters')
        .max(30, 'Link nickname must be less than 30 characters'),
    email: string().nonempty('Email is required').email('Email is invalid')
        .max(100, "Email must be less than 100 characters"),
    password: string()
        .nonempty('Password is required')
        .regex(/[A-Za-z0-9]/, 'Password can use only numbers and letters')
        .min(6, 'Password must be more than 6 characters')
        .max(40, 'Password must be less than 40 characters'),
    passwordConfirm: string().nonempty('Please confirm your password'),
    terms: literal(true, {
        invalid_type_error: 'Accept Terms is required',
    }),
}).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
});

type RegisterInput = TypeOf<typeof registerSchema>;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);

    const methods = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateTime, setDateTime] = useState<dayjs.Dayjs | null>(dayjs('2000-04-10'));
    const [photo, setPhoto] = useState<null | File>(null);
    const handlePhoneChange = (newValue: string) => {
        setPhoneNumber(newValue)
    }

    const handlePhotoChange = (newValue: File | null) => {
        // uploading
        console.log(newValue?.name)
        setPhoto(newValue)
    }

    const {
        reset,
        handleSubmit,
        register,
        formState: {isSubmitSuccessful, errors},
    } = methods;

    // useEffect(() => {
    //     if (isSubmitSuccessful) {
    //         reset();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isSubmitSuccessful]);

    useEffect(() => {
        findUserByNickname(methods.getValues().linkNickname)
    }, [phoneNumber]);

    const onSubmitHandler: SubmitHandler<RegisterInput> = (data, event) => {
        if (event != undefined) {
            event.preventDefault()
        }
        const sendingData: RegisterType = {...methods.getValues(), birthday: 1324324, phone: phoneNumber.replace(/ /g,'')}
        if (dateTime) {
            sendingData.birthday = dateTime.unix()
        }
        console.log(sendingData)
        signUpRequest(sendingData).then(r => {
            console.log(r)
        })
    };
    console.log(errors);

    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                <Typography variant='h4' component='h1' sx={{mb: '2rem', alignItems: 'center'}}>
                    Register
                </Typography>
                <FormProvider {...methods}>
                    <Box
                        component='form'
                        noValidate
                        autoComplete='off'
                        onSubmit={(e) => onSubmitHandler}
                    >
                        <Grid container spacing={2} direction={"row"}>
                            <Grid item xs={6}>
                                <FormInput
                                    name='firstName'
                                    required
                                    label='First name'
                                    sx={{mb: 2}}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormInput
                                    fullWidth
                                    name='lastName'
                                    label='Last (family) name'
                                    sx={{mb: 2}}
                                />
                            </Grid>

                        </Grid>


                        <FormInput
                            name='nickname'
                            required
                            fullWidth
                            label='Nickname'
                            sx={{mb: 2}}
                        />

                        <FormInput
                            name='linkNickname'
                            required
                            fullWidth
                            label='Link nickname'
                            sx={{mb: 2}}
                        />

                        <FormInput
                            name='email'
                            required
                            fullWidth
                            label='Email'
                            type='email'
                            sx={{mb: 2}}
                        />

                        <FormInput
                            name='password'
                            required
                            fullWidth
                            label='Password'
                            type='password'
                            sx={{mb: 2}}
                        />

                        <FormInput
                            name='passwordConfirm'
                            required
                            fullWidth
                            label='Confirm Password'
                            type='password'
                            sx={{mb: 2}}
                        />

                        <MuiTelInput
                            defaultCountry={'CZ'}
                            required
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            fullWidth
                            label='Phone'
                            sx={{mb: 2}}
                            inputProps={{
                                inputMode: 'tel'
                            }}
                        />

                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}>
                            <DatePicker
                                disableFuture
                                defaultValue={dayjs('2000-04-10')}
                                value={dateTime}
                                onChange={(newValue) => setDateTime(newValue)}
                                slotProps={{ textField: { fullWidth: true, name: 'birthday' } }}
                            />
                        </LocalizationProvider>

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
                                        You must confirm email after registration and in 14 days
                                    </Typography>
                                }
                            />
                            <FormHelperText error={!!errors['terms']}>
                                {errors['terms'] ? errors['terms'].message : ''}
                            </FormHelperText>
                        </FormGroup>

                        <LoadingButton
                            variant='contained'
                            fullWidth
                            type='submit'
                            loading={loading}
                            sx={{py: '0.8rem', mt: '1rem'}}
                        >
                            Register
                        </LoadingButton>
                    </Box>
                </FormProvider>
            </Grid>
        </Grid>
    );
};

export default RegisterPage
