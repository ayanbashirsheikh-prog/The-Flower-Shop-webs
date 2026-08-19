import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Smartphone,
  Truck,
  User,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  formatKg,
} from "@/redux/slices/cartSlice";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =====================================================
  // REDUX CART
  // =====================================================

  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );

  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // =====================================================
  // PRICE FORMAT
  // =====================================================

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =====================================================
  // GET PRODUCT ID
  // =====================================================

  const getProductId = (item) =>
    String(item?.id ?? item?._id ?? "");

  // =====================================================
  // GET QUANTITY
  // =====================================================

  const getQuantityKg = (item) =>
    Number(
      item?.quantity ??
        item?.quantityKg ??
        0
    );

  // =====================================================
  // GET PRICE PER KG
  // =====================================================

  const getPricePerKg = (item) =>
    Number(
      item?.pricePerKg ??
        item?.price ??
        0
    );

  // =====================================================
  // ITEM TOTAL
  // =====================================================

  const getItemPrice = (item) => {
    return (
      getPricePerKg(item) *
      getQuantityKg(item)
    );
  };

  // =====================================================
  // TOTAL KG
  // =====================================================

  const totalKg = cartItems.reduce(
    (total, item) => {
      return (
        total +
        getQuantityKg(item)
      );
    },
    0
  );

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal = cartItems.reduce(
    (total, item) => {
      return (
        total +
        getItemPrice(item)
      );
    },
    0
  );

  // =====================================================
  // WHOLESALE CHECK
  // =====================================================

  const hasWholesaleProduct =
    cartItems.some(
      (item) =>
        item?.wholesale === true ||
        item?.category === "Wholesale"
    );

  // =====================================================
  // DELIVERY
  // =====================================================

  const deliveryCharge =
    subtotal >= 999 ? 0 : 79;

  // =====================================================
  // GRAND TOTAL
  // =====================================================

  const grandTotal =
    subtotal + deliveryCharge;

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    const phone =
      formData.phone.replace(/\D/g, "");

    if (phone.length !== 10) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
      return false;
    }

    if (!formData.address.trim()) {
      alert(
        "Please enter your complete delivery address."
      );
      return false;
    }

    if (!formData.city.trim()) {
      alert("Please enter your city.");
      return false;
    }

    if (!formData.state.trim()) {
      alert("Please enter your state.");
      return false;
    }

    const pincode =
      formData.pincode.replace(/\D/g, "");

    if (pincode.length !== 6) {
      alert(
        "Please enter a valid 6-digit pincode."
      );
      return false;
    }

    if (
      hasWholesaleProduct &&
      totalKg < 5
    ) {
      alert(
        "Wholesale products require a minimum order of 5 kg."
      );
      return false;
    }

    return true;
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsPlacingOrder(true);

      const generatedOrderId =
        `TFS-${Date.now()
          .toString()
          .slice(-8)}`;

      const orderData = {
        orderId: generatedOrderId,

        customer: {
          fullName:
            formData.fullName.trim(),

          phone:
            formData.phone.replace(
              /\D/g,
              ""
            ),

          email:
            formData.email.trim(),

          address:
            formData.address.trim(),

          city:
            formData.city.trim(),

          state:
            formData.state.trim(),

          pincode:
            formData.pincode.replace(
              /\D/g,
              ""
            ),

          landmark:
            formData.landmark.trim(),
        },

        paymentMethod,

        orderType:
          hasWholesaleProduct
            ? "wholesale"
            : "retail",

        items: cartItems.map(
          (item) => ({
            productId:
              getProductId(item),

            name:
              item?.name || "",

            image:
              item?.image || "",

            quantityKg:
              getQuantityKg(item),

            pricePerKg:
              getPricePerKg(item),

            totalPrice:
              getItemPrice(item),

            category:
              item?.category || "",

            wholesale:
              Boolean(
                item?.wholesale
              ),
          })
        ),

        totalKg,

        subtotal,

        deliveryCharge,

        grandTotal,

        createdAt:
          new Date().toISOString(),
      };

      // =================================================
      // TEMPORARY
      // =================================================

      console.log(
        "THE FLOWER SHOP ORDER:",
        orderData
      );

      /*
       * BACKEND API YAHAN CONNECT HOGA
       *
       * Example:
       *
       * await fetch(
       *   "http://localhost:5000/api/orders",
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type":
       *         "application/json",
       *     },
       *     body: JSON.stringify(
       *       orderData
       *     ),
       *   }
       * );
       */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1000
          )
      );

      setOrderId(
        generatedOrderId
      );

      setOrderPlaced(true);

      // Clear Redux cart
      dispatch(clearCart());
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        "Unable to place your order. Please try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-[#faf9f7] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-[35px] bg-white p-8 text-center shadow-xl sm:p-10">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-50">
            <ShoppingBag
              size={42}
              className="text-pink-600"
            />
          </div>

          <h1 className="mt-7 text-3xl font-bold text-gray-950 sm:text-4xl">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some beautiful flowers
            before proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>

        </div>
      </section>
    );
  }

  // =====================================================
  // ORDER SUCCESS
  // =====================================================

  if (orderPlaced) {
    return (
      <section className="min-h-screen bg-[#faf9f7] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-[35px] bg-white p-8 text-center shadow-xl sm:p-10">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <Check
              size={48}
              className="text-green-600"
            />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.3em] text-pink-600">
            Order Confirmed
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
            Thank you for your order 🌸
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-gray-500">
            Your flower order has been
            received successfully.
            We will contact you shortly
            regarding delivery.
          </p>

          <div className="mt-7 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Order ID
            </p>

            <p className="mt-1 text-lg font-bold text-gray-950">
              {orderId}
            </p>
          </div>

          <div className="mt-5 rounded-3xl bg-pink-50 p-6 text-left">

            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                Total flowers
              </span>

              <span className="font-bold text-gray-950">
                {formatKg(totalKg)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-gray-500">
                Payment
              </span>

              <span className="font-semibold text-gray-900">
                {paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "UPI Payment"}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-pink-100 pt-4">

              <span className="font-semibold text-gray-700">
                Total Amount
              </span>

              <span className="text-xl font-bold text-pink-600">
                ₹{formatPrice(grandTotal)}
              </span>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/shop")
            }
            className="mt-8 rounded-2xl bg-gray-950 px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </button>

        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN CHECKOUT
  // =====================================================

  return (
    <section className="min-h-screen bg-[#faf9f7] px-4 py-8 sm:px-6 lg:py-12">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8">

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-pink-600"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>

          <div className="mt-5">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-600">
              The Flower Shop
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950 lg:text-5xl">
              Checkout
            </h1>

            <p className="mt-2 text-gray-500">
              Complete your details and
              place your flower order.
            </p>

          </div>
        </div>

        {/* WHOLESALE NOTICE */}

        {hasWholesaleProduct && (
          <div className="mb-8 rounded-3xl border border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 p-5">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="font-bold text-gray-950">
                  🌸 Wholesale Order
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Wholesale products require
                  a minimum order of 5 kg.
                </p>

              </div>

              <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-pink-600">
                {formatKg(totalKg)}
              </div>

            </div>

          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_430px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-7">

            {/* DELIVERY */}

            <div className="rounded-[30px] bg-white p-6 shadow-lg sm:p-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <MapPin size={22} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-950">
                    Delivery Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Where should we deliver
                    your flowers?
                  </p>

                </div>

              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                {/* NAME */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-11 pr-4 outline-none transition focus:border-pink-400 focus:bg-white"
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-pink-400 focus:bg-white"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                    <span className="ml-2 font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-pink-400 focus:bg-white"
                  />

                </div>

                {/* ADDRESS */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Complete Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    autoComplete="street-address"
                    placeholder="House / Flat No., Building, Street, Area"
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-pink-400 focus:bg-white"
                  />

                </div>

                {/* CITY */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    autoComplete="address-level2"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-pink-400 focus:bg-white"
                  />

                </div>

                {/* STATE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    autoComplete="address-level1"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-pink-400 focus:bg-white"
                  />

                </div>

                {/* PINCODE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="400001"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-pink-400 focus:bg-white"
                  />

                </div>

                {/* LANDMARK */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Landmark
                    <span className="ml-2 font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Near..."
                    autoComplete="off"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-pink-400 focus:bg-white"
                  />

                </div>

              </div>

            </div>

            {/* PAYMENT */}

            <div className="rounded-[30px] bg-white p-6 shadow-lg sm:p-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <CreditCard size={22} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-950">
                    Payment Method
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose how you'd like to pay.
                  </p>

                </div>

              </div>

              <div className="mt-7 space-y-3">

                {/* COD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                    paymentMethod === "cod"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      paymentMethod === "cod"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Truck size={20} />
                  </div>

                  <div className="flex-1">

                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pay when your flowers arrive.
                    </p>

                  </div>

                  {paymentMethod === "cod" && (
                    <Check
                      size={22}
                      className="text-pink-600"
                    />
                  )}

                </button>

                {/* UPI */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                  className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                    paymentMethod === "upi"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      paymentMethod === "upi"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Smartphone size={20} />
                  </div>

                  <div className="flex-1">

                    <p className="font-semibold text-gray-900">
                      UPI Payment
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Google Pay, PhonePe, Paytm
                      and other UPI apps.
                    </p>

                  </div>

                  {paymentMethod === "upi" && (
                    <Check
                      size={22}
                      className="text-pink-600"
                    />
                  )}

                </button>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT - ORDER SUMMARY
          ================================================= */}

          <aside className="h-fit lg:sticky lg:top-6">

            <div className="rounded-[30px] bg-white p-6 shadow-xl sm:p-7">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-600">
                    Your Order
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-950">
                    Order Summary
                  </h2>

                </div>

                <div className="shrink-0 rounded-full bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-600">
                  {cartItems.length} item
                  {cartItems.length !== 1
                    ? "s"
                    : ""}
                </div>

              </div>

              {/* CART ITEMS */}

              <div className="mt-7 space-y-5">

                {cartItems.map((item) => {

                  const quantity =
                    getQuantityKg(item);

                  const pricePerKg =
                    getPricePerKg(item);

                  const itemTotal =
                    getItemPrice(item);

                  const isWholesale =
                    item?.wholesale === true ||
                    item?.category ===
                      "Wholesale";

                  const productId =
                    getProductId(item);

                  return (
                    <div
                      key={productId}
                      className="rounded-2xl border border-gray-100 p-4"
                    >

                      <div className="flex gap-4">

                        {/* IMAGE */}

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">

                          <img
                            src={
                              item?.image ||
                              "/placeholder-flower.jpg"
                            }
                            alt={
                              item?.name ||
                              "Flower"
                            }
                            className="h-full w-full object-cover"
                          />

                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <h3 className="truncate font-semibold text-gray-900">
                              {item?.name}
                            </h3>

                            {isWholesale && (
                              <span className="shrink-0 rounded-full bg-pink-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-pink-600">
                                Wholesale
                              </span>
                            )}

                          </div>

                          <p className="mt-1 text-sm font-medium text-pink-600">
                            {formatKg(quantity)}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ₹
                            {formatPrice(
                              pricePerKg
                            )}{" "}
                            / kg
                          </p>

                          {/* QUANTITY */}

                          <div className="mt-3 flex items-center justify-between gap-3">

                            <div className="flex items-center overflow-hidden rounded-full border border-gray-200">

                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    decreaseQuantity(
                                      productId
                                    )
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>

                              <span className="min-w-[65px] text-center text-xs font-bold">
                                {formatKg(
                                  quantity
                                )}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    increaseQuantity(
                                      productId
                                    )
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>

                            </div>

                            <span className="font-bold text-gray-950">
                              ₹
                              {formatPrice(
                                itemTotal
                              )}
                            </span>

                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                removeFromCart(
                                  productId
                                )
                              )
                            }
                            className="mt-3 text-xs font-medium text-red-500 transition hover:text-red-600"
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* TOTAL QUANTITY */}

              <div className="mt-6 rounded-2xl bg-gray-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    Total flower quantity
                  </span>

                  <span className="font-bold text-gray-900">
                    {formatKg(totalKg)}
                  </span>

                </div>

              </div>

              {/* PRICE */}

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹
                    {formatPrice(
                      subtotal
                    )}
                  </span>

                </div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span
                    className={
                      deliveryCharge === 0
                        ? "font-semibold text-green-600"
                        : "font-semibold text-gray-900"
                    }
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${formatPrice(
                          deliveryCharge
                        )}`}
                  </span>

                </div>

                {deliveryCharge > 0 && (
                  <p className="text-xs text-gray-400">
                    Free delivery on orders
                    above ₹999.
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">

                  <span className="text-lg font-bold text-gray-950">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-pink-600">
                    ₹
                    {formatPrice(
                      grandTotal
                    )}
                  </span>

                </div>

              </div>

              {/* PLACE ORDER */}

              <form
                onSubmit={
                  handlePlaceOrder
                }
              >

                <button
                  type="submit"
                  disabled={
                    isPlacingOrder
                  }
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 py-4 font-semibold text-white shadow-xl transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isPlacingOrder ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={19} />

                      Place Order · ₹
                      {formatPrice(
                        grandTotal
                      )}
                    </>
                  )}

                </button>

              </form>

              <p className="mt-5 text-center text-xs text-gray-400">
                🔒 Your information is securely handled.
              </p>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}