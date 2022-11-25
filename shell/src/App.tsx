import * as React from 'react'
import * as ReactDOM from "react-dom"

import "./index.css";
import Header from "./router/routerComponents/Header";
import Footer from "./router/routerComponents/Footer";
import {Box} from "@mui/material";

const App = () => {
    return (
            <Box className="container">
                <Header />
                <div>Some text</div>
            </Box>
    )
}

ReactDOM.render(<App />, document.getElementById("app"));
