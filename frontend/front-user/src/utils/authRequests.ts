import axiosInstance from "./axiosInstance";

export const getAllCommentsOfUserAuth = (data: string) => {
    return axiosInstance.get(`/comments/user/auth/${data}`).then((res) => res.data)
}

export const subscribeRequest = (id: string) => {
    return axiosInstance.get(`/user/follow/${id}`).then((res) => res.data)
}

export const createModeratorRequest = (data: { text: string }) => {
    return axiosInstance.post(`/user/moderator/create`, JSON.stringify(data)).then((res) => res.data)
}