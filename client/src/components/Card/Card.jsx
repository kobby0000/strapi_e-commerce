import React from 'react';
import "./Card.scss";
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../config/env';

const getImageUrl = (imgObj) => {
  if (!imgObj) return null;
  if (typeof imgObj === "string") return resolveAssetUrl(imgObj);
  if (!imgObj.url) return null;
  if (imgObj.url.startsWith('http')) return imgObj.url;
  return resolveAssetUrl(imgObj.url);
};

const Card = ({ item }) => {
  const mainImg = getImageUrl(item.img);
  const secondImg = getImageUrl(item.img2);
  const id = item.id || item._id;

  return (
    <div className='card'>
      <Link className="link" to={`/product/${id}`}>
        <div className="image">
          {(item.isNewProduct || item.type) && <span>{item.type}</span>}
          {mainImg && (
            <img
              src={mainImg}
              alt={item.title}
              className='main_image'
            />
          )}
          {secondImg && (
            <img
              src={secondImg}
              alt={item.title + " second"}
              className='second_image'
            />
          )}
        </div>
        <h2>{item.title}</h2>
        <div className="prices">
          {item.oldPrice && <h3>${item.oldPrice}</h3>}
          <h3>${item.price}</h3>
        </div>
      </Link>
    </div>
  );
};

export default Card;
