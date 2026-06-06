import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <div className='footer'>
      <div className="top">
        <div className="item">
          <h1>Categories</h1>
          <span>Laptops</span>
          <span>Phones</span>
          <span>Audio</span>
          <span>Accessories</span>
          <span>Gaming</span>
        </div>
        <div className="item">
          <h1>Links</h1>
          <span>FAQ</span>
          <span>Warranty</span>
          <span>Stores</span>
          <span>Returns</span>
        </div>
        <div className="item">
          <h1>About</h1>
          <span>CircuitCart is an online electronics shop for laptops, phones, gaming gear and everyday tech accessories.</span>
        </div>
        <div className="item">
          <h1>Contact</h1>
          <span>Need help choosing a device? Our support team can help compare specs, availability and warranty options.</span>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <span className='logo'>CircuitCart</span>
          <span className='copyright'>&copy; {new Date().getFullYear()} CircuitCart. All rights reserved.</span>
        </div>
        <div className="right">
          <img src="/payment.webp" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Footer
