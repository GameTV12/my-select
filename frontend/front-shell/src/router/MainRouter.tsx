import React from 'react'
import {IRoute, routePublic} from "./routes/publicRoutes"
import {Route, Routes} from "react-router"
import AuthHOC from "./routerComponents/AuthHOC"

const MainRouter = () => {
    const allRoutes: IRoute[] = [...routePublic]


    return (
        <Routes>
            {allRoutes.map((route: IRoute) => {
                const ReturnComponent = AuthHOC(route.element, route.auth, route.roles)
                // @ts-ignore
                return <Route path={route.path} element={<ReturnComponent />} key={route.path} />
            })}
        </Routes>
    );
};

export default MainRouter;