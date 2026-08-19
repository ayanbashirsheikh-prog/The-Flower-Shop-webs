import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "@/redux/slices/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const delivery = total >= 999 ? 0 : 99;
  const grandTotal = total + delivery;

  const handleCheckout = () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    navigate("/checkout");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-2xl bg-pink-100 p-3 text-pink-600">
              <ShoppingBag size={25} />
            </div>

            <span className="font-medium tracking-wide text-pink-600">
              THE FLOWER SHOP
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Your Shopping Bag
          </h1>

          <p className="mt-3 text-gray-500">
            Beautiful flowers, carefully chosen for someone special.
          </p>
        </motion.div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[35px] border border-white bg-white p-12 text-center shadow-xl"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-50">
              <ShoppingBag size={40} className="text-pink-500" />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Discover our beautiful collection of flowers and create
              something unforgettable.
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-gray-900 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-pink-600"
            >
              Explore Flowers
              <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_390px]">

            {/* Products */}
            <div className="space-y-5">

              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-[30px] border border-white bg-white p-4 shadow-lg transition hover:shadow-xl sm:p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                    {/* Image */}
                    <div className="relative h-52 w-full overflow-hidden rounded-[24px] sm:h-32 sm:w-32">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />

                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
                        Fresh
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                            Flower Collection
                          </p>

                          <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                            {item.name}
                          </h2>
                        </div>

                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item.id))
                          }
                          className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          title="Remove item"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>

                      <p className="mt-2 text-lg font-semibold text-pink-600">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>

                      {/* Quantity */}
                      <div className="mt-5 flex items-center justify-between">

                        <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-1">
                          <button
                            onClick={() =>
                              dispatch(decreaseQuantity(item.id))
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white hover:shadow"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-10 text-center font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              dispatch(increaseQuantity(item.id))
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white hover:shadow"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="font-bold text-gray-900">
                          ₹
                          {(
                            Number(item.price) * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Benefits */}
              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <Truck className="text-pink-500" size={22} />
                  <p className="mt-3 font-semibold">Fresh Delivery</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Carefully packed flowers
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <ShieldCheck className="text-pink-500" size={22} />
                  <p className="mt-3 font-semibold">Secure Checkout</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Safe & protected payments
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <Sparkles className="text-pink-500" size={22} />
                  <p className="mt-3 font-semibold">Premium Quality</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Handpicked flowers
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-fit rounded-[32px] bg-gray-900 p-7 text-white shadow-2xl lg:sticky lg:top-6"
            >
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-300">
                Order Summary
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Almost yours ✨
              </h2>

              <div className="my-7 space-y-4">

                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Delivery</span>
                  <span className="font-semibold text-white">
                    {delivery === 0
                      ? "FREE"
                      : `₹${delivery}`}
                  </span>
                </div>

                {delivery === 0 && (
                  <div className="rounded-2xl bg-green-500/10 p-3 text-sm text-green-300">
                    🎉 You unlocked free delivery!
                  </div>
                )}

                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-end justify-between">
                    <span className="text-gray-300">
                      Total
                    </span>

                    <span className="text-3xl font-bold">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 py-4 font-bold shadow-lg shadow-pink-500/20 transition hover:scale-[1.02]"
              >
                Proceed to Checkout

                <ArrowRight
                  size={19}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="mt-3 w-full rounded-full border border-white/10 py-4 font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                Continue Shopping
              </button>

              <p className="mt-5 text-center text-xs text-gray-500">
                Secure checkout • Fresh flowers • Premium packaging
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}