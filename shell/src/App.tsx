import * as React from 'react'
import * as ReactDOM from "react-dom"

import "./index.css";
import Header from "./router/routerComponents/Header";
import {Box} from "@mui/material";
// @ts-ignore
import WritePost from "post/WritePost"

export const App = () => {
    return (
            <Box className="container">
                <Header />
                <div>Some text</div>
                <WritePost />
            </Box>
    )
}

ReactDOM.render(<App />, document.getElementById("app"));
