import React from 'react';
import {Route, Routes} from "react-router-dom";
import {privateRoutes, publicRoutes} from "./Routes";

export const AppRouter = () => {
    return (
        <Routes>
            {privateRoutes.map(route =>
                <Route
                    path={route.path}
                    element={<route.element/>}
                    key={route.path}/>)
            }
            {publicRoutes.map(route =>
                <Route
                    path={route.path}
                    element={<route.element/>}
                    key={route.path}/>)
            }
        </Routes>
    );
};
