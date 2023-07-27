import React, {Suspense} from 'react'
import { ComponentProps, ComponentType } from 'react'
import {Navigate} from "react-router";
import AuthLayout from "./AuthLayout";

function AuthHOC(WrappedComponent: ComponentType, authRequired: boolean) {
    const auth = true

    return (props: ComponentProps<typeof Object>) => {
        // if (!authRequired) {
        //     return <WrappedComponent {...props} />
        // } else if (authRequired) {
            if (auth) {
                return (
                    <Suspense fallback={"loading"}>
                        <AuthLayout>
                            <WrappedComponent {...props} />
                        </AuthLayout>
                    </Suspense>
                )
            }
        }
        return <Navigate replace to={'/auth'} />
    // }
}

export default AuthHOC