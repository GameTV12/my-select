import axios from "axios"
import {Cookies} from "react-cookie"

export enum Role {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    DEFAULT_USER = "DEFAULT_USER",
    BANNED_USER = "BANNED_USER"
}

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



const refreshTokenFn = async () => {
    try {
        let cookies = new Cookies()
        const axiosRefresh = axios.create({
            baseURL: "https://api.myselect.airule.io",
            headers: {
                "Content-Type": "application/json",
                "accept": "*/*",
                "Authorization": 'Bearer ' + cookies.get('myselect_refresh')
            },
            responseType: 'json'
        })
        const response = await axiosRefresh.post("auth/refresh")

        const {access_token, refresh_token} = response.data

        if (access_token) {
            const current = new Date()
            const accessTime = new Date(current.getTime() + 30 * 1000)
            const refreshTime = new Date(current.getTime() + 90 * 24 * 3600 * 1000)
            cookies.set('myselect_access', access_token, {expires: accessTime, domain: 'myselect.airule.io', path: '/'})
            cookies.set('myselect_refresh', refresh_token, {expires: refreshTime, domain: 'myselect.airule.io', path: '/'})
        }

        return {access_token, refresh_token}
    } catch (error) {

    }

}


const axiosInstance = axios.create({
    baseURL: "https://api.myselect.airule.io",
    headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
    },
    responseType: 'json'
})

axiosInstance.interceptors.request.use(
    async (config) => {
        let cookies = new Cookies()
        // cookies.remove('myselect_refresh')//
        // cookies.remove('myselect_access')//
        const token = cookies.get('myselect_access')
        console.log('First token from shell - ' + cookies.get('myselect_refresh'))

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
            console.log('Token from shell - ' + token)
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;

        if (error?.response?.status === 401 && !config?.sent) {
            config.sent = true;

            const result = await refreshTokenFn()

            if (result?.access_token) {
                config.headers = {
                    ...config.headers,
                    authorization: `Bearer ${result?.access_token}`,
                };
            }

            return axios(config);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance