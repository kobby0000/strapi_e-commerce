import React, { useState } from 'react'
import './Navbar.scss';
import { GoChevronDown } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { CiHeart, CiUser } from "react-icons/ci";
import { PiShoppingCartLight } from "react-icons/pi";
import { Link } from 'react-router-dom';
import Cart from '../Cart/Cart';
import { useSelector } from 'react-redux';


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const products = useSelector((state)=>state.cart.products)

  return (
    <div className='navbar'>
      <div className="wrapper">
        <div className="left">
          <div className="item">
            <img className='navbar_lang' src="/public/usukflag.png" alt="" />
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
          <Link to="/" className='navbar_logo'>SageCoby</Link>
        </div>
        <div className="right">
          <div className="item">
            <Link to="/">Home</Link>
          </div>
          <div className="item">
            <Link to="/">About</Link>
          </div>
          <div className="item">
            <Link to="/">Contact</Link>
          </div>
          <div className="item">
            <Link to="/">Stores</Link>
          </div>
          <div className="icons">
            <CiSearch/>
            < CiUser />
            <CiHeart  />
            <div className="cart_icon" onClick={()=>setOpen(!open)}>
              <PiShoppingCartLight />
              <span>{ products.length}</span>
            </div>
          </div>
        </div>
      </div>
      {open && <Cart />}
    </div>
  )
}

export default Navbar