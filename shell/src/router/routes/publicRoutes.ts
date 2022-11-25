import { FC } from 'react'
import App from '../../App'
import { Auth } from '../../views/authentication/Auth'

export interface IRoute {
    path: string
    element: FC
    auth: boolean
}

export const routePublic: IRoute[] = [
    { path: '/', element: App, auth: true },
    { path: '/auth', element: Auth, auth: false },
    { path: '*', element: App, auth: true },
]
