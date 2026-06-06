import React, { useState } from 'react';
import "./Products.scss"
import List from '../../components/List/List';
import { useParams } from 'react-router-dom';
import useFetch from "../../hooks/hookFetch";


const Products = () => {
  const category = useParams().id;
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState(null);
  const [selectSubCats, setSelectSubCats] = useState([]);

  const { data, loading, error } = useFetch(`/products/categories`)
  const currentCategory = data?.data?.find((item) => item.id === category);
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
          <h2>Product Categories</h2>
          {loading ? (
            <p>Loading filters...</p>
          ) : error ? (
            <p>Could not load filters.</p>
          ) : currentCategory?.subCategories?.length > 0 ? (
            currentCategory.subCategories.map((item) => (
              <div className="input_item" key={item}>
                <input type="checkbox" id={item} value={item} onChange={handleChange} />
                <label htmlFor={item}>{item}</label>
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
                max={2000}
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
            <input type="radio" id="asc" name='price' onChange={() => setSort("asc")} />
            <label htmlFor="asc">Price (Lowest first)</label>
          </div>
          <div className="input_item">
            <input type="radio" id="desc" name='price' onChange={() => setSort("desc")} />
            <label htmlFor="desc">Price (Highest first)</label>
          </div>
        </div>

      </div>
      <div className="right">
        <img className='cart_image' src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80" alt="Electronics display" />
        <List category={category} maxPrice={maxPrice} sort={sort} subCats={selectSubCats} />
      </div>
    </div>
  )
}

export default Products
