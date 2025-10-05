import React from 'react';
import "./Card.scss";
import { Link } from 'react-router-dom';

// Helper to get image URL from flat object
const getImageUrl = (imgObj) => {
  if (!imgObj || !imgObj.url) return null;
  // If the URL is already absolute, don't prepend the upload URL
  if (imgObj.url.startsWith('http')) return imgObj.url;
  return import.meta.env.VITE_APP_UPLOAD_URL + imgObj.url;
};

const Card = ({ item }) => {
  // Your API returns a flat object, so just use item directly
  const mainImg = getImageUrl(item.img);
  const secondImg = getImageUrl(item.img2);

  return (
    <div className='card'>
      <Link className="link" to={`/product/${item.id}`}>
        <div className="image">
          {item.isNew && <span>{item.type}</span>}
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
          <h3>${item.oldPrice || (item.price + 20).toFixed(2)}</h3>
          <h3>${item.price}</h3>
        </div>
      </Link>
    </div>
  );
};

export default Card;