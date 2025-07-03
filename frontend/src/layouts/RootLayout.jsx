import React, { lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components";

const Footer = lazy(() => import("../components/Footer"));

export const RootLayout = () => {
    const location = useLocation();
    const hideLayoutPaths = ["/login-page", "/signup"];
    const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

    return (
        <>
            {!shouldHideLayout && (

                <Navbar />

            )}

            <div className={shouldHideLayout ? "min-h-screen" : "min-h-96 pt-14 sm:pt-20"}>

                <Outlet />

            </div>

            {!shouldHideLayout && (
                <Suspense fallback={<h1>Loading...</h1>}>

                    <Footer />

                </Suspense>

            )}
        </>
    );
};