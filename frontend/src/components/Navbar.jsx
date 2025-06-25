import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import api from "../config/axiosInstance";
import { toast } from "sonner";
import { styles } from "../styles";
import { menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      dispatch(logoutUser());
      await api.post("/public/logout", {}, { withCredentials: true });
      toast.success("Logout successful");
      navigate("/login-page");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Products", path: "/products" },
    { title: "About", path: "/about" },
    isAuthenticated
      ? { title: "Logout", path: "#", onClick: handleLogout }
      : { title: "Login", path: "/login-page" },
  ];

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 ${scrolled ? "bg-primary" : "bg-transparent"
        }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto mt-5">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
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
        <ul className="list-none hidden sm:flex flex-row gap-10">
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
        </ul>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${!toggle ? "hidden" : "flex"
              } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
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
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
