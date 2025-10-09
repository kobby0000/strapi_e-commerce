import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { GoChevronDown } from "react-icons/go";
import { CiSearch, CiHeart, CiUser } from "react-icons/ci";
import { PiShoppingCartLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin, setShowRegister }) => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const products = useSelector((state) => state.cart.products);

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    toast.success("Logged out successfully!");
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">
          <div className="item">
            <img className="navbar_lang" src="/public/usukflag.png" alt="" />
            <GoChevronDown />
          </div>
          <div className="item">
            <span>USD</span>
            <GoChevronDown />
          </div>
          <div className="item">
            <Link to="/products/1">Women</Link>
          </div>
          <div className="item">
            <Link to="/products/2">Men</Link>
          </div>
          <div className="item">
            <Link to="/products/3">Children</Link>
          </div>
        </div>

        <div className="center">
          <Link to="/" className="navbar_logo">
            SageCoby
          </Link>
        </div>

        <div className="right">
          <div className="item">
            <Link to="/">Home</Link>
          </div>
          <div className="item">
            <Link to="/">Contact</Link>
          </div>
          <div className="item">
            <Link to="/">Stores</Link>
          </div>

          <div className="icons">
            <CiSearch />

            {isLoggedIn ? (
              <div className="login" onClick={handleLogout}>
                <span>Logout</span>
                <CiUser />
              </div>
            ) : (
              <>
                <div className="login" onClick={() => setShowLogin(true)}>
                  <span>Login</span>
                  <CiUser />
                </div>
                <div className="login" onClick={() => setShowRegister(true)}>
                  <span>Register</span>
                </div>
              </>
            )}

            <CiHeart />
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
