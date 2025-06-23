import React from "react";
import { Link } from "react-router-dom";

export const ErrorPage = () => {
    return <div className="min-h-screen w-full">

        <h1>404 Page not found</h1>
        <Link to={'/'} className="btn bg-main" >Home</Link>
    </div>;
};