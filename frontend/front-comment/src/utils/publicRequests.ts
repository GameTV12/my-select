import axios, {Axios} from "axios";

const newAxios: Axios = axios.create({
    baseURL: "https://api.myselect.airule.io",
    headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
    },
    responseType: 'json'
})

export const getAllCommentsOfPost = (data: string) => {
    return newAxios.get(`/comments/post/${data}`).then((res) => res.data)
}

export const getAllCommentsOfVariant = (data: string) => {
    return newAxios.get(`/comments/variant/${data}`).then((res) => res.data)
}

export const getAllCommentsOfUser = (data: string) => {
    return newAxios.get(`/comments/user/${data}`).then((res) => res.data)
}
