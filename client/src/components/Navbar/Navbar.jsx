import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { GoChevronDown } from "react-icons/go";
import { CiSearch, CiUser } from "react-icons/ci";
import { PiShoppingCartLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const products = useSelector((state) => state.cart.products);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    toast.success("Logged out successfully!");
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">
          <div className="item">
            <img className="navbar_lang" src="/usukflag.png" alt="" />
            <GoChevronDown />
          </div>
          <div className="item">
            <span>USD</span>
            <GoChevronDown />
          </div>
          <div className="item">
            <Link to="/products/laptops">Laptops</Link>
          </div>
          <div className="item">
            <Link to="/products/phones">Phones</Link>
          </div>
          <div className="item">
            <Link to="/products/audio">Audio</Link>
          </div>
        </div>

        <div className="center">
          <Link to="/" className="navbar_logo">
            CircuitCart
          </Link>
        </div>

        <div className="right">
          <div className="item">
            <Link to="/">Home</Link>
          </div>
          <div className="item">
            <Link to="/products/gaming">Gaming</Link>
          </div>
          <div className="item">
            <Link to="/admin">Admin</Link>
          </div>

          <div className="icons">
            <CiSearch />

            {isLoggedIn ? (
              <>
                {user?.role === "admin" && (
                  <Link className="login" to="/admin/dashboard">
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="login" onClick={handleLogout} title={user?.email || "Account"}>
                  <span>Logout</span>
                  <CiUser />
                </div>
              </>
            ) : (
              <>
                <div className="login" onClick={() => setShowLogin(true)}>
                  <span>Login</span>
                  <CiUser />
                </div>
              </>
            )}

            <div className="cart_icon" onClick={() => setOpen(!open)}>
              <PiShoppingCartLight />
              <span>{products.length}</span>
            </div>
          </div>
        </div>
      </div>
      {open && <Cart />}
    </div>
  );
};

export default Navbar;
