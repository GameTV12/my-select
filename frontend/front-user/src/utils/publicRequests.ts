import {RegisterType} from "../pages/RegisterPage";
import axios, {Axios} from "axios";

const newAxios: Axios = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
    }
})

export const signUpRequest = (data: RegisterType) => {
    return newAxios.post(`/auth/local/signup`, JSON.stringify(data)).then((res) => res.data)
}

export const findUserByNickname = (data: string) => {
    return newAxios.get(`/user/${data}`).then((res) => res.data)
}

export const getAllCommentsOfUser = (data: string) => {
    return newAxios.get(`/comments/user/${data}`).then((res) => res.data)
}

export const getAllReports = () => {
    return newAxios.get(`/user/reports`).then((res) => res.data)
}

export const getAllRequests = () => {
    return newAxios.get(`/user/moderator`).then((res) => res.data)
}

export const checkUniqueEmailOrLink = (data: {value: string, type: string}) => {
    return newAxios.post(`/auth/local/check`, JSON.stringify(data)).then((res) => res.data).catch(() => false)
}

export const getAllFollowers = (link: string) => {
    return newAxios.get(`/user/${link}/followings`).then((res) => res.data)
}