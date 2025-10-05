import React, { useState } from 'react';
import "./Slider.scss";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

const Data = [
  "/pharmasist.webp",
  "/pharmacy-shop.webp",
  "/drugs.webp",
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInstant, setIsInstant] = useState(false);

  const nextSlide = () => {
    if (currentSlide === Data.length - 1) {
      setIsInstant(true);
      setCurrentSlide(0);
      setTimeout(() => setIsInstant(false), 50);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      setIsInstant(true);
      setCurrentSlide(Data.length - 1);
      setTimeout(() => setIsInstant(false), 50);
    } else {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className='slider'>
      <div 
        className="container" 
        style={{
          transform: `translateX(-${currentSlide * 100}vw)`,
          transition: isInstant ? "none" : "transform 1s ease"
        }}
      >
        {Data.map((src, i) => (
          <img key={i} src={src} alt="" />
        ))}
      </div>

      <div className="icons">
        <div className="icon" onClick={prevSlide}><IoIosArrowRoundBack /></div>
        <div className="icon" onClick={nextSlide}><IoIosArrowRoundForward /></div>
      </div>
    </div>
  );
};

export default Slider;
