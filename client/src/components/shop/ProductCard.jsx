import {
  Heart,
  ShoppingCart,
  Eye,
  Check,
  Truck,
  PackageCheck,
  Sparkles,
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
   PRODUCT CARD
   Premium Flower Shop Product Card

   Supports:
   - API products
   - Local products
   - Product variants
   - 250g / 500g / 1KG
   - Wishlist
   - Cart
   - Best Seller
   - Wholesale
   - New Arrival
   - Stock status
   ========================================================= */

export default function ProductCard({ product }) {
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

  const isWishlisted = useSelector((state) =>
    selectIsInWishlist(
      state,
      productId
    )
  );

  /* =======================================================
     PRODUCT FLAGS
     ======================================================= */

  const isBestSeller =
    product?.bestseller === true ||
    product?.isBestSeller === true;

  const isWholesale =
    product?.wholesale === true ||
    product?.isWholesale === true;

  const isNewArrival =
    product?.newArrival === true;

  /* =======================================================
     VARIANTS
     
     New backend structure:
     
     variants: [
       {
         weightKg: 0.25,
         label: "250 g",
         price: 299,
         compareAtPrice: 399,
         discountPercentage: 25,
         isActive: true
       }
     ]
     ======================================================= */

  const activeVariants = Array.isArray(
    product?.variants
  )
    ? product.variants.filter(
        (variant) =>
          variant &&
          variant.isActive !== false
      )
    : [];

  /* =======================================================
     SELECT STARTING VARIANT
     
     Prefer:
     250g
     then 500g
     then 1KG
     then first available variant
     ======================================================= */

  const startingVariant =
    activeVariants.length > 0
      ? [...activeVariants].sort(
          (a, b) =>
            Number(a?.weightKg ?? 0) -
            Number(b?.weightKg ?? 0)
        )[0]
      : null;

  /* =======================================================
     PRICE
     
     New backend:
     variant.price

     Old/local fallback:
     pricePerKg / price
     ======================================================= */

  const pricePerKg = Number(
    product?.pricePerKg ??
      product?.price ??
      0
  );

  const variantPrice = Number(
    startingVariant?.price ?? 0
  );

  const hasVariantPrice =
    Number.isFinite(variantPrice) &&
    variantPrice > 0;

  /* =======================================================
     STARTING WEIGHT
     ======================================================= */

  const displayStartingQuantity =
    Number(
      startingVariant?.weightKg ??
        product?.minOrderKg ??
        0.25
    );

  /* =======================================================
     STARTING PRICE
     
     Variant price is already the price
     for that pack.

     Old product structure:
     pricePerKg × weight
     ======================================================= */

  const startingPrice = hasVariantPrice
    ? variantPrice
    : pricePerKg *
      displayStartingQuantity;

  /* =======================================================
     COMPARE AT PRICE / DISCOUNT
     ======================================================= */

  const compareAtPrice = Number(
    startingVariant?.compareAtPrice ?? 0
  );

  const discountPercentage = Number(
    startingVariant?.discountPercentage ??
      0
  );

  /* =======================================================
     STOCK LOGIC
     
     IMPORTANT FIX:
     
     Do NOT assume:
     
     undefined stockKg = sold out
     
     Because the new backend may not provide
     stockKg for every product.

     Explicit stockKg <= 0 means sold out.
     
     Missing stockKg means stock status is unknown,
     so customer can still add product to cart.
     ======================================================= */

  const hasStockField =
    product?.stockKg !== undefined &&
    product?.stockKg !== null &&
    product?.stockKg !== "";

  const stockKg = hasStockField
    ? Number(product.stockKg)
    : null;

  const isExplicitlyOutOfStock =
    hasStockField &&
    Number.isFinite(stockKg) &&
    stockKg <= 0;

  const lowStockThreshold = Number(
    product?.lowStockThresholdKg ?? 5
  );

  const isLowStock =
    hasStockField &&
    Number.isFinite(stockKg) &&
    stockKg > 0 &&
    stockKg <= lowStockThreshold;

  /* =======================================================
     FINAL AVAILABILITY
     
     If product has active variants:
       available unless explicitly sold out.

     If no variants:
       preserve compatibility with old products.
     ======================================================= */

  const isOutOfStock =
    isExplicitlyOutOfStock;

  /* =======================================================
     FORMAT WEIGHT
     ======================================================= */

  const formatWeight = (kg) => {
    const value = Number(kg || 0);

    if (value === 0.25) {
      return "250 g";
    }

    if (value === 0.5) {
      return "500 g";
    }

    if (value === 0.75) {
      return "750 g";
    }

    if (value === 1) {
      return "1 KG";
    }

    if (value < 1) {
      return `${Math.round(
        value * 1000
      )} g`;
    }

    return `${value} KG`;
  };

  /* =======================================================
     DISPLAY PRICE
     ======================================================= */

  const formattedStartingPrice =
    Number.isFinite(startingPrice)
      ? startingPrice.toLocaleString(
          "en-IN",
          {
            maximumFractionDigits: 2,
          }
        )
      : "0";

  /* =======================================================
     WISHLIST
     ======================================================= */

  const handleWishlist = (event) => {
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
     ======================================================= */

  const handleAddToCart = () => {
    if (!productId) {
      console.error(
        "Cart error: Product ID missing",
        product
      );

      return;
    }

    if (isOutOfStock) {
      return;
    }

    /* -----------------------------------------------------
       VARIANT PRODUCT
       ----------------------------------------------------- */

    if (startingVariant) {
      dispatch(
        addToCart({
          ...product,

          id: productId,

          /* Selected variant */

          selectedVariant:
            startingVariant,

          variantId:
            startingVariant?._id ??
            `${productId}-${startingVariant.weightKg}`,

          weightKg:
            Number(
              startingVariant.weightKg
            ),

          quantityKg:
            Number(
              startingVariant.weightKg
            ),

          quantity:
            1,

          unit: "pack",

          price:
            Number(
              startingVariant.price
            ),

          pricePerKg,

          compareAtPrice:
            Number(
              startingVariant.compareAtPrice ??
                0
            ),

          quantityStepKg:
            Number(
              startingVariant.weightKg
            ),

          minOrderKg:
            Number(
              startingVariant.weightKg
            ),

          maxOrderKg:
            Number(
              product?.maxOrderKg ??
                20
            ),
        })
      );

      return;
    }

    /* -----------------------------------------------------
       OLD / LOCAL PRODUCT FALLBACK
       ----------------------------------------------------- */

    const minimumQuantity = Number(
      product?.minOrderKg ?? 0.25
    );

    const quantityStep = Number(
      product?.quantityStepKg ?? 0.25
    );

    const maximumQuantity = Number(
      product?.maxOrderKg ?? 20
    );

    dispatch(
      addToCart({
        ...product,

        id: productId,

        pricePerKg,

        quantity:
          minimumQuantity,

        quantityKg:
          minimumQuantity,

        quantityStepKg:
          quantityStep,

        minOrderKg:
          minimumQuantity,

        maxOrderKg:
          maximumQuantity,

        unit: "kg",
      })
    );
  };

  /* =======================================================
     INVALID PRODUCT
     ======================================================= */

  if (!product) {
    return null;
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -7,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[30px]
        border
        border-slate-100
        bg-white
        shadow-[0_12px_40px_rgba(15,23,42,0.06)]
        transition-shadow
        duration-500
        hover:shadow-[0_25px_70px_rgba(15,23,42,0.13)]
      "
    >
      {/* =================================================
          IMAGE
          ================================================= */}

      <div className="relative overflow-hidden">

        <Link
          to={
            productId
              ? `/product/${productId}`
              : "#"
          }
          aria-label={`View ${
            product?.name ||
            "flower"
          }`}
        >
          <img
            src={
              product?.image ||
              product?.images?.[0]?.url ||
              "/placeholder-flower.jpg"
            }
            alt={
              product?.name ||
              "Flower"
            }
            loading="lazy"
            className="
              h-80
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-110
            "
          />
        </Link>

        {/* IMAGE GRADIENT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/45
            via-transparent
            to-transparent
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
          "
        />

        {/* =================================================
            BADGES
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
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-amber-400
                px-3.5
                py-2
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-white
                shadow-lg
              "
            >
              <Sparkles size={12} />
              Best Seller
            </div>
          )}

          {isNewArrival && (
            <div
              className="
                rounded-full
                bg-white/95
                px-3.5
                py-2
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-pink-600
                shadow-lg
                backdrop-blur-md
              "
            >
              New
            </div>
          )}

          {isWholesale && (
            <div
              className="
                rounded-full
                bg-gray-950
                px-3.5
                py-2
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-white
                shadow-lg
              "
            >
              Wholesale
            </div>
          )}

        </div>

        {/* =================================================
            DISCOUNT
            ================================================= */}

        {discountPercentage > 0 && (
          <div
            className="
              absolute
              bottom-4
              left-4
              z-10
              rounded-full
              bg-white/95
              px-3
              py-1.5
              text-xs
              font-bold
              text-emerald-600
              shadow-lg
              backdrop-blur-md
            "
          >
            {discountPercentage}% OFF
          </div>
        )}

        {/* =================================================
            ACTIONS
            ================================================= */}

        <div
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            flex-col
            gap-3
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
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              shadow-lg
              backdrop-blur-md
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
              size={19}
              strokeWidth={1.8}
              className={`
                transition-all
                duration-300

                ${
                  isWishlisted
                    ? "fill-pink-500 text-pink-500"
                    : ""
                }
              `}
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
                  size={10}
                  strokeWidth={3}
                />
              </span>
            )}
          </motion.button>

          {/* VIEW */}

          <Link
            to={
              productId
                ? `/product/${productId}`
                : "#"
            }
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
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-pink-200
              hover:bg-pink-50
              hover:text-pink-600
            "
          >
            <Eye
              size={19}
              strokeWidth={1.8}
            />
          </Link>

        </div>

        {/* =================================================
            QUICK VIEW
            ================================================= */}

        <Link
          to={
            productId
              ? `/product/${productId}`
              : "#"
          }
          className="
            absolute
            bottom-5
            left-1/2
            z-10
            -translate-x-1/2
            rounded-full
            border
            border-white/60
            bg-white/95
            px-6
            py-3
            text-sm
            font-semibold
            text-slate-900
            opacity-0
            shadow-xl
            backdrop-blur-md
            transition-all
            duration-500
            hover:bg-pink-600
            hover:text-white
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

        <span
          className="
            text-[10px]
            font-extrabold
            uppercase
            tracking-[0.22em]
            text-pink-500
          "
        >
          {product?.category ||
            "Flowers"}
        </span>

        {/* NAME */}

        <Link
          to={
            productId
              ? `/product/${productId}`
              : "#"
          }
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
              hover:text-pink-600
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
            "Fresh premium flowers carefully selected for every special moment."}
        </p>

        {/* =================================================
            PRICE
            ================================================= */}

        <div
          className="
            mt-6
            flex
            items-end
            justify-between
            gap-4
          "
        >

          <div>

            <p
              className="
                text-xs
                font-medium
                text-slate-400
              "
            >
              Starting from
            </p>

            <div className="mt-1 flex items-center gap-2">

              <h4
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-pink-600
                "
              >
                ₹{formattedStartingPrice}
              </h4>

              {compareAtPrice >
                startingPrice && (
                <span
                  className="
                    text-sm
                    font-medium
                    text-slate-400
                    line-through
                  "
                >
                  ₹
                  {compareAtPrice.toLocaleString(
                    "en-IN"
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
                displayStartingQuantity
              )}

              {pricePerKg > 0 &&
                !startingVariant && (
                  <>
                    {" "}
                    · ₹
                    {pricePerKg.toLocaleString(
                      "en-IN"
                    )}
                    /kg
                  </>
                )}
            </p>

          </div>

          {/* =================================================
              ADD BUTTON
              ================================================= */}

          <motion.button
            type="button"
            whileHover={
              !isOutOfStock
                ? {
                    scale: 1.03,
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
            onClick={
              handleAddToCart
            }
            disabled={isOutOfStock}
            className={`
              flex
              items-center
              gap-2
              rounded-full
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition-all
              duration-300

              ${
                isOutOfStock
                  ? "cursor-not-allowed bg-slate-300 shadow-none"
                  : "bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/50"
              }
            `}
          >

            {isOutOfStock ? (
              <>
                <PackageCheck
                  size={17}
                />

                Sold Out
              </>
            ) : (
              <>
                <ShoppingCart
                  size={17}
                  strokeWidth={2}
                />

                Add
              </>
            )}

          </motion.button>

        </div>

        {/* =================================================
            LOW STOCK
            ================================================= */}

        {isLowStock &&
          !isOutOfStock && (
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
              <PackageCheck
                size={15}
                className="text-amber-600"
              />

              <p
                className="
                  text-xs
                  font-semibold
                  text-amber-700
                "
              >
                Only {stockKg} kg left
              </p>
            </div>
          )}

        {/* =================================================
            WHOLESALE INFO
            ================================================= */}

        {isWholesale && (
          <div
            className="
              mt-4
              rounded-2xl
              bg-slate-50
              px-4
              py-3
            "
          >
            <p
              className="
                text-xs
                font-semibold
                text-slate-700
              "
            >
              Wholesale available
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Bulk pricing available for
              larger orders.
            </p>
          </div>
        )}

        {/* =================================================
            DELIVERY
            ================================================= */}

        {product?.deliveryAvailable !==
          false && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              text-xs
              font-medium
              text-slate-400
            "
          >
            <Truck
              size={14}
              className="text-pink-500"
            />

            {product?.sameDayDelivery
              ? "Same-day delivery available"
              : "Free delivery available"}
          </div>
        )}

      </div>
    </motion.article>
  );
}