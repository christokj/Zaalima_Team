import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { ErrorPage } from "../pages/ErrorPage";
import ScrollToTop from "../components/ui/ScrollToTop";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import HomePage from "../pages/Consumer/HomePage";
import AboutPage from "../pages/Consumer/AboutPage";
import ContactPage from "../pages/Consumer/ContactPage";
import ProductPage from "../pages/Products/ProductPage";
import ProductsPage from "../pages/Products/ProductsPage";

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
            },

            // {
            //     path: "about",
            //     element: <AboutPage />,
            // },
            // {
            //     path: "contact",
            //     element: <ContactPage />,
            // },
            // {
            //     path: "product",
            //     element: <ProductPage />,
            // },
            {
                path: "products",
                element: <ProductsPage />,
            }
        ],
    },
]);
