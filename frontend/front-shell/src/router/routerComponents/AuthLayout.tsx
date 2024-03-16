import {ReactNode} from "react";
import {Box} from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

export default function AuthLayout({ children }: { children: ReactNode }){
    return (
        <Box sx={{
            minHeight: '100vh',
            position: 'relative'
        }}>
            <Header />
            <Box flex={1} sx={{ paddingBottom: 7 }}>
                {children}
            </Box>
            {/*<Footer />*/}
        </Box>
    )
}