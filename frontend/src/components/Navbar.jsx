import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import api from "../config/axiosInstance";
import { toast } from "sonner";
import { styles } from "../styles";
import { menu, close } from "../assets";
import { FaShoppingCart } from "react-icons/fa";
const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/public/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCartCount(res.data.cart?.length || 0);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await api.post("/public/logout", {}, { withCredentials: true });
      localStorage.removeItem("accessToken");
      dispatch(logoutUser());
      toast.success("Logout successful");
      navigate("/login-page");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Products", path: "/products" },
    isAuthenticated
      ? { title: "Logout", path: "#", onClick: handleLogout }
      : { title: "Login", path: "/login-page" },
  ];

  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-50 bg-transparent backdrop-blur-xs`}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto mt-5">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/dfm6raue1/image/upload/fl_preserve_transparency/v1724577774/Services_ECommerce_v2-01_xjoraa.jpg?_s=public-apps"
            alt="logo"
            className="w-14 h-14 object-contain"
          />
          <p className="text-white text-[18px] sm:text-[22px] font-bold cursor-pointer flex">
            TrendiQ &nbsp;
          </p>
        </Link>

        {/* Desktop Navigation */}
        <ul className="list-none hidden sm:flex flex-row gap-10 items-center">
          {navLinks.map((nav) => (
            <li key={nav.title}>
              {nav.onClick ? (
                <button
                  onClick={nav.onClick}
                  className="text-[18px] font-medium cursor-pointer text-gray-400 hover:text-white"
                >
                  {nav.title}
                </button>
              ) : (
                <NavLink
                  to={nav.path}
                  className={({ isActive }) =>
                    `text-[18px] font-medium cursor-pointer ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
                  }
                >
                  {nav.title}
                </NavLink>
              )}
            </li>
          ))}

          <li className="relative">
            <Link to="/cart" className="text-white text-xl relative">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />

          <div className={`${!toggle ? "hidden" : "flex"} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
            <ul className="list-none flex flex-col gap-4">
              {navLinks.map((nav) => (
                <li key={nav.title}>
                  {nav.onClick ? (
                    <button
                      onClick={() => {
                        nav.onClick();
                        setToggle(false);
                      }}
                      className="font-medium text-[16px] text-white"
                    >
                      {nav.title}
                    </button>
                  ) : (
                    <NavLink
                      to={nav.path}
                      onClick={() => setToggle(false)}
                      className="font-medium text-[16px] text-white"
                    >
                      {nav.title}
                    </NavLink>
                  )}
                </li>
              ))}

              <li>
                <Link to="/cart" onClick={() => setToggle(false)} className="text-white flex items-center gap-2">
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-xs px-2 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
