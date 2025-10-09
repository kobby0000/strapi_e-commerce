import React, { useEffect } from "react";
import "./Cart.scss";
import { MdDeleteForever } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, resetCart, syncCartWithBackend } from "../../redux/cartReducer";

const Cart = () => {
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();

  useEffect(() => {
    if (products.length >= 0) {
      dispatch(syncCartWithBackend());
    }
  }, [products, dispatch]);

  const totalPrice = () => {
    let total = 0;
    products.forEach((item) => (total += item.quantity * item.price));
    return total.toFixed(2);
  };

  return (
    <div className="cart">
      <h1>Products in cart</h1>
      {products?.map((item) => (
        <div className="item" key={item.id}>
          <img src={item.img} alt={item.title} />
          <div className="details">
            <h1>{item.title}</h1>
            <p>{item.desc?.substring(0, 30)}</p>
            <div className="price">
              {item.quantity} x ${item.price}
            </div>
          </div>
          <MdDeleteForever
            className="delete"
            onClick={() => dispatch(removeItem({ id: item.id }))}
          />
        </div>
      ))}

      <div className="total">
        <span>SUBTOTAL</span>
        <span>${totalPrice()}</span>
      </div>
      <button>PROCEED TO CHECKOUT</button>
      <span className="reset" onClick={() => dispatch(resetCart())}>
        Reset Cart
      </span>
    </div>
  );
};

export default Cart;
