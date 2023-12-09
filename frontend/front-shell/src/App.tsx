import * as React from 'react'

// @ts-ignore
import { VueInReact, VueWrapper } from 'vuera'
import "./index.css";
import Header from "./router/routerComponents/Header";
import {Box} from "@mui/material";
import {Suspense} from "react";
// @ts-ignore
const PostList = React.lazy(() => import('front_post/ReservedPostList'))
// @ts-ignore
// import Hello from "front_registration/Hello"


export const App = () => {
    return (
        <Box>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                404 not found
            </Suspense>
        </Box>
    )
}