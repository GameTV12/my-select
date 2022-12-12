import { FC } from 'react'
import { App } from '../../App'
// @ts-ignore
import WritePost from "post/WritePost"

export interface IRoute {
    path: string
    element: FC
    auth: boolean
}

export const routePublic: IRoute[] = [
    { path: '/', element: App, auth: true },
    { path: '/write', element: WritePost, auth: false },
    { path: '*', element: App, auth: true },
]
