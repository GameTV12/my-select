import axiosInstance from "./axiosInstance";
import {CreateCommentDto} from "../pages/PostCommentList";

export const createComment = (data: CreateCommentDto) => {
    return axiosInstance.post(`/comments/post/`, JSON.stringify(data)).then((res) => res.data)
}