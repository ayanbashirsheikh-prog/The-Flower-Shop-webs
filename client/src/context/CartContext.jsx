import {
  createContext,
  useContext,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  addToCart as reduxAddToCart,
  increaseQuantity as reduxIncreaseQuantity,
  decreaseQuantity as reduxDecreaseQuantity,
  removeFromCart as reduxRemoveFromCart,
  clearCart as reduxClearCart,
  setQuantity as reduxSetQuantity,
  formatKg,
} from "@/redux/slices/cartSlice";

/* =========================================================
   CONTEXT
========================================================= */

const CartContext =
  createContext(null);

/* =========================================================
   PROVIDER
========================================================= */

export function CartProvider({
  children,
}) {
  const dispatch =
    useDispatch();

  /* =======================================================
     REDUX CART
  ======================================================= */

  const cartItems = useSelector(
    (state) =>
      state.cart?.items ?? []
  );

  /* =======================================================
     ADD
  ======================================================= */

  const addToCart = (
    product,
    selectedQuantity
  ) => {

    dispatch(
      reduxAddToCart({
        ...product,

        ...(selectedQuantity !==
        undefined
          ? {
              quantity:
                Number(
                  selectedQuantity
                ),
            }
          : {}),
      })
    );
  };

  /* =======================================================
     REMOVE
  ======================================================= */

  const removeFromCart = (
    id
  ) => {
    dispatch(
      reduxRemoveFromCart(id)
    );
  };

  /* =======================================================
     INCREASE
  ======================================================= */

  const increaseQuantity = (
    id
  ) => {
    dispatch(
      reduxIncreaseQuantity(id)
    );
  };

  /* =======================================================
     DECREASE
  ======================================================= */

  const decreaseQuantity = (
    id
  ) => {
    dispatch(
      reduxDecreaseQuantity(id)
    );
  };

  /* =======================================================
     SET QUANTITY
  ======================================================= */

  const setQuantity = (
    id,
    quantity
  ) => {
    dispatch(
      reduxSetQuantity({
        id,
        quantity,
      })
    );
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearCart = () => {
    dispatch(
      reduxClearCart()
    );
  };

  /* =======================================================
     TOTAL PRICE
  ======================================================= */

  const totalPrice =
    cartItems.reduce(
      (total, item) => {

        const pricePerKg =
          Number(
            item?.pricePerKg ??
              item?.price ??
              0
          );

        const quantityKg =
          Number(
            item?.quantity ??
              item?.quantityKg ??
              0
          );

        return (
          total +
          pricePerKg *
            quantityKg
        );
      },
      0
    );

  /* =======================================================
     TOTAL KG
  ======================================================= */

  const totalKg =
    cartItems.reduce(
      (total, item) => {

        const quantity =
          Number(
            item?.quantity ??
              item?.quantityKg ??
              0
          );

        return (
          total +
          quantity
        );
      },
      0
    );

  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount =
    cartItems.length;

  /* =======================================================
     TOTAL UNITS

     Example:

     2 products in cart
     = 2 cart items
  ======================================================= */

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <CartContext.Provider
      value={{
        cartItems,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        setQuantity,

        clearCart,

        totalPrice,

        totalKg,

        cartCount,

        formatKg,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}