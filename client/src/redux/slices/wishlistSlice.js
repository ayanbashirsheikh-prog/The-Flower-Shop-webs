import { createSlice } from "@reduxjs/toolkit";

/* =========================================================
   LOAD SAVED WISHLIST
========================================================= */

const getSavedWishlist = () => {
  try {
    const saved = localStorage.getItem(
      "flower-shop-wishlist"
    );

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Wishlist load error:",
      error
    );

    return [];
  }
};

/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

const normalizeProduct = (product) => {
  if (!product) return null;

  const id =
    product.id ||
    product._id ||
    "";

  if (!id) return null;

  return {
    ...product,
    id: String(id),
  };
};

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  items: getSavedWishlist(),
};

/* =========================================================
   SLICE
========================================================= */

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {

    /* =====================================================
       ADD
    ===================================================== */

    addToWishlist: (state, action) => {
      const product = normalizeProduct(
        action.payload
      );

      if (!product) return;

      const exists = state.items.some(
        (item) =>
          String(item.id) === String(product.id)
      );

      if (!exists) {
        state.items.push(product);
      }
    },

    /* =====================================================
       REMOVE
    ===================================================== */

    removeFromWishlist: (state, action) => {
      const id = String(action.payload);

      state.items = state.items.filter(
        (item) =>
          String(item.id) !== id
      );
    },

    /* =====================================================
       TOGGLE
    ===================================================== */

    toggleWishlist: (state, action) => {
      const product = normalizeProduct(
        action.payload
      );

      if (!product) return;

      const index = state.items.findIndex(
        (item) =>
          String(item.id) ===
          String(product.id)
      );

      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
    },

    /* =====================================================
       CLEAR
    ===================================================== */

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectWishlistItems = (state) =>
  state.wishlist?.items || [];

export const selectWishlistCount = (state) =>
  state.wishlist?.items?.length || 0;

export const selectIsInWishlist = (
  state,
  productId
) =>
  state.wishlist?.items?.some(
    (item) =>
      String(item.id) ===
      String(productId)
  ) || false;

export default wishlistSlice.reducer;