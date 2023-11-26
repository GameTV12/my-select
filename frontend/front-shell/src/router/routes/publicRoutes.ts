import * as React from "react"
import { FC } from 'react'
import { App } from '../../App'
// @ts-ignore
const PostList = React.lazy(() => import('front_post/PostList'))
// @ts-ignore
const SinglePost = React.lazy(() => import('front_post/SinglePost'))
// @ts-ignore
const WritePost = React.lazy(() => import('front_post/WritePost'))
// @ts-ignore
const PostCommentList = React.lazy(() => import('front_comment/PostCommentList'))
// @ts-ignore
const VariantCommentList = React.lazy(() => import('front_comment/VariantCommentList'))
// @ts-ignore
const RegisterPage = React.lazy(() => import('front_user/RegisterPage'))
// @ts-ignore
const UserInfoPage = React.lazy(() => import('front_user/UserInfoPage'))
// @ts-ignore
const RequestList = React.lazy(() => import('front_user/RequestList'))
// @ts-ignore
const SubscriptionList = React.lazy(() => import('front_user/SubscriptionList'))

export enum Roles {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    DEFAULT_USER = "DEFAULT_USER",
    BANNED_USER = "BANNED_USER"
}

export interface IRoute {
    path: string
    element: FC
    auth: boolean
    roles?: Roles[]
}

export const routePublic: IRoute[] = [
    { path: '/', element: PostList, auth: false }, // all posts +
    { path: '/users/:id', element: PostList, auth: false }, // all posts of user +
    { path: '/signup', element: RegisterPage, auth: false }, // register page +
    { path: '/users/subscriptions', element: SubscriptionList, auth: true }, // subscriptions of current user (you) +
    { path: '/users/:id/profile', element: UserInfoPage, auth: false }, // profile page +
    { path: '/users/requests', element: RequestList, auth: true, roles: [Roles.ADMIN] }, // requests for admin +
    { path: '/users/reports', element: UserInfoPage, auth: true, roles: [Roles.ADMIN, Roles.MODERATOR] }, // reports of users -
    { path: '/posts/create', element: WritePost, auth: true }, // write a post +
    { path: '/posts/:id', element: SinglePost, auth: false }, // single post +
    { path: '/posts/:id/comments', element: PostCommentList, auth: false }, // comments of posts +
    { path: '/posts/:id/:variantId/comments', element: VariantCommentList, auth: false }, // comments of option +
    { path: '/posts/reports', element: SinglePost, auth: true, roles: [Roles.ADMIN, Roles.MODERATOR] }, // reports on posts -
    { path: '/comments/reports', element: App, auth: true, roles: [Roles.ADMIN, Roles.MODERATOR] }, // reports on comments -
    { path: '/admin', element: App, auth: true, roles: [Roles.ADMIN, Roles.MODERATOR] }, // reports on comments -
    { path: '*', element: App, auth: false }, // 404 found -
]
