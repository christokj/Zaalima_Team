
import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";


export const AdminLayout = () => {

    return (
        <>
            <AdminHeader />
            <Outlet />

        </>
    );
};