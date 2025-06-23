import React, { lazy, Suspense } from "react";
import Footer from "../components/Footer";
import { Outlet, useLocation } from "react-router-dom";

const Header = lazy(() => import("../components/Header"));

export const RootLayout = () => {
    const location = useLocation();
    const hideLayoutPaths = ["/login-page", "/signup"];
    const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

    return (
        <>
            {!shouldHideLayout && (
                <Suspense fallback={<h1>Loading...</h1>}>
                    <Header />
                </Suspense>
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