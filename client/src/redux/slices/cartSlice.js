import { createSlice } from "@reduxjs/toolkit";

/* =========================================================
   CONSTANTS
========================================================= */

const CART_STORAGE_KEY = "flower-shop-cart";

const DEFAULT_MIN_QUANTITY_KG = 0.25;
const DEFAULT_STEP_KG = 0.25;
const DEFAULT_MAX_QUANTITY_KG = 20;

/* =========================================================
   LOCAL STORAGE
========================================================= */

const getInitialCart = () => {
  try {
    const savedCart =
      localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    return Array.isArray(parsedCart)
      ? parsedCart
      : [];
  } catch (error) {
    console.error(
      "Unable to load cart:",
      error
    );

    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items)
    );
  } catch (error) {
    console.error(
      "Unable to save cart:",
      error
    );
  }
};

/* =========================================================
   HELPERS
========================================================= */

const getProductId = (item) => {
  return String(
    item?.id ??
      item?._id ??
      ""
  );
};

const roundQuantity = (value) => {
  return (
    Math.round(
      Number(value || 0) * 100
    ) / 100
  );
};

const getPricePerKg = (item) => {
  return Number(
    item?.pricePerKg ??
      item?.price ??
      0
  );
};

const getQuantityKg = (item) => {
  return Number(
    item?.quantity ??
      item?.quantityKg ??
      DEFAULT_MIN_QUANTITY_KG
  );
};

/* =========================================================
   FORMAT WEIGHT
========================================================= */

export const formatKg = (quantity) => {
  const value = roundQuantity(quantity);

  if (value === 0.25) return "250 g";
  if (value === 0.5) return "500 g";
  if (value === 0.75) return "750 g";
  if (value === 1) return "1 kg";

  if (value < 1) {
    return `${Math.round(
      value * 1000
    )} g`;
  }

  return `${value} kg`;
};

/* =========================================================
   CART SLICE
========================================================= */

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: getInitialCart(),
  },

  reducers: {

    /* =====================================================
       ADD TO CART
    ===================================================== */

    addToCart: (state, action) => {
      const product = action.payload;

      if (!product) {
        return;
      }

      const productId =
        getProductId(product);

      if (!productId) {
        console.error(
          "Cart error: Product ID missing",
          product
        );

        return;
      }

      /*
        IMPORTANT:

        ProductCard sends the minimum quantity.

        Normal:
        0.25kg

        Wholesale:
        5kg
      */

      const minQuantity = Number(
        product?.minOrderKg ??
          DEFAULT_MIN_QUANTITY_KG
      );

      const requestedQuantity =
        Number(
          product?.quantity ??
            product?.quantityKg ??
            minQuantity
        );

      const quantityToAdd =
        Math.max(
          requestedQuantity,
          minQuantity
        );

      const pricePerKg =
        getPricePerKg(product);

      const step = Number(
        product?.quantityStepKg ??
          DEFAULT_STEP_KG
      );

      const maxQuantity = Number(
        product?.maxOrderKg ??
          DEFAULT_MAX_QUANTITY_KG
      );

      const existingItem =
        state.items.find(
          (item) =>
            getProductId(item) ===
            productId
        );

      /* ===================================================
         EXISTING PRODUCT
      =================================================== */

      if (existingItem) {

        const currentQuantity =
          getQuantityKg(
            existingItem
          );

        const itemMax =
          Number(
            existingItem.maxOrderKg ??
              maxQuantity
          );

        const newQuantity =
          Math.min(
            roundQuantity(
              currentQuantity +
                quantityToAdd
            ),
            itemMax
          );

        existingItem.quantity =
          newQuantity;

        existingItem.quantityKg =
          newQuantity;

        existingItem.pricePerKg =
          getPricePerKg(
            existingItem
          );

        existingItem.quantityStepKg =
          Number(
            existingItem.quantityStepKg ??
              step
          );

        existingItem.minOrderKg =
          Number(
            existingItem.minOrderKg ??
              minQuantity
          );

        existingItem.maxOrderKg =
          itemMax;

        existingItem.unit =
          "kg";
      }

      /* ===================================================
         NEW PRODUCT
      =================================================== */

      else {

        const safeQuantity =
          Math.min(
            roundQuantity(
              quantityToAdd
            ),
            maxQuantity
          );

        state.items.push({
          ...product,

          id: product.id ??
            product._id,

          quantity:
            safeQuantity,

          quantityKg:
            safeQuantity,

          pricePerKg,

          unit: "kg",

          quantityStepKg:
            step,

          minOrderKg:
            minQuantity,

          maxOrderKg:
            maxQuantity,
        });
      }

      saveCart(state.items);
    },

    /* =====================================================
       INCREASE
       +250g
    ===================================================== */

    increaseQuantity: (
      state,
      action
    ) => {

      const productId =
        String(action.payload);

      const item =
        state.items.find(
          (cartItem) =>
            getProductId(
              cartItem
            ) === productId
        );

      if (!item) {
        return;
      }

      const step =
        Number(
          item.quantityStepKg ??
            DEFAULT_STEP_KG
        );

      const current =
        getQuantityKg(item);

      const max =
        Number(
          item.maxOrderKg ??
            DEFAULT_MAX_QUANTITY_KG
        );

      const next =
        roundQuantity(
          current + step
        );

      if (next > max) {
        return;
      }

      item.quantity =
        next;

      item.quantityKg =
        next;

      saveCart(state.items);
    },

    /* =====================================================
       DECREASE
       -250g
    ===================================================== */

    decreaseQuantity: (
      state,
      action
    ) => {

      const productId =
        String(action.payload);

      const item =
        state.items.find(
          (cartItem) =>
            getProductId(
              cartItem
            ) === productId
        );

      if (!item) {
        return;
      }

      const step =
        Number(
          item.quantityStepKg ??
            DEFAULT_STEP_KG
        );

      const current =
        getQuantityKg(item);

      const min =
        Number(
          item.minOrderKg ??
            DEFAULT_MIN_QUANTITY_KG
        );

      const next =
        roundQuantity(
          current - step
        );

      if (next < min) {
        return;
      }

      item.quantity =
        next;

      item.quantityKg =
        next;

      saveCart(state.items);
    },

    /* =====================================================
       SET EXACT QUANTITY
    ===================================================== */

    setQuantity: (
      state,
      action
    ) => {

      const {
        id,
        quantity,
      } = action.payload;

      const productId =
        String(id);

      const item =
        state.items.find(
          (cartItem) =>
            getProductId(
              cartItem
            ) === productId
        );

      if (!item) {
        return;
      }

      const min =
        Number(
          item.minOrderKg ??
            DEFAULT_MIN_QUANTITY_KG
        );

      const max =
        Number(
          item.maxOrderKg ??
            DEFAULT_MAX_QUANTITY_KG
        );

      const requested =
        Number(quantity);

      const safe =
        Math.min(
          Math.max(
            roundQuantity(
              requested || min
            ),
            min
          ),
          max
        );

      item.quantity =
        safe;

      item.quantityKg =
        safe;

      saveCart(state.items);
    },

    /* =====================================================
       REMOVE
    ===================================================== */

    removeFromCart: (
      state,
      action
    ) => {

      const productId =
        String(action.payload);

      state.items =
        state.items.filter(
          (item) =>
            getProductId(item) !==
            productId
        );

      saveCart(state.items);
    },

    /* =====================================================
       CLEAR
    ===================================================== */

    clearCart: (state) => {

      state.items = [];

      saveCart([]);
    },
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default cartSlice.reducer;