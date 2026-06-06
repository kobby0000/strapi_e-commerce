import React from 'react';
import "./Cartegories.scss";
import { Link } from 'react-router-dom';

const Cartegories = () => {
  return (
    <div className="cartegories">
      <div className="col col_l">
        <div className="row">
          <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80" alt="" />
          <button>
            <Link to="/products/laptops">Laptops</Link>
          </button>
        </div>
      </div>
      <div className="col col_m">
        <div className="top">
          <div className="row">
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80" alt="" />
            <button>
              <Link to="/products/phones" >Phones</Link>
            </button>
          </div>
          <div className="row">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80" alt="" />
            <button>
              <Link to="/products/audio" >Audio</Link>
            </button>
          </div>
        </div>
        <div className="row">
          <img src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80" alt="" />
          <button>
            <Link to="/products/gaming">Gaming</Link>
          </button>
        </div>
      </div>
      <div className="col">
       <div className="row">
        <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80" alt="" />
        <button>
          <Link to="/products/accessories" >Accessories</Link>
        </button>
      </div>
      </div>
    </div>
  )
}

export default Cartegories
