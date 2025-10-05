import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <div className='footer'>
      <div className="top">
        <div className="item">
          <h1>Categories</h1>
          <span>Women</span>
          <span>Men</span>
          <span>Shoes</span>
          <span>Accessories</span>
          <span>New Arrivals</span>
        </div>
        <div className="item">
          <h1>Links</h1>
          <span>Faq</span>
          <span>Pages</span>
          <span>Stores</span>
          <span>Cookies</span>
        </div>
        <div className="item">
          <h1>About</h1>
          <span>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus distinctio numquam, eius accusamus voluptates nulla maxime quaerat?</span>
        </div>
        <div className="item">
          <h1>Contact</h1>
          <span>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus distinctio numquam, eius accusamus voluptates nulla maxime quaerat?</span>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <span className='logo'>SageCoby</span>
          <span className='copyright'>&copy; {new Date().getFullYear()} SageCoby. All rights reserved.</span>
        </div>
        <div className="right">
          <img src="/public/payment.webp" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Footer