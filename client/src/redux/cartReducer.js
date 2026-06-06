import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../config/env";

const initialState = {
  products: [],
  cartId: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.products = action.payload.items || [];
      state.cartId = action.payload.id || null;
    },
    addToCart: (state, action) => {
      const item = state.products.find((p) => p.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.id !== action.payload.id
      );
    },
    resetCart: (state) => {
      state.products = [];
      state.cartId = null;
    },
  },
});

export const { addToCart, removeItem, resetCart, setCart } = cartSlice.actions;

// --- Helper function for authorization headers ---
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    : {};
};

export const syncCartWithBackend = () => async (dispatch, getState) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const { products } = getState().cart;
  const items = products.map((p) => ({ id: p.id, quantity: p.quantity }));

  try {
    const res = await axios.put(`${API_URL}/cart`, { items }, getAuthHeaders());
    dispatch(setCart({ id: res.data.data?.id, items: res.data.data?.items || products }));
  } catch (err) {
    console.error("Error syncing cart:", err);
  }
};

export const fetchUserCart = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axios.get(`${API_URL}/cart`, getAuthHeaders());
    dispatch(setCart({ id: res.data.data?.id, items: res.data.data?.items || [] }));
  } catch (err) {
    console.error("Error fetching cart:", err);
  }
};

export default cartSlice.reducer;
