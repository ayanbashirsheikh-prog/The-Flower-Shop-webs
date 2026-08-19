import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Minus,
  Plus,
  Check,
} from "lucide-react";

import { useState } from "react";
import { useParams } from "react-router-dom";

import products from "@/data/productsData";
import { useCart } from "@/context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [selectedQuantity, setSelectedQuantity] =
    useState(0.25);

  const [isAdded, setIsAdded] =
    useState(false);

  const product = products.find(
    (item) =>
      String(item.id) === String(id)
  );

  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold">
            Product not found 😢
          </h1>

          <p className="mt-3 text-gray-500">
            This flower product does not exist.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     PRICE
  ===================================================== */

  const pricePerKg = Number(
    product.pricePerKg ??
      product.price ??
      0
  );

  const selectedPrice =
    pricePerKg * selectedQuantity;

  /* =====================================================
     QUANTITY SETTINGS
  ===================================================== */

  const minOrderKg = Number(
    product.minOrderKg ?? 0.25
  );

  const maxOrderKg = Number(
    product.maxOrderKg ?? 20
  );

  const quantityStepKg = Number(
    product.quantityStepKg ?? 0.25
  );

  /* =====================================================
     QUANTITY OPTIONS
  ===================================================== */

  const quantityOptions = [
    0.25,
    0.5,
    1,
  ].filter(
    (quantity) =>
      quantity >= minOrderKg &&
      quantity <= maxOrderKg
  );

  /* =====================================================
     FORMAT KG
  ===================================================== */

  const formatKg = (kg) => {
    const value = Number(kg);

    if (value === 0.25) {
      return "250 g";
    }

    if (value === 0.5) {
      return "500 g";
    }

    if (value === 1) {
      return "1 kg";
    }

    return `${value} kg`;
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = () => {
  addToCart(
    {
      ...product,
      id: product.id,
      pricePerKg,
      quantityStepKg,
      minOrderKg,
      maxOrderKg,
      unit: "kg",
    },
    selectedQuantity
  );

  setIsAdded(true);

  setTimeout(() => {
    setIsAdded(false);
  }, 1800);
};

  /* =====================================================
     BUY NOW
  ===================================================== */

  const handleBuyNow = () => {
    addToCart(
      {
        ...product,

        id: product.id,

        pricePerKg,

        quantityStepKg,

        minOrderKg,

        maxOrderKg,

        unit: "kg",
      },
      selectedQuantity
    );

    // Agar tumhare paas checkout route hai
    // to yahan navigate kar sakte ho.
  };

  /* =====================================================
     INCREASE
  ===================================================== */

  const increaseQuantity = () => {
    setSelectedQuantity((current) => {
      const next =
        current + quantityStepKg;

      if (next > maxOrderKg) {
        return current;
      }

      return Math.round(next * 100) / 100;
    });
  };

  /* =====================================================
     DECREASE
  ===================================================== */

  const decreaseQuantity = () => {
    setSelectedQuantity((current) => {
      const next =
        current - quantityStepKg;

      if (next < minOrderKg) {
        return current;
      }

      return Math.round(next * 100) / 100;
    });
  };

  return (
    <section className="min-h-screen bg-[#faf9f7] py-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">

        {/* =================================================
            LEFT - IMAGE
        ================================================= */}

        <div className="relative">
          <div className="overflow-hidden rounded-[35px] bg-white shadow-xl">

            <img
              src={product.image}
              alt={product.name}
              className="h-[650px] w-full object-cover"
            />

          </div>

          {/* Fresh badge */}

          <div className="absolute left-5 top-5 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-widest shadow-lg">
            🌸 Fresh Flowers
          </div>
        </div>

        {/* =================================================
            RIGHT - PRODUCT INFORMATION
        ================================================= */}

        <div className="rounded-[35px] bg-white p-8 shadow-xl lg:p-10">

          {/* Category */}

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-600">
            {product.category}
          </p>

          {/* Name */}

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 lg:text-5xl">
            {product.name}
          </h1>

          {/* Rating */}

          <div className="mt-5 flex items-center gap-2">

            <div className="flex">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <span className="font-medium">
              {product.rating ?? 4.8}
            </span>

            <span className="text-sm text-gray-400">
              {product.numReviews ??
                0}{" "}
              verified reviews
            </span>
          </div>

          {/* Price */}

          <div className="mt-7">
            <div className="flex items-end gap-2">

              <span className="text-4xl font-bold text-gray-950">
                ₹
                {selectedPrice.toLocaleString(
                  "en-IN"
                )}
              </span>

              <span className="pb-1 text-gray-500">
                / {formatKg(selectedQuantity)}
              </span>

            </div>

            <p className="mt-2 text-sm text-gray-500">
              ₹
              {pricePerKg.toLocaleString(
                "en-IN"
              )}{" "}
              per kg
            </p>
          </div>

          {/* Stock */}

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            <Check size={16} />
            Fresh stock available
          </div>

          <div className="my-8 h-px bg-gray-100" />

          {/* Description */}

          <p className="text-gray-600">
            {product.description}
          </p>

          {/* =================================================
              QUANTITY
          ================================================= */}

          <div className="mt-8">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold text-gray-900">
                  Quantity
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Select quantity in kg
                </p>
              </div>

              <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600">
                ₹
                {pricePerKg.toLocaleString(
                  "en-IN"
                )}{" "}
                / kg
              </div>

            </div>

            {/* Quantity buttons */}

            <div className="mt-5 flex flex-wrap gap-3">

              {quantityOptions.map(
                (quantity) => (
                  <button
                    key={quantity}
                    type="button"
                    onClick={() =>
                      setSelectedQuantity(
                        quantity
                      )
                    }
                    className={`
                      rounded-full border px-6 py-3 text-sm font-semibold transition
                      ${
                        selectedQuantity ===
                        quantity
                          ? "border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-200"
                          : "border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50"
                      }
                    `}
                  >
                    {formatKg(quantity)}
                  </button>
                )
              )}

            </div>

            {/* Quantity Counter */}

            <div className="mt-4 flex w-fit items-center overflow-hidden rounded-full border border-gray-200 bg-white">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  selectedQuantity <=
                  minOrderKg
                }
                className="flex h-12 w-12 items-center justify-center text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus size={18} />
              </button>

              <div className="min-w-[90px] text-center">

                <div className="font-bold text-gray-900">
                  {formatKg(
                    selectedQuantity
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  {selectedQuantity} kg
                </div>

              </div>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  selectedQuantity >=
                  maxOrderKg
                }
                className="flex h-12 w-12 items-center justify-center text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus size={18} />
              </button>

            </div>

          </div>

          {/* =================================================
              SELECTION SUMMARY
          ================================================= */}

          <div className="mt-6 rounded-2xl bg-pink-50 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
                  Your Selection
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {formatKg(
                    selectedQuantity
                  )}
                </p>
              </div>

              <div className="text-right">

                <p className="text-xs text-gray-500">
                  Total
                </p>

                <p className="text-xl font-bold text-pink-600">
                  ₹
                  {selectedPrice.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              className={`
                flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-white transition
                ${
                  isAdded
                    ? "bg-green-600"
                    : "bg-gray-950 hover:bg-gray-800"
                }
              `}
            >
              {isAdded ? (
                <>
                  <Check size={20} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={20}
                  />
                  Add to Cart
                </>
              )}
            </button>

            <button
              type="button"
              onClick={
                handleBuyNow
              }
              className="flex items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 py-4 font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-700"
            >
              Buy Now →
            </button>

          </div>

          {/* Wishlist */}

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-4 font-medium transition hover:bg-pink-50"
          >
            <Heart size={20} />
            Add to Wishlist
          </button>

          {/* =================================================
              DELIVERY
          ================================================= */}

          <div className="mt-7 rounded-3xl bg-pink-50 p-6">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-pink-600 shadow-sm">
                <Truck size={22} />
              </div>

              <div>

                <h3 className="font-semibold text-gray-900">
                  Fast & Fresh Delivery
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Carefully packed and delivered
                  fresh to your doorstep.
                </p>

                <p className="mt-3 text-sm font-semibold text-pink-600">
                  Check delivery availability →
                </p>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}