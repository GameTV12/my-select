import { FC } from 'react'
import { TextField, TextFieldProps } from "@mui/material"
import { Controller, useFormContext } from "react-hook-form"

type IFormInputProps = {
    name: string
} & TextFieldProps

const FormInput: FC<IFormInputProps> = ({ name, ...otherProps }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext()


    return (
        <Controller control={control} name={name} defaultValue={""} render={({ field }) => (
            <TextField
                {...otherProps}
                {...field}
                error={!!errors[name]}
                // @ts-ignore
                helperText={errors[name] ? errors[name].message : ''}
            />
        )}
        />
    )
}

export default FormInput