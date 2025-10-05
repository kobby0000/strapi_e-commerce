import React from 'react';
import "./Contact.scss";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareInstagram, FaSquarePinterest, FaSquareXTwitter, FaSquareGooglePlus } from "react-icons/fa6";




const Contact = () => {
  return (
    <div className='contact'>
        <div className="wrapper">
            <span> LET'S GET IN TOUCH</span>
            <div className="mail">
                <input type="text" placeholder='Enter Your Email' />
                <button>JOIN US</button>
            </div>
            <div className="icons">
                <a href="http://" target="_blank" rel="noopener noreferrer"><FaFacebookSquare /></a>
                <a href="http://" target="_blank" rel="noopener noreferrer"> < FaSquareInstagram /></a>
                <a href="http://" target="_blank" rel="noopener noreferrer"><FaSquareXTwitter/></a>
                <a href="http://" target="_blank" rel="noopener noreferrer"><FaSquareGooglePlus/></a>
                <a href="http://" target="_blank" rel="noopener noreferrer">< FaSquarePinterest /></a>   
            </div>
        </div>
    </div>
  )
}

export default Contact