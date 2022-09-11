import {CreatePost} from "../../components/user/create_post/CreatePost";
import {Home} from "../../components/public/home/Home";
import {Error} from "../../components/public/error/Error";
import {FC} from "react";

interface InterfaceRoutes {
    path: string,
    element: FC
}

export const privateRoutes: InterfaceRoutes[] = [
    {path: '/write-post', element: CreatePost},
]

export const publicRoutes = [
    {path: '/', element: Home},
    {path: '*', element: Error},
]