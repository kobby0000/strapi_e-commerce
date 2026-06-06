import React from 'react';
import "./List.scss";
import Card from '../Card/Card';
import useFetch from '../../hooks/hookFetch';


// ...existing code...
const List = ({ subCats, maxPrice, sort, category }) => {
  let query = `/products?category=${category}`;
  if (subCats && subCats.length > 0) {
    query += `&subCategory=${subCats.join(",")}`;
  }
  if (maxPrice) {
    query += `&maxPrice=${maxPrice}`;
  }
  if (sort) {
    query += `&sort=${sort}`;
  }

  const { data, loading, error } = useFetch(query);

  return (
    <div className='list'>
      {error ? "Could not load products."
      : loading ? "Loading"
      : Array.isArray(data?.data) ? (
          data.data.map(item => (
            <Card item={item} key={item.id}/>
          ))
        ) : (
          "No products found."
        )
      }
    </div>
  );
}
// ...existing code...

export default List
