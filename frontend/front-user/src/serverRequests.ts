import {RegisterType} from "./pages/RegisterPage";

const API_SERVER = "http://localhost:8000"

export const signUpRequest = (data: RegisterType) => {
    const requestOptions: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }
    return fetch(`${API_SERVER}/auth/local/signup`, requestOptions)
        .then((res) => res.json())
}

export const findUserByNickname = (data: string) => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    }
    return fetch(`${API_SERVER}/user/${data}`, requestOptions)
        .then((res) => res.json())
}