import axiosInstance from "./axiosInstance";
import {EditType} from "../pages/UpdatePage";

interface RequestModerator {
    text: string
}

export const getAllCommentsOfUserAuth = (data: string) => {
    return axiosInstance.get(`/comments/user/auth/${data}`).then((res) => res.data)
}

export const subscribeRequest = (id: string) => {
    return axiosInstance.get(`/user/follow/${id}`).then((res) => res.data)
}

export const createModeratorRequest = (data: RequestModerator) => {
    return axiosInstance.post(`/user/moderator/create`, JSON.stringify(data)).then((res) => res.data)
}

export const acceptRequest = (id: string) => {
    return axiosInstance.get(`/user/moderator/${id}/accept`).then((res) => res.data)
}

export const editRequest = (data: EditType) => {
    return axiosInstance.patch(`/auth/edit`, JSON.stringify(data)).then((res) => res.data)
}
export const denyRequest = (id: string) => {
    return axiosInstance.get(`/user/moderator/${id}/deny`).then((res) => res.data)
}

export const cancelModerator = (id: string) => {
    return axiosInstance.get(`/user/moderator/${id}/cancel`).then((res) => res.data)
}

export const banUserRequest = (userId: string) => {
    return axiosInstance.post(`/user/ban`, JSON.stringify({userId: userId, unlockTime: new Date('2038-01-01').getTime()})).then((res) => res.data)
}