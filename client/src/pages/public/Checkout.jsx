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
} from "@/redux/slices/cartSlice";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =====================================================
  // REDUX CART
  // =====================================================

  const cartItems = useSelector(
    (state) => state.cart.items
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

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  const [orderPlaced, setOrderPlaced] =
    useState(false);

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
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // =====================================================
  // FORMAT KG
  // =====================================================

  const formatKg = (kg) => {
    const value = Number(kg || 0);

    if (value === 0.25) return "250 g";
    if (value === 0.5) return "500 g";
    if (value === 0.75) return "750 g";
    if (value === 1) return "1 kg";

    return `${value} kg`;
  };

  // =====================================================
  // ITEM PRICE
  // =====================================================

  const getItemPrice = (item) => {
    const pricePerKg = Number(
      item.pricePerKg ?? item.price ?? 0
    );

    const quantityKg = Number(
      item.quantity ?? item.quantityKg ?? 0
    );

    return pricePerKg * quantityKg;
  };

  // =====================================================
  // TOTAL PRICE
  // =====================================================

  const totalPrice = cartItems.reduce(
    (total, item) => {
      return total + getItemPrice(item);
    },
    0
  );

  // =====================================================
  // TOTAL KG
  // =====================================================

  const totalKg = cartItems.reduce(
    (total, item) => {
      return (
        total +
        Number(
          item.quantity ??
            item.quantityKg ??
            0
        )
      );
    },
    0
  );

  // =====================================================
  // DELIVERY
  // =====================================================

  const deliveryCharge =
    totalPrice >= 999 ? 0 : 79;

  const grandTotal =
    totalPrice + deliveryCharge;

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
        "Please enter your delivery address."
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

    return true;
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsPlacingOrder(true);

      const orderData = {
        customer: formData,

        paymentMethod,

        items: cartItems.map((item) => ({
          productId: item.id,

          name: item.name,

          image: item.image,

          quantityKg: Number(
            item.quantity ??
              item.quantityKg ??
              0
          ),

          pricePerKg: Number(
            item.pricePerKg ??
              item.price ??
              0
          ),

          totalPrice: getItemPrice(item),
        })),

        totalKg,

        subtotal: totalPrice,

        deliveryCharge,

        grandTotal,
      };

      console.log(
        "ORDER DATA:",
        orderData
      );

      // Temporary API simulation
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      setOrderPlaced(true);
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        "Unable to place order. Please try again."
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
      <section className="min-h-screen bg-[#faf9f7] px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-[35px] bg-white p-10 text-center shadow-xl">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-50">
            <ShoppingBag
              size={42}
              className="text-pink-600"
            />
          </div>

          <h1 className="mt-7 text-4xl font-bold text-gray-950">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some beautiful flowers before
            proceeding to checkout.
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
      <section className="min-h-screen bg-[#faf9f7] px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-[35px] bg-white p-10 text-center shadow-xl">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <Check
              size={48}
              className="text-green-600"
            />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.3em] text-pink-600">
            Order Confirmed
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-950">
            Thank you for your order 🌸
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-gray-500">
            Your flower order has been received.
            We will contact you shortly regarding
            delivery.
          </p>

          <div className="mt-8 rounded-3xl bg-pink-50 p-6 text-left">

            <div className="flex items-center justify-between">
              <span className="text-gray-500">
                Total flowers
              </span>

              <span className="font-bold">
                {formatKg(totalKg)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-gray-500">
                Amount
              </span>

              <span className="text-xl font-bold text-pink-600">
                ₹{formatPrice(grandTotal)}
              </span>
            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-8 rounded-2xl bg-gray-950 px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </button>

        </div>
      </section>
    );
  }

  // =====================================================
  // CHECKOUT
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
              Complete your details and place your
              flower order.
            </p>

          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_430px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-7">

            {/* DELIVERY */}

            <div className="rounded-[30px] bg-white p-6 shadow-lg sm:p-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <MapPin size={22} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-950">
                    Delivery Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Where should we deliver your
                    flowers?
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
                    placeholder="10-digit mobile number"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-pink-400 focus:bg-white"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
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
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 outline-none transition focus:border-pink-400 focus:bg-white"
                  />

                </div>

              </div>

            </div>

            {/* PAYMENT */}

            <div className="rounded-[30px] bg-white p-6 shadow-lg sm:p-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
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
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
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
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
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

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-600">
                    Your Order
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-950">
                    Order Summary
                  </h2>

                </div>

                <div className="rounded-full bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-600">
                  {cartItems.length} item
                  {cartItems.length !== 1
                    ? "s"
                    : ""}
                </div>

              </div>

              {/* CART ITEMS */}

              <div className="mt-7 space-y-5">

                {cartItems.map((item) => {

                  const quantity = Number(
                    item.quantity ??
                      item.quantityKg ??
                      0.25
                  );

                  const pricePerKg = Number(
                    item.pricePerKg ??
                      item.price ??
                      0
                  );

                  const itemTotal =
                    pricePerKg * quantity;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-100 p-4"
                    >

                      <div className="flex gap-4">

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">

                          <img
                            src={
                              item.image ||
                              "/placeholder-flower.jpg"
                            }
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />

                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="truncate font-semibold text-gray-900">
                            {item.name}
                          </h3>

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

                          <div className="mt-3 flex items-center justify-between">

                            <div className="flex items-center overflow-hidden rounded-full border border-gray-200">

                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    decreaseQuantity(
                                      item.id
                                    )
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50"
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
                                      item.id
                                    )
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50"
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

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                removeFromCart(
                                  item.id
                                )
                              )
                            }
                            className="mt-3 text-xs font-medium text-red-500 hover:text-red-600"
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
                      totalPrice
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
                    Free delivery on orders above
                    ₹999.
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

              <form onSubmit={handlePlaceOrder}>

                <button
                  type="submit"
                  disabled={isPlacingOrder}
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
                🔒 Your information is securely
                handled.
              </p>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}