import React from 'react';
import "./FeaturedProducts.scss";
import Card from '../Card/Card';
import useFetch from '../../hooks/hookFetch';




const FeaturedProducts = ({ type }) => {
    const { data, loading, error } = useFetch(`/products?type=${type}&limit=8`)


    return (
        <div className='featured_products' >
            <div className="top">
                <h1>{type} products</h1>
                <p>Hand-picked electronics with reliable specs, current pricing and fast availability.</p>
            </div>
            <div className="bottom">
                {error
                    ? "Something went wrong"
                    : loading
                        ? "Loading"
                        : (data?.data || []).map(item => (
                            <Card item={item} key={item.id} />
                        ))}
            </div>
        </div>
    )
}

export default FeaturedProducts
