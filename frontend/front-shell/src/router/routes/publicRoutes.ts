import * as React from "react"
import { FC } from 'react'
import { App } from '../../App'
import FirstVerify from "../../views/login/firstVerify";
import SecondVerify from "../../views/login/secondVerify";
// @ts-ignore
const PostList = React.lazy(() => import('front_post/PostList'))
// @ts-ignore
const UserPostList = React.lazy(() => import('front_post/UserPostList'))
// @ts-ignore
const SinglePost = React.lazy(() => import('front_post/SinglePost'))
// @ts-ignore
const WritePost = React.lazy(() => import('front_post/WritePost'))
// @ts-ignore
const EditPost = React.lazy(() => import('front_post/EditPost'))
// @ts-ignore
const PostCommentList = React.lazy(() => import('front_comment/PostCommentList'))
// @ts-ignore
const VariantCommentList = React.lazy(() => import('front_comment/VariantCommentList'))
// @ts-ignore
const RegisterPage = React.lazy(() => import('front_user/RegisterPage'))
// @ts-ignore
const UpdatePage = React.lazy(() => import('front_user/UpdatePage'))
// @ts-ignore
const UserInfoPage = React.lazy(() => import('front_user/UserInfoPage'))
// @ts-ignore
const RequestList = React.lazy(() => import('front_user/RequestList'))
// @ts-ignore
const ReportList = React.lazy(() => import('front_user/ReportList'))
// @ts-ignore
const SubscriptionList = React.lazy(() => import('front_user/SubscriptionList'))

export enum Role {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    DEFAULT_USER = "DEFAULT_USER",
    BANNED_USER = "BANNED_USER"
}

export interface IRoute {
    path: string
    element: FC
    auth: boolean
    roles?: Role[]
}

export const routePublic: IRoute[] = [
    { path: '/', element: PostList, auth: false }, // all posts +
    { path: '/users/:id', element: UserPostList, auth: false }, // all posts of user +
    { path: '/signup', element: RegisterPage, auth: false }, // register page +
    { path: '/users/update', element: UpdatePage, auth: false }, // register page +
    { path: '/users/subscriptions', element: SubscriptionList, auth: true }, // subscriptions of current user (you) +
    { path: '/users/:id/profile', element: UserInfoPage, auth: false }, // profile page +
    { path: '/posts/create', element: WritePost, auth: true }, // write a post +
    { path: '/posts/edit/:id', element: EditPost, auth: true }, // write a post +
    { path: '/posts/:id', element: SinglePost, auth: false }, // single post +
    { path: '/posts/:id/comments', element: PostCommentList, auth: false }, // comments of posts +
    { path: '/posts/:id/:variantId/comments', element: VariantCommentList, auth: false }, // comments of option +
    { path: '/admin/requests', element: RequestList, auth: true, roles: [Role.ADMIN] }, // requests for admin +-
    { path: '/admin/reports', element: ReportList, auth: true, roles: [Role.ADMIN, Role.MODERATOR] }, // reports +
    { path: '/verification/first/:link', element: FirstVerify, auth: false },
    { path: '/verification/second/:id', element: SecondVerify, auth: false },
    { path: '*', element: App, auth: false }, // 404 found -
]
