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

export interface IRoute {
    path: string
    element: FC
    auth: boolean
}

export const routePublic: IRoute[] = [
    { path: '/', element: PostList, auth: false },
    { path: '/users/:id', element: PostList, auth: false },
    { path: '/users/:id/posts', element: PostList, auth: false },
    { path: '/signup', element: RegisterPage, auth: false },
    { path: '/users/subscriptions', element: SubscriptionList, auth: false },
    { path: '/users/:id/profile', element: UserInfoPage, auth: false },
    { path: '/posts/create', element: WritePost, auth: false },
    { path: '/posts/:id', element: SinglePost, auth: false },
    { path: '/posts/:id/comments', element: PostCommentList, auth: false },
    { path: '/posts/:id/:variantId/comments', element: VariantCommentList, auth: false },
    { path: '*', element: App, auth: true },
]
