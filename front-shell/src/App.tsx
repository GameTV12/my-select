import * as React from 'react'

// @ts-ignore
import { VueInReact, VueWrapper } from 'vuera'
import "./index.css";
import Header from "./router/routerComponents/Header";
import {Box} from "@mui/material";
// @ts-ignore
const WritePost = React.lazy(() => import('front_post/WritePost'))
// @ts-ignore
// import Hello from "front_registration/Hello"


export const App = () => {
    //const HelloWorld = VueInReact(Hello)
    return (
        <Box>
            <Header />
            <WritePost />
        </Box>
    )
}