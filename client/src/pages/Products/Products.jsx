import React, { useState } from 'react';
import "./Products.scss"
import List from '../../components/List/List';
import { useParams } from 'react-router-dom';
import useFetch from "../../hooks/hookFetch";


const Products = () => {
  const catId = parseInt(useParams().id);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState(null);
  const [selectSubCats, setSelectSubCats] = useState([]);

  const { data, loading, error } = useFetch(`/sub-categories?filters[categories][id][$eq]=${catId}`)
  const handleChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    //select sub category when item is checked and removes when unchecked
    setSelectSubCats(
      isChecked
        ? [...selectSubCats, value]
        : selectSubCats.filter((item) => item !== value)
    );
  };
  // console.log(selectSubCats)




  return (
    <div className='products'>
      <div className="left">
        <div className="filter_item">
          <h2>Product Cartegories</h2>
          {Array.isArray(data?.data) && data.data.length > 0 ? (
            data.data.map((item) => (
              <div className="input_item" key={item.id}>
                <input type="checkbox" id={item.id} value={item.id} onChange={handleChange} />
                <label htmlFor={item.id}>{item.title}</label>
              </div>
            ))
          ) : (
            <p>No sub-categories found.</p>
          )}

        </div>
        <div className="filter_item">
          <h2>Filter by price</h2>
          <div className="input_item">
            <div className="input_item">
              <span>0</span>
              <input type="range"
                min={0}
                value={maxPrice}
                max={1000}
                onChange={(e) => setMaxPrice(e.target.value)} />
              <span>
                {maxPrice}
              </span>
            </div>
          </div>
        </div>
        <div className="filter_item">
          <h2>Sort by</h2>
          <div className="input_item">
            <input type="radio" id="des" name='price' onChange={e => setSort("asc")} />
            <label htmlFor="des">Price (Lowest first)</label>
          </div>
          <div className="input_item">
            <input type="radio" id="des" name='price' onChange={e => setSort("desc")} />
            <label htmlFor="des">Price (Highests first)</label>
          </div>
        </div>

      </div>
      <div className="right">
        <img className='cart_image' src="/drug2.webp" alt="" />
        <List catId={catId} maxPrice={maxPrice} sort={sort} subCats={selectSubCats} />
      </div>
    </div>
  )
}

export default Products