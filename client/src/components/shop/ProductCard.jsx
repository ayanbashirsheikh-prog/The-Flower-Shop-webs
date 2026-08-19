import {
  Heart,
  ShoppingCart,
  Eye,
  Check,
  Truck,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
  toggleWishlist,
  selectIsInWishlist,
} from "../../redux/slices/wishlistSlice";

import { addToCart } from "@/redux/slices/cartSlice";

/* =========================================================
   HELPERS
========================================================= */

const formatWeight = (weightKg) => {
  const value = Number(weightKg || 0);

  if (value === 0.25) return "250 g";
  if (value === 0.5) return "500 g";
  if (value === 0.75) return "750 g";
  if (value === 1) return "1 KG";

  if (value < 1) {
    return `${Math.round(value * 1000)} g`;
  }

  return `${value} KG`;
};

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ProductCard({
  product,
}) {
  const dispatch = useDispatch();

  /* =======================================================
     PRODUCT ID
  ======================================================= */

  const productId = String(
    product?.id ??
      product?._id ??
      ""
  );

  /* =======================================================
     WISHLIST
  ======================================================= */

  const isWishlisted = useSelector(
    (state) =>
      selectIsInWishlist(
        state,
        productId
      )
  );

  /* =======================================================
     VARIANTS
     
     Backend structure:
     
     variants: [
       {
         weightKg: 0.25,
         label: "250 g",
         price: 199,
         compareAtPrice: 249,
         discountPercentage: 20,
         isActive: true
       }
     ]
  ======================================================= */

  const variants = Array.isArray(
    product?.variants
  )
    ? product.variants
        .filter(
          (variant) =>
            variant &&
            variant.isActive !== false
        )
        .sort(
          (a, b) =>
            Number(a.weightKg || 0) -
            Number(b.weightKg || 0)
        )
    : [];

  /* =======================================================
     FALLBACK FOR OLD PRODUCTS
  ======================================================= */

  const legacyPrice = Number(
    product?.pricePerKg ??
      product?.price ??
      0
  );

  const firstVariant =
    variants[0] || null;

  /* =======================================================
     STARTING PRICE
     
     Variant price is already the actual
     pack selling price.
  ======================================================= */

  const startingPrice =
    firstVariant
      ? Number(
          firstVariant.price || 0
        )
      : legacyPrice *
        Number(
          product?.minOrderKg ??
            0.25
        );

  const startingWeight =
    firstVariant
      ? Number(
          firstVariant.weightKg || 0
        )
      : Number(
          product?.minOrderKg ??
            0.25
        );

  const compareAtPrice =
    firstVariant
      ? Number(
          firstVariant.compareAtPrice ||
            0
        )
      : 0;

  const discountPercentage =
    firstVariant
      ? Number(
          firstVariant.discountPercentage ||
            0
        )
      : 0;

  /* =======================================================
     STOCK
  ======================================================= */

  const stockKg = Number(
    product?.stockKg ?? 0
  );

  const isOutOfStock =
    stockKg <= 0;

  const lowStockThreshold =
    Number(
      product?.lowStockThresholdKg ??
        5
    );

  const isLowStock =
    !isOutOfStock &&
    stockKg <=
      lowStockThreshold;

  /* =======================================================
     RATING
  ======================================================= */

  const rating = Number(
    product?.rating ?? 0
  );

  const reviewCount = Number(
    product?.numReviews ??
      product?.reviewCount ??
      0
  );

  /* =======================================================
     FLAGS
  ======================================================= */

  const isBestSeller =
    product?.bestseller === true ||
    product?.isBestSeller === true;

  const isNew =
    product?.newArrival === true;

  const isWholesale =
    product?.wholesale === true ||
    product?.isWholesale === true;

  const sameDayDelivery =
    product?.sameDayDelivery === true;

  /* =======================================================
     IMAGE
  ======================================================= */

  const image =
    product?.image ||
    product?.images?.[0]?.url ||
    "/placeholder-flower.jpg";

  /* =======================================================
     WISHLIST
  ======================================================= */

  const handleWishlist = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId) {
      console.error(
        "Wishlist error: Product ID missing",
        product
      );

      return;
    }

    dispatch(
      toggleWishlist({
        ...product,
        id: productId,
      })
    );
  };

  /* =======================================================
     ADD TO CART
     
     Add the smallest available active variant.
  ======================================================= */

  const handleAddToCart = () => {
    if (!productId) {
      console.error(
        "Cart error: Product ID missing",
        product
      );

      return;
    }

    if (
      !firstVariant ||
      startingPrice <= 0
    ) {
      console.error(
        "Cart error: No valid product variant",
        product
      );

      return;
    }

    if (isOutOfStock) {
      return;
    }

    dispatch(
      addToCart({
        ...product,

        id: productId,

        /* Selected variant */

        selectedVariant:
          firstVariant,

        variantWeightKg:
          startingWeight,

        variantLabel:
          firstVariant.label ||
          formatWeight(
            startingWeight
          ),

        /* Actual pack price */

        price:
          startingPrice,

        unitPrice:
          startingPrice,

        pricePerKg:
          legacyPrice,

        /* Cart quantity */

        quantity: 1,

        quantityKg:
          startingWeight,

        quantityStepKg:
          startingWeight,

        minOrderKg:
          startingWeight,

        maxOrderKg:
          Number(
            product?.maxOrderKg ??
              20
          ),

        unit: "pack",
      })
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -7,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[30px]
        border
        border-slate-100
        bg-white
        shadow-[0_12px_45px_rgba(15,23,42,0.055)]
        transition-all
        duration-500
        hover:border-pink-100
        hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]
      "
    >

      {/* =================================================
          IMAGE
      ================================================= */}

      <div
        className="
          relative
          overflow-hidden
          bg-slate-100
        "
      >

        <Link
          to={`/product/${productId}`}
          className="block"
        >

          <div className="relative aspect-[4/4.35] overflow-hidden">

            <img
              src={image}
              alt={
                product?.name ||
                "Flower"
              }
              loading="lazy"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-[900ms]
                ease-out
                group-hover:scale-[1.07]
              "
            />

            {/* IMAGE GRADIENT */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/35
                via-transparent
                to-transparent
                opacity-60
              "
            />

          </div>

        </Link>

        {/* =================================================
            TOP LEFT BADGES
        ================================================= */}

        <div
          className="
            absolute
            left-4
            top-4
            z-10
            flex
            flex-col
            items-start
            gap-2
          "
        >

          {isBestSeller && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-white/95
                px-3.5
                py-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-slate-900
                shadow-lg
                backdrop-blur-md
              "
            >
              <Star
                size={12}
                className="fill-amber-400 text-amber-400"
              />

              Best Seller
            </span>
          )}

          {isNew && (
            <span
              className="
                rounded-full
                bg-pink-600
                px-3.5
                py-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-white
                shadow-lg
              "
            >
              New
            </span>
          )}

          {isWholesale && (
            <span
              className="
                rounded-full
                bg-slate-950
                px-3.5
                py-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-white
                shadow-lg
              "
            >
              Wholesale
            </span>
          )}

        </div>

        {/* =================================================
            DISCOUNT
        ================================================= */}

        {discountPercentage > 0 && (
          <span
            className="
              absolute
              bottom-4
              left-4
              z-10
              rounded-full
              bg-rose-600
              px-3
              py-1.5
              text-xs
              font-bold
              text-white
              shadow-lg
            "
          >
            {discountPercentage}% OFF
          </span>
        )}

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            flex-col
            gap-2.5
          "
        >

          {/* WISHLIST */}

          <motion.button
            type="button"
            whileHover={{
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={
              handleWishlist
            }
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className={`
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              shadow-lg
              backdrop-blur-xl
              transition-all
              duration-300

              ${
                isWishlisted
                  ? "border-pink-200 bg-pink-50 text-pink-600"
                  : "border-white/80 bg-white/95 text-slate-600 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
              }
            `}
          >

            <Heart
              size={18}
              strokeWidth={1.8}
              className={
                isWishlisted
                  ? "fill-pink-500 text-pink-500"
                  : ""
              }
            />

            {isWishlisted && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-pink-600
                  text-white
                "
              >
                <Check
                  size={9}
                  strokeWidth={3}
                />
              </span>
            )}

          </motion.button>

          {/* VIEW */}

          <Link
            to={`/product/${productId}`}
            aria-label={`View ${
              product?.name ||
              "product"
            }`}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/95
              text-slate-600
              shadow-lg
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-pink-200
              hover:bg-pink-50
              hover:text-pink-600
            "
          >

            <Eye
              size={18}
              strokeWidth={1.8}
            />

          </Link>

        </div>

        {/* =================================================
            QUICK VIEW
        ================================================= */}

        <Link
          to={`/product/${productId}`}
          className="
            absolute
            bottom-5
            left-1/2
            z-20
            -translate-x-1/2
            translate-y-3
            rounded-full
            border
            border-white/70
            bg-white/95
            px-6
            py-3
            text-xs
            font-bold
            uppercase
            tracking-[0.12em]
            text-slate-900
            opacity-0
            shadow-xl
            backdrop-blur-md
            transition-all
            duration-500
            hover:bg-slate-950
            hover:text-white
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          Quick View
        </Link>

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-6">

        {/* CATEGORY */}

        <div className="flex items-center justify-between gap-3">

          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-pink-500
            "
          >
            {product?.category ||
              "Flowers"}
          </span>

          {sameDayDelivery && (
            <span
              className="
                inline-flex
                items-center
                gap-1
                text-[10px]
                font-semibold
                text-emerald-600
              "
            >
              <Truck
                size={12}
              />

              Same Day
            </span>
          )}

        </div>

        {/* NAME */}

        <Link
          to={`/product/${productId}`}
          className="block"
        >

          <h3
            className="
              mt-2
              line-clamp-1
              text-xl
              font-bold
              tracking-tight
              text-slate-900
              transition-colors
              duration-300
              group-hover:text-pink-600
            "
          >
            {product?.name ||
              "Beautiful Flowers"}
          </h3>

        </Link>

        {/* DESCRIPTION */}

        <p
          className="
            mt-2
            line-clamp-2
            min-h-[40px]
            text-sm
            leading-5
            text-slate-500
          "
        >
          {product?.shortDescription ||
            product?.description ||
            "Freshly arranged flowers for every special moment."}
        </p>

        {/* =================================================
            RATING
        ================================================= */}

        {rating > 0 && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-amber-50
                px-2.5
                py-1
              "
            >
              <Star
                size={12}
                className="
                  fill-amber-400
                  text-amber-400
                "
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-amber-700
                "
              >
                {rating.toFixed(1)}
              </span>
            </div>

            {reviewCount > 0 && (
              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                {reviewCount} reviews
              </span>
            )}

          </div>
        )}

        {/* =================================================
            PRICE
        ================================================= */}

        <div
          className="
            mt-5
            flex
            items-end
            justify-between
            gap-4
          "
        >

          <div>

            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-slate-400
              "
            >
              Starting from
            </p>

            <div
              className="
                mt-1
                flex
                items-baseline
                gap-2
              "
            >

              <h4
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                ₹{formatPrice(
                  startingPrice
                )}
              </h4>

              {compareAtPrice >
                startingPrice && (
                <span
                  className="
                    text-sm
                    text-slate-400
                    line-through
                  "
                >
                  ₹
                  {formatPrice(
                    compareAtPrice
                  )}
                </span>
              )}

            </div>

            <p
              className="
                mt-1
                text-xs
                font-medium
                text-slate-400
              "
            >
              {formatWeight(
                startingWeight
              )}{" "}
              pack
            </p>

          </div>

          {/* ADD BUTTON */}

          <motion.button
            type="button"
            whileHover={
              !isOutOfStock
                ? {
                    scale: 1.04,
                  }
                : {}
            }
            whileTap={
              !isOutOfStock
                ? {
                    scale: 0.96,
                  }
                : {}
            }
            disabled={
              isOutOfStock ||
              !firstVariant
            }
            onClick={
              handleAddToCart
            }
            className={`
              flex
              h-12
              items-center
              gap-2
              rounded-full
              px-5
              text-sm
              font-bold
              text-white
              shadow-lg
              transition-all
              duration-300

              ${
                isOutOfStock
                  ? "cursor-not-allowed bg-slate-300 shadow-none"
                  : "bg-gradient-to-r from-pink-500 to-rose-600 shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/50"
              }
            `}
          >

            <ShoppingCart
              size={17}
              strokeWidth={2}
            />

            {isOutOfStock
              ? "Sold Out"
              : "Add"}

          </motion.button>

        </div>

        {/* =================================================
            LOW STOCK
        ================================================= */}

        {isLowStock && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              rounded-2xl
              bg-amber-50
              px-4
              py-3
            "
          >

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-amber-500
              "
            />

            <p
              className="
                text-xs
                font-semibold
                text-amber-700
              "
            >
              Only {formatWeight(
                stockKg
              )} available
            </p>

          </div>
        )}

        {/* =================================================
            DELIVERY
        ================================================= */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            border-t
            border-slate-100
            pt-4
            text-xs
            font-medium
            text-slate-400
          "
        >

          <Truck
            size={14}
            className="text-pink-500"
          />

          {sameDayDelivery
            ? "Same-day delivery available"
            : product?.deliveryAvailable !==
                false
            ? "Free delivery available"
            : "Delivery available"}

        </div>

      </div>
    </motion.article>
  );
}