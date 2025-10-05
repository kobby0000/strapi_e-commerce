import React from 'react';
import "./List.scss";
import Card from '../Card/Card';
import useFetch from '../../hooks/hookFetch';


// ...existing code...
const List = ({ subCats, maxPrice, sort, catId }) => {
  let query = `/products?populate=*&[filters][categories][id]=${catId}`;
  if (subCats && subCats.length > 0) {
    query += `&[filters][sub_categories][id][$in]=${subCats.join(",")}`;
  }
  if (maxPrice) {
    query += `&[filters][price][$lte]=${maxPrice}`;
  }
  if (sort) {
    query += `&sort=price:${sort}`;
  }

  const { data, loading, error } = useFetch(query);

  return (
    <div className='list'>
      {loading ? "Loading"
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