import axiosInstance from "./axiosInstance";
import {CreateCommentDto, EditCommentDto} from "../pages/PostCommentList";
import {CreateReportInterface} from "../components/ReportCommentModal";

export const createPostComment = (data: CreateCommentDto) => {
    return axiosInstance.post(`/comments/post/`, JSON.stringify(data)).then((res) => res.data)
}

export const createVariantComment = (data: CreateCommentDto) => {
    return axiosInstance.post(`/comments/variant/`, JSON.stringify(data)).then((res) => res.data)
}

export const deleteCommentRequest = (id: string) => {
    return axiosInstance.delete(`/comments/${id}`).then((res) => res.data)
}

export const editCommentRequest = (data: EditCommentDto) => {
    return axiosInstance.patch(`/comments/update`, JSON.stringify(data)).then((res) => res.data)
}

export const likeCommentRequest = (id: string) => {
    return axiosInstance.patch(`/comments/${id}/like`).then((res) => res.data)
}

export const dislikeCommentRequest = (id: string) => {
    return axiosInstance.patch(`/comments/${id}/dislike`).then((res) => res.data)
}

export const reportCommentRequest = (data: CreateReportInterface) => {
    return axiosInstance.post(`/user/reports/create`, JSON.stringify(data)).then((res) => res.data)
}

export const getAllCommentsOfPostAuth = (id: string) => {
    return axiosInstance.get(`/comments/post/auth/${id}`).then((res) => res.data)
}

export const getAllCommentsOfVariantAuth = (data: string) => {
    return axiosInstance.get(`/comments/variant/auth/${data}`).then((res) => res.data)
}

export const getAllCommentsOfUserAuth = (data: string) => {
    return axiosInstance.get(`/comments/user/auth/${data}`).then((res) => res.data)
}