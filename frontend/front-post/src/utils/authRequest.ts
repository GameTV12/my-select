import axiosInstance from "./axiosInstance"
import {CreatePostDto} from "../components/createPost/WritePost";
import {EditPostDto} from "../components/createPost/EditPost";

export const createPostRequest = (data: CreatePostDto) => {
    return axiosInstance.post(`/posts`, JSON.stringify(data)).then((res) => res.data)
}

export const deletePostRequest = (id: string) => {
    return axiosInstance.delete(`/posts/${id}`).then((res) => res.data)
}

export const updatePostRequest = (id: string, data: EditPostDto) => {
    return axiosInstance.patch(`/posts/${id}`, JSON.stringify(data)).then((res) => res.data)
}

export const likePostRequest = (id: string) => {
    return axiosInstance.patch(`/posts/${id}/like`).then((res) => res.data)
}

export const dislikePostRequest = (id: string) => {
    return axiosInstance.patch(`/posts/${id}/dislike`).then((res) => res.data)
}

export const voteForVariantRequest = (id: string) => {
    return axiosInstance.patch(`/posts/variant/${id}/vote`).then((res) => res.data)
}

export const addVariantRequest = (id: string, data: { variant: string }) => {
    return axiosInstance.post(`/posts/${id}/variant`, JSON.stringify(data)).then((res) => res.data)
}

export const reportPostRequest = (data: any) => {
    return axiosInstance.post(`/user/reports/create`, JSON.stringify(data)).then((res) => res.data)
}

export const getSinglePostAuth = (postId: string) => {
    return axiosInstance.get(`/posts/${postId}/auth`).then((res) => res.data)
}

export const getUserPostsAuth = (linkNickname: string) => {
    return axiosInstance.get(`/posts/${linkNickname}/user/auth`).then((res) => res.data)
}

export const subscribeRequest = (id: string) => {
    return axiosInstance.get(`/user/follow/${id}`).then((res) => res.data)
}

export const getUserInfoAuth = (linkNickname: string) => {
    return axiosInstance.get(`/user/info/${linkNickname}/auth`).then((res) => res.data)
}

export const getTrendingPostsAuth = () => {
    return axiosInstance.get(`/posts/auth/trends`).then((res) => res.data)
}

export const searchPostsAuth = (args: string) => {
    return axiosInstance.get(`/posts/auth/search/${args}`).then((res) => res.data)
}
