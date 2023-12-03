import axios, {Axios} from "axios";

const newAxios: Axios = axios.create({
    baseURL: "http://localhost:8000",
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