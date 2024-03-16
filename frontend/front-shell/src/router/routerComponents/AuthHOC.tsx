import React, {Suspense, useEffect, useState} from 'react'
import {ComponentProps, ComponentType} from 'react'
import {Navigate} from "react-router";
import AuthLayout from "./AuthLayout";
import {useCookies} from "react-cookie"
import {Role} from "../routes/publicRoutes";
import {UserI} from "../../utils/authRequests";
import {jwtDecode} from "jwt-decode";

function AuthHOC(WrappedComponent: ComponentType, authRequired: boolean, roles?: Role[]) {
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh != null ? jwtDecode(cookies.myselect_refresh) : null);

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies.myselect_refresh])


    return (props: ComponentProps<typeof Object>) => {
        if (!authRequired || (currentUser && (!roles || roles.includes(currentUser.role)))) {
            return (
                <Suspense fallback={"loading"}>
                    <AuthLayout>
                        <WrappedComponent {...props} />
                    </AuthLayout>
                </Suspense>
            )
        }
        return <Navigate replace to={'/'}/>
    }
}

export default AuthHOC