import {LoginCard} from "../components/login/LoginModal";
import axios, {AxiosRequestConfig} from "axios";

export const signInRequest = (data: LoginCard) => {
    const requestOptions: AxiosRequestConfig = {
        headers: { "Content-Type": "application/json",
                "accept": "*/*"},
        baseURL: "http://localhost:8000"
    }
    return axios.post(`auth/local/signin`, JSON.stringify(data), requestOptions).then((res) => res.data)
}

export const firstVerificationRequest = (link: string) => {
    const requestOptions: AxiosRequestConfig = {
        headers: {"accept": "*/*"},
        baseURL: "http://localhost:8000"
    }
    return axios.get(`auth/local/firstVerification/${link}`, requestOptions).then((res) => res.data)
}

export const secondVerificationRequest = (id: string) => {
    const requestOptions: AxiosRequestConfig = {
        headers: { "Content-Type": "application/json",
            "accept": "*/*"},
        baseURL: "http://localhost:8000"
    }
    return axios.get(`/auth/local/secondVerification/${id}`, requestOptions).then((res) => res.data)
}