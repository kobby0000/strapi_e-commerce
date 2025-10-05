import React from 'react';
import "./Cartegories.scss";
import { Link } from 'react-router-dom';

const Cartegories = () => {
  return (
    <div className="cartegories">
      <div className="col col_l">
        <div className="row">
          <img src="/drug.webp" alt="" />
          <button>
            <Link to="/products/1">Personal Care</Link>
          </button>
        </div>
      </div>
      <div className="col col_m">
        <div className="top">
          <div className="row">
            <img src="/drug2.webp" alt="" />
            <button>
              <Link to="/products/2" >Sales</Link>
            </button>
          </div>
          <div className="row">
            <img src="/drug3.webp" alt="" />
            <button>
              <Link to="/products/3" >Medical Supplies</Link>
            </button>
          </div>
        </div>
        <div className="row">
          <img src="/drug.webp" alt="" />
          <button>
            <Link to="/products/4">Vitamins & Supplements</Link>
          </button>
        </div>
      </div>
      <div className="col">
       <div className="row">
        <img src="/drug3.webp" alt="" />
        <button>
          <Link to="/products/5" >Baby Care</Link>
        </button>
      </div>
      </div>
    </div>
  )
}

export default Cartegories