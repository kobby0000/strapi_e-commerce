import React from 'react';
import "./Home.scss";
import Slider from '../../components/Slider/Slider'
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts';
import Cartegories from '../../components/Cartegorie/Cartegories';
import Contact from '../../components/Contact/Contact';

const Home = () => {
  return (
    <div  className='home'>
      <Slider />
      <FeaturedProducts type="featured"/>
      <Cartegories />
      <FeaturedProducts type="trending"/>
      <Contact />
    </div>
  )
}

export default Home