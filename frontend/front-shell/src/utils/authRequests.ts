import axiosInstance from "./axiosInstance";
import {Role} from "../router/routes/publicRoutes";

export interface UserI {
    id: string
    email: string
    linkNickname: string
    role: Role
    visible: boolean
    firstVerification: boolean
    secondVerification: boolean
    unlockTime: any
    iat: number
    exp: number
}