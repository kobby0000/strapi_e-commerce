import React from 'react';
import "./FeaturedProducts.scss";
import Card from '../Card/Card';
import useFetch from '../../hooks/hookFetch';




const FeaturedProducts = ({ type }) => {
    const { data, loading, error } = useFetch(`/products?populate=*&[filters][type][$eq]=${type}`)
    console.log(data)


    return (
        <div className='featured_products' >
            <div className="top">
                <h1>{type} products</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae aliquam eum pariatur!</p>
            </div>
            <div className="bottom">
                {error
                    ? "Somthing went wrong"
                    : loading
                        ? "loading"
                        : (data?.data || []).map(item => (
                            <Card item={item} key={item.id} />
                        ))}
            </div>
        </div>
    )
}

export default FeaturedProducts