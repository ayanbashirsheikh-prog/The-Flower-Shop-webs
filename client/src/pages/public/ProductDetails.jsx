import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

import toast from "react-hot-toast";

import productsData from "@/data/productsData";
import { addToCart } from "@/redux/slices/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* =====================================================
     FIND PRODUCT
  ===================================================== */

  const product = productsData.find(
    (item) => String(item.id) === String(id)
  );

  /* =====================================================
     STATES
  ===================================================== */

  // Quantity is stored in KG.
  //
  // 0.25 = 250g
  // 0.5  = 500g
  // 1    = 1kg

  const [quantityKg, setQuantityKg] = useState(1);

  const [isFavorite, setIsFavorite] = useState(false);

  /* =====================================================
     PRODUCT VALUES
  ===================================================== */

  const unit = product?.unit || "kg";

  const pricePerKg = Number(
    product?.pricePerKg ??
      product?.price ??
      0
  );

  /*
    Backend product schema uses stockKg.

    Frontend dummy data may not have stockKg,
    therefore we keep a safe fallback.
  */

  const stockKg =
    product?.stockKg !== undefined
      ? Number(product.stockKg)
      : 20;

  /*
    Minimum order.

    If backend has minOrderKg use it.
    Otherwise minimum is 250g.
  */

  const minOrderKg =
    product?.minOrderKg !== undefined
      ? Number(product.minOrderKg)
      : 0.25;

  /*
    Maximum order.

    If backend has maxOrderKg use it.
    Otherwise use stock.
  */

  const maxOrderKg =
    product?.maxOrderKg !== undefined
      ? Math.min(
          Number(product.maxOrderKg),
          stockKg
        )
      : stockKg;

  /*
    Quantity step.

    We intentionally use 250g as the frontend
    selling step.

    0.25 KG = 250 grams
  */

  const quantityStepKg = 0.25;

  /* =====================================================
     AVAILABLE WEIGHT OPTIONS
  ===================================================== */

  const weightOptions = [
    {
      label: "250 g",
      value: 0.25,
    },
    {
      label: "500 g",
      value: 0.5,
    },
    {
      label: "1 KG",
      value: 1,
    },
  ];

  /* =====================================================
     SAFE INITIAL QUANTITY
  ===================================================== */

  /*
    If product doesn't have enough stock for 1 KG,
    automatically use the highest available option.
  */

  const safeQuantityKg = Math.min(
    Math.max(quantityKg, minOrderKg),
    maxOrderKg
  );

  /* =====================================================
     TOTAL PRICE
  ===================================================== */

  const totalPrice = useMemo(() => {
    return pricePerKg * safeQuantityKg;
  }, [pricePerKg, safeQuantityKg]);

  /* =====================================================
     FORMAT WEIGHT
  ===================================================== */

  const formatWeight = (kg) => {
    if (kg < 1) {
      return `${Math.round(kg * 1000)} g`;
    }

    if (Number.isInteger(kg)) {
      return `${kg} KG`;
    }

    return `${kg.toFixed(2)} KG`;
  };

  /* =====================================================
     FORMAT PRICE
  ===================================================== */

  const formatPrice = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    )}`;
  };

  /* =====================================================
     PRICE FOR WEIGHT
  ===================================================== */

  const getPriceForWeight = (kg) => {
    return pricePerKg * kg;
  };

  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */

  if (!product) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#faf8f7] px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-100 text-5xl">
            🌸
          </div>

          <h1 className="mt-6 text-4xl font-semibold text-gray-950">
            Product not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-gray-500">
            We couldn't find the flower you're
            looking for.
          </p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-950 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-pink-600"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </button>
        </motion.div>
      </section>
    );
  }

  /* =====================================================
     QUANTITY CONTROLS
  ===================================================== */

  const increase = () => {
    setQuantityKg((prev) => {
      const next =
        Number((prev + quantityStepKg).toFixed(2));

      if (next > maxOrderKg) {
        toast.error(
          `Maximum available quantity is ${formatWeight(
            maxOrderKg
          )}`
        );

        return prev;
      }

      return next;
    });
  };

  const decrease = () => {
    setQuantityKg((prev) => {
      const next =
        Number((prev - quantityStepKg).toFixed(2));

      if (next < minOrderKg) {
        return prev;
      }

      return next;
    });
  };

  /* =====================================================
     SELECT WEIGHT
  ===================================================== */

  const selectWeight = (weight) => {
    if (weight < minOrderKg) {
      toast.error(
        `Minimum order is ${formatWeight(
          minOrderKg
        )}`
      );

      return;
    }

    if (weight > maxOrderKg) {
      toast.error(
        `Only ${formatWeight(
          maxOrderKg
        )} is available`
      );

      return;
    }

    setQuantityKg(weight);
  };

  /* =====================================================
     CREATE CART ITEM
  ===================================================== */

  const createCartItem = () => {
    return {
      ...product,

      /*
        Product ID
      */

      id: product.id,

      /*
        IMPORTANT

        quantity is now the actual KG value.

        250g = 0.25
        500g = 0.5
        1kg = 1
      */

      quantity: safeQuantityKg,

      /*
        Explicit KG field.
        Useful for cart/checkout.
      */

      quantityKg: safeQuantityKg,

      /*
        Human-readable selected weight.
      */

      selectedWeight: formatWeight(
        safeQuantityKg
      ),

      /*
        Price per KG.
      */

      price: pricePerKg,

      pricePerKg,

      /*
        Total price for selected weight.
      */

      totalPrice,

      /*
        Useful for cart UI.
      */

      unit: "kg",
    };
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addProductToCart = () => {
    const cartItem = createCartItem();

    dispatch(addToCart(cartItem));

    toast.success(
      `${product.name} • ${formatWeight(
        safeQuantityKg
      )} added to cart 🌸`
    );
  };

  /* =====================================================
     BUY NOW
  ===================================================== */

  const buyNow = () => {
    const cartItem = createCartItem();

    dispatch(addToCart(cartItem));

    navigate("/checkout");
  };

  /* =====================================================
     IS OUT OF STOCK
  ===================================================== */

  const isOutOfStock =
    stockKg <= 0 ||
    maxOrderKg < minOrderKg;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="min-h-screen bg-[#faf8f7] py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            BACK
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate("/shop")}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950"
        >
          <ArrowLeft size={17} />
          Back to flowers
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">

          {/* =================================================
              LEFT - IMAGE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <div className="relative overflow-hidden rounded-[36px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.08)]">

              <img
                src={product.image}
                alt={product.name}
                className="h-[500px] w-full object-cover transition duration-700 hover:scale-[1.03] sm:h-[650px]"
              />

              {/* IMAGE OVERLAY */}

              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent" />

              {/* BADGE */}

              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-800 shadow-lg backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-green-500" />

                Fresh Flowers
              </div>

              {/* FAVORITE */}

              <button
                type="button"
                onClick={() =>
                  setIsFavorite(
                    (prev) => !prev
                  )
                }
                className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/90 shadow-lg backdrop-blur transition hover:scale-105"
              >
                <Heart
                  size={21}
                  className={
                    isFavorite
                      ? "fill-pink-600 text-pink-600"
                      : "text-gray-700"
                  }
                />
              </button>

              {/* BOTTOM INFO */}

              <div className="absolute bottom-5 left-5 right-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur">
                  <Truck size={14} />

                  {product.sameDayDelivery !==
                  false
                    ? "Same-day delivery available"
                    : "Fast delivery available"}
                </div>
              </div>
            </div>

            {/* THUMBNAILS */}

            <div className="mt-4 flex gap-3">
              {[1, 2, 3].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className={`overflow-hidden rounded-2xl bg-white ${
                      item === 1
                        ? "ring-2 ring-pink-500 ring-offset-2"
                        : ""
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={`${product.name} preview ${item}`}
                      className="h-20 w-20 object-cover transition duration-300 hover:scale-110 sm:h-24 sm:w-24"
                    />
                  </button>
                )
              )}
            </div>
          </motion.div>

          {/* =================================================
              RIGHT - DETAILS
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="rounded-[36px] border border-gray-100 bg-white p-6 shadow-[0_25px_80px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10"
          >

            {/* CATEGORY */}

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-600">
              {product.category ||
                "Fresh Collection"}
            </p>

            {/* TITLE */}

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-gray-950 sm:text-5xl">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={17}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  )
                )}
              </div>

              <span className="text-sm font-semibold text-gray-800">
                {product.rating || "4.8"}
              </span>

              <span className="text-sm text-gray-400">
                {product.numReviews ||
                  324}{" "}
                verified reviews
              </span>
            </div>

            {/* =================================================
                PRICE
            ================================================= */}

            <div className="mt-7 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-gray-950">
                {formatPrice(pricePerKg)}
              </span>

              <span className="mb-1 text-sm font-medium text-gray-500">
                / kg
              </span>
            </div>

            {/* STOCK */}

            <div
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isOutOfStock
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700"
              }`}
            >
              <Check size={14} />

              {isOutOfStock
                ? "Out of stock"
                : "Fresh stock available"}
            </div>

            {/* DESCRIPTION */}

            <div className="mt-7 border-t border-gray-100 pt-7">
              <p className="text-[15px] leading-7 text-gray-600">
                {product.description ||
                  "Beautifully selected fresh flowers, carefully arranged and prepared for a memorable delivery."}
              </p>
            </div>

            {/* =================================================
                WEIGHT SELECTION
            ================================================= */}

            <div className="mt-8">

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Select Weight
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Choose how much you want to order
                  </p>
                </div>

                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                  {formatPrice(
                    pricePerKg
                  )}{" "}
                  / kg
                </span>
              </div>

              {/* =================================================
                  WEIGHT BUTTONS
              ================================================= */}

              <div className="grid grid-cols-3 gap-3">

                {weightOptions.map(
                  (option) => {
                    const disabled =
                      option.value <
                        minOrderKg ||
                      option.value >
                        maxOrderKg;

                    const selected =
                      Math.abs(
                        safeQuantityKg -
                          option.value
                      ) <
                      0.001;

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        disabled={
                          disabled ||
                          isOutOfStock
                        }
                        onClick={() =>
                          selectWeight(
                            option.value
                          )
                        }
                        className={`relative rounded-2xl border-2 px-3 py-4 text-center transition ${
                          selected
                            ? "border-pink-600 bg-pink-50 shadow-md shadow-pink-500/10"
                            : "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50/50"
                        } ${
                          disabled
                            ? "cursor-not-allowed opacity-40"
                            : ""
                        }`}
                      >
                        {/* CHECK */}

                        {selected && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-white">
                            <Check size={12} />
                          </span>
                        )}

                        <span
                          className={`block text-sm font-bold ${
                            selected
                              ? "text-pink-600"
                              : "text-gray-900"
                          }`}
                        >
                          {option.label}
                        </span>

                        <span className="mt-1 block text-xs font-medium text-gray-500">
                          {formatPrice(
                            getPriceForWeight(
                              option.value
                            )
                          )}
                        </span>
                      </button>
                    );
                  }
                )}

              </div>

              {/* =================================================
                  QUANTITY CONTROL
              ================================================= */}

              <div className="mt-5">

                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Quantity
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Increase or decrease by 250g
                    </p>
                  </div>

                  <span className="text-xs font-medium text-gray-400">
                    Step: 250 g
                  </span>
                </div>

                <div className="flex w-fit items-center rounded-full border border-gray-200 bg-gray-50 p-1">

                  {/* MINUS */}

                  <button
                    type="button"
                    onClick={decrease}
                    disabled={
                      safeQuantityKg <=
                        minOrderKg ||
                      isOutOfStock
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={17} />
                  </button>

                  {/* CURRENT WEIGHT */}

                  <div className="flex min-w-[130px] items-center justify-center px-3">
                    <span className="text-xl font-bold text-gray-950">
                      {formatWeight(
                        safeQuantityKg
                      )}
                    </span>
                  </div>

                  {/* PLUS */}

                  <button
                    type="button"
                    onClick={increase}
                    disabled={
                      safeQuantityKg >=
                        maxOrderKg ||
                      isOutOfStock
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={17} />
                  </button>

                </div>
              </div>

              {/* =================================================
                  ORDER SUMMARY
              ================================================= */}

              <div className="mt-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 px-5 py-4">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Your selection
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {formatWeight(
                        safeQuantityKg
                      )}
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="text-xs text-gray-400">
                      Total
                    </p>

                    <p className="text-xl font-bold text-pink-600">
                      {formatPrice(
                        totalPrice
                      )}
                    </p>

                  </div>

                </div>

                {/* PRICE BREAKDOWN */}

                <div className="mt-3 border-t border-pink-100 pt-3 text-xs text-gray-500">
                  {formatWeight(
                    safeQuantityKg
                  )}{" "}
                  ×{" "}
                  {formatPrice(
                    pricePerKg
                  )}{" "}
                  / kg
                </div>

              </div>

            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">

              {/* ADD TO CART */}

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={
                  addProductToCart
                }
                className="group flex items-center justify-center gap-2 rounded-2xl bg-gray-950 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <ShoppingBag
                  size={19}
                  className="transition group-hover:scale-110"
                />

                {isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              {/* BUY NOW */}

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={buyNow}
                className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 py-4 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none"
              >
                Buy Now

                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              {/* FAVORITE */}

              <button
                type="button"
                onClick={() =>
                  setIsFavorite(
                    (prev) => !prev
                  )
                }
                className="flex items-center justify-center rounded-2xl border border-gray-200 px-5 transition hover:border-pink-300 hover:bg-pink-50"
              >
                <Heart
                  size={21}
                  className={
                    isFavorite
                      ? "fill-pink-600 text-pink-600"
                      : "text-gray-700"
                  }
                />
              </button>

            </div>

            {/* =================================================
                DELIVERY CARD
            ================================================= */}

            <div className="mt-8 rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50 p-5">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Truck
                    size={21}
                    className="text-pink-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Fast & Fresh Delivery
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Carefully packed and delivered
                    fresh to your doorstep.
                  </p>

                  <button
                    type="button"
                    className="mt-2 text-xs font-bold text-pink-600"
                  >
                    Check delivery availability →
                  </button>
                </div>

              </div>

            </div>

            {/* =================================================
                TRUST
            ================================================= */}

            <div className="mt-5 grid grid-cols-3 gap-2">

              {/* FRESH */}

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                <Check
                  size={18}
                  className="mx-auto text-green-600"
                />

                <p className="mt-2 text-xs font-semibold text-gray-700">
                  Fresh
                </p>
              </div>

              {/* PREMIUM */}

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                <ShieldCheck
                  size={18}
                  className="mx-auto text-purple-600"
                />

                <p className="mt-2 text-xs font-semibold text-gray-700">
                  Premium
                </p>
              </div>

              {/* SECURE */}

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                <ShoppingBag
                  size={18}
                  className="mx-auto text-pink-600"
                />

                <p className="mt-2 text-xs font-semibold text-gray-700">
                  Secure
                </p>
              </div>

            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}