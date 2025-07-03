import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { ErrorPage } from "../pages/ErrorPage";
import ScrollToTop from "../components/ui/ScrollToTop";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import HomePage from "../pages/Consumer/HomePage";
import AboutPage from "../pages/Consumer/AboutPage";
import ContactPage from "../pages/Consumer/ContactPage";
import ProductPage from "../pages/Products/ProductPage";
import ProductsPage from "../pages/Products/ProductsPage";
import SuccessPage from "../pages/Payment/SuccessPage";
import CancelPage from "../pages/Payment/CancelPage";
import CartPage from "../pages/cart/CartPage";
import { AdminLayout } from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import { User } from "lucide-react";
import UsersList from "../pages/Admin/UsersList";
import ProductsList from "../pages/Admin/ProductsList";
import AddEditProduct from "../pages/Admin/AddEditProduct";
import CustomDesignOrdersList from "../pages/Admin/CustomDesignOrdersList.jsx";
import ConsumerProtectedRoute from "./protectedRoutes/ConsumerProtectedRoute .jsx";
import AdminProtectedRoute from "./protectedRoutes/AdminProtectedRoute.jsx";
import ProfilePage from "../pages/Consumer/ProfilePage.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ScrollToTop>
                <RootLayout />
            </ScrollToTop>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: (
                    <HomePage />
                ),
            },
            {
                path: "login-page",
                element: <LoginPage />,
            },
            {
                path: "signup",
                element: <SignupPage />,
            }, ,
            {
                path: "product/:id",
                element: <ProductPage />,
            },
            {
                path: "products",
                element: <ProductsPage />,
            },
            {
                path: "profile",
                element: (
                    <ConsumerProtectedRoute>
                        <ProfilePage />
                    </ConsumerProtectedRoute>
                ),
            },
            {
                path: "success",
                element: <SuccessPage />
            },
            {
                path: "cancel",
                element: <CancelPage />
            },
            {
                path: "cart",
                element: (
                    <ConsumerProtectedRoute>
                        <CartPage />
                    </ConsumerProtectedRoute>
                ),
            }
        ],
    },
    {
        path: "admin",
        element: (
            <AdminProtectedRoute>
                <AdminLayout />
            </AdminProtectedRoute>
        ),
        children: [
            {
                path: "",
                element: <AdminDashboard />
            },
            {
                path: "products",
                element: <ProductsList />
            },
            {
                path: "addEditProduct/:id",
                element: <AddEditProduct />
            },
            {
                path: "users",
                element: <UsersList />
            },
            {
                path: "custom-clothes",
                element: <CustomDesignOrdersList />
            }

        ]
    }
]);
