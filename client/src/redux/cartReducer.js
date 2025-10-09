import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:1337";

const initialState = {
  products: [],
  cartId: null, // track user's cart id from Strapi
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

// --- Async: Sync Cart with Strapi ---
export const syncCartWithBackend = () => async (dispatch, getState) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const { products, cartId } = getState().cart;
  const total = products.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const productIds = products.map((p) => p.id);
const data = { products: productIds, total };
  console.log("Syncing cart with data:", { products, total });

  try {
    let res;

    if (cartId) {
      // Update existing cart
      res = await axios.put(
        `${API_URL}/api/carts/${cartId}`,
        { data },
        getAuthHeaders()
      );
    } else {
      // Create new cart
      res = await axios.post(`${API_URL}/api/carts`, { data }, getAuthHeaders());
    }

    // Store the new cart ID if it was just created
    if (res.data?.data?.id) {
      dispatch(
        setCart({
          id: res.data.data.id,
          items: res.data.data.attributes?.items || products,
        })
      );
    }
  } catch (err) {
    console.error("Error syncing cart:", err);
  }
};

// --- Async: Fetch User Cart from Strapi ---
export const fetchUserCart = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axios.get(`${API_URL}/api/carts`, getAuthHeaders());
    const cart = res.data?.data?.[0]; // assuming 1 cart per user
    if (cart) {
      dispatch(
        setCart({
          id: cart.id,
          items: cart.attributes?.items || [],
        })
      );
    }
  } catch (err) {
    console.error("Error fetching cart:", err);
  }
};

export default cartSlice.reducer;
