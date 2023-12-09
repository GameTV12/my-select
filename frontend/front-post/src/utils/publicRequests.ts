import axios, {Axios} from "axios";
import axiosInstance from "./axiosInstance";

const newAxios: Axios = axios.create({
    baseURL: "https://api.myselect.airule.io",
    headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
    }
})

export const getSinglePost = (postId: string) => {
    return newAxios.get(`/posts/${postId}`).then((res) => res.data)
}

export const getUserPosts = (linkNickname: string) => {
    return newAxios.get(`/posts/${linkNickname}/user`).then((res) => res.data)
}

export const getUserInfo = (linkNickname: string) => {
    return newAxios.get(`/user/info/${linkNickname}`).then((res) => res.data)
}

export const getTrendingPosts = () => {
    return newAxios.get(`/posts/trends`).then((res) => res.data)
}

export const searchPosts = (args: string) => {
    return newAxios.get(`/posts/search/${args}`).then((res) => res.data)
}

export const getShortPostInfo = (postId: string) => {
    return newAxios.get(`/posts/short/${postId}`).then((res) => res.data)
}

export const getPostLikeStatistics = (id: string) => {
    return newAxios.get(`/posts/${id}/info/likes`).then((res) => res.data)
}

export const getPostDislikeStatistics = (id: string) => {
    return newAxios.get(`/posts/${id}/info/dislikes`).then((res) => res.data)
}

export const getPostPollStatistics = (id: string) => {
    return newAxios.get(`/posts/${id}/info/poll`).then((res) => res.data)
}