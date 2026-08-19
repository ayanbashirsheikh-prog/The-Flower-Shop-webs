import { useMemo, useState } from "react";
import {
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Star,
  Store,
} from "lucide-react";

import ProductGrid from "@/components/shop/ProductGrid";

import rose from "@/assets/images/categories/roses.jpg";

/* =========================================================
   SHOP CATEGORIES
========================================================= */

const SHOP_FILTERS = [
  {
    id: "All",
    label: "All Flowers",
    icon: Sparkles,
  },
  {
    id: "Best Sellers",
    label: "Best Sellers",
    icon: Star,
  },
  {
    id: "Wholesale",
    label: "Wholesale",
    icon: Store,
  },
];

/* =========================================================
   SHOP PAGE
========================================================= */

export default function Shop() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  /* =======================================================
     MODE
  ======================================================= */

  const isWholesale =
    selectedCategory === "Wholesale";

  const isBestSeller =
    selectedCategory === "Best Sellers";

  /* =======================================================
     PAGE CONTENT
  ======================================================= */

  const pageContent = useMemo(() => {
    if (isWholesale) {
      return {
        eyebrow: "The Flower Shop · Business",
        title: "Wholesale Flowers 🌸",
        description:
          "Premium fresh flowers in bulk quantities with better pricing for businesses, events and florists.",
      };
    }

    if (isBestSeller) {
      return {
        eyebrow: "The Flower Shop · Customer Favorites",
        title: "Best Selling Flowers ✨",
        description:
          "Discover the flowers our customers love the most — handpicked favorites for every special moment.",
      };
    }

    return {
      eyebrow: "The Flower Shop",
      title: "Shop Flowers 🌸",
      description:
        "Discover fresh flowers, luxury bouquets and beautiful arrangements for every occasion.",
    };
  }, [
    isWholesale,
    isBestSeller,
  ]);

  /* =======================================================
     CATEGORY SELECTOR
  ======================================================= */

  const handleCategoryChange = (
    category
  ) => {
    setSelectedCategory(category);
  };

  return (
    <section
      className="
        min-h-screen
        bg-[#faf9f7]
        px-4
        py-10
        sm:px-6
        lg:px-8
        lg:py-16
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          {/* EYEBROW */}

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.3em]
              text-pink-600
            "
          >
            {pageContent.eyebrow}
          </p>

          <div
            className="
              mt-3
              flex
              flex-col
              justify-between
              gap-6
              md:flex-row
              md:items-end
            "
          >

            {/* TITLE */}

            <div>
              <h1
                className="
                  text-4xl
                  font-bold
                  tracking-tight
                  text-gray-950
                  sm:text-5xl
                "
              >
                {pageContent.title}
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  leading-7
                  text-gray-500
                "
              >
                {pageContent.description}
              </p>
            </div>

            {/* =================================================
                FILTER BUTTONS
            ================================================= */}

            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
              {SHOP_FILTERS.map(
                ({
                  id,
                  label,
                  icon: Icon,
                }) => {
                  const active =
                    selectedCategory === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          id
                        )
                      }
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        transition-all
                        duration-300

                        ${
                          active
                            ? id ===
                              "Wholesale"
                              ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                              : "bg-gray-950 text-white shadow-lg"
                            : id ===
                              "Wholesale"
                              ? "border border-pink-100 bg-pink-50 text-pink-600 hover:bg-pink-100"
                              : "border border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:text-pink-600"
                        }
                      `}
                    >
                      <Icon
                        size={15}
                        strokeWidth={2}
                      />

                      {label}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* =====================================================
            BEST SELLERS HERO
            Only visible when Best Sellers selected
        ===================================================== */}

        {isBestSeller && (
          <section
            className="
              relative
              mb-12
              overflow-hidden
              rounded-[32px]
              border
              border-amber-100
              bg-gradient-to-br
              from-amber-50
              via-white
              to-rose-50
              px-6
              py-8
              sm:px-10
              sm:py-10
            "
          >

            {/* Decorative circles */}

            <div
              className="
                absolute
                -right-20
                -top-20
                h-56
                w-56
                rounded-full
                bg-amber-200/30
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-20
                -left-20
                h-56
                w-56
                rounded-full
                bg-pink-200/30
                blur-3xl
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-6
                md:flex-row
                md:items-center
                md:justify-between
              "
            >

              <div>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white
                    px-4
                    py-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-amber-600
                    shadow-sm
                  "
                >
                  <Star
                    size={13}
                    fill="currentColor"
                  />

                  Customer Favorites
                </span>

                <h2
                  className="
                    mt-4
                    text-3xl
                    font-bold
                    tracking-tight
                    text-gray-950
                    sm:text-4xl
                  "
                >
                  Loved by our
                  <span className="text-pink-600">
                    {" "}
                    customers.
                  </span>
                </h2>

                <p
                  className="
                    mt-3
                    max-w-2xl
                    text-sm
                    leading-6
                    text-gray-600
                  "
                >
                  Explore our most popular flowers,
                  bouquets and arrangements — the
                  ones customers keep coming back for.
                </p>

              </div>

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-3
                  rounded-2xl
                  bg-white/80
                  px-5
                  py-4
                  shadow-sm
                  backdrop-blur
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-amber-100
                    text-amber-600
                  "
                >
                  <Star
                    size={20}
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-950">
                    Best Sellers
                  </p>

                  <p className="text-xs text-gray-500">
                    Our most-loved collection
                  </p>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* =====================================================
            WHOLESALE PREMIUM SECTION
            Visible except when Wholesale is selected
        ===================================================== */}

        {!isWholesale && !isBestSeller && (
          <section
            className="
              relative
              mb-14
              overflow-hidden
              rounded-[35px]
              bg-gradient-to-br
              from-rose-50
              via-white
              to-pink-50
              px-6
              py-10
              sm:px-10
              sm:py-12
              lg:px-14
            "
          >

            {/* Decorative backgrounds */}

            <div
              className="
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                bg-pink-200/30
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-20
                -left-20
                h-64
                w-64
                rounded-full
                bg-rose-200/30
                blur-3xl
              "
            />

            <div
              className="
                relative
                z-10
                grid
                items-center
                gap-10
                lg:grid-cols-2
              "
            >

              {/* LEFT */}

              <div>

                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-pink-100
                    px-4
                    py-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-pink-600
                  "
                >
                  Wholesale Flowers
                </span>

                <h2
                  className="
                    mt-5
                    max-w-xl
                    text-4xl
                    font-bold
                    tracking-tight
                    text-gray-950
                    sm:text-5xl
                  "
                >
                  Fresh Flowers.
                  <br />

                  <span className="text-pink-600">
                    Better Bulk Pricing.
                  </span>
                </h2>

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-base
                    leading-7
                    text-gray-600
                  "
                >
                  Premium fresh flowers available
                  in bulk quantities for weddings,
                  events, decorators, hotels,
                  restaurants, florists and
                  businesses.
                </p>

                {/* BENEFITS */}

                <div
                  className="
                    mt-7
                    grid
                    gap-3
                    sm:grid-cols-2
                  "
                >

                  <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
                    <p className="font-semibold text-gray-900">
                      🌸 Bulk Quantities
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Large orders from 5kg onwards.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
                    <p className="font-semibold text-gray-900">
                      💰 Wholesale Pricing
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Better prices for bulk orders.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
                    <p className="font-semibold text-gray-900">
                      🚚 Bulk Delivery
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Reliable delivery for large orders.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur">
                    <p className="font-semibold text-gray-900">
                      🤝 Business Orders
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Perfect for events and businesses.
                    </p>
                  </div>

                </div>

                {/* CTA */}

                <div
                  className="
                    mt-8
                    flex
                    flex-wrap
                    gap-3
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        "Wholesale"
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-gray-950
                      px-7
                      py-3.5
                      text-sm
                      font-bold
                      text-white
                      shadow-lg
                      transition
                      hover:bg-pink-600
                    "
                  >
                    <ShoppingBag size={17} />

                    Shop Wholesale

                    <ArrowRight size={16} />
                  </button>

                  <a
                    href="https://wa.me/YOUR_NUMBER"
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-gray-200
                      bg-white
                      px-7
                      py-3.5
                      text-sm
                      font-bold
                      text-gray-900
                      transition
                      hover:border-pink-300
                      hover:text-pink-600
                    "
                  >
                    <MessageCircle size={17} />

                    Request Wholesale Quote
                  </a>

                </div>
              </div>

              {/* RIGHT IMAGE */}

              <div className="relative">

                <div
                  className="
                    overflow-hidden
                    rounded-[30px]
                    shadow-2xl
                  "
                >
                  <img
                    src={rose}
                    alt="Wholesale fresh flowers"
                    className="
                      h-[360px]
                      w-full
                      object-cover
                      transition
                      duration-700
                      hover:scale-105
                      sm:h-[420px]
                    "
                  />
                </div>

                {/* FLOATING BADGE */}

                <div
                  className="
                    absolute
                    -bottom-5
                    -left-3
                    rounded-2xl
                    bg-white
                    px-6
                    py-4
                    shadow-xl
                    sm:-left-5
                  "
                >
                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-widest
                      text-pink-500
                    "
                  >
                    Bulk Orders
                  </p>

                  <p
                    className="
                      mt-1
                      text-lg
                      font-bold
                      text-gray-950
                    "
                  >
                    5kg – 100kg+
                  </p>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            WHOLESALE MODE HEADER
        ===================================================== */}

        {isWholesale && (
          <div
            className="
              mb-8
              rounded-[28px]
              border
              border-pink-100
              bg-gradient-to-r
              from-pink-50
              to-rose-50
              p-6
              sm:p-8
            "
          >
            <div
              className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>
                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-pink-600
                  "
                >
                  Wholesale Collection
                </span>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-bold
                    text-gray-950
                    sm:text-3xl
                  "
                >
                  Bulk Flowers for Business 🌸
                </h2>

                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-6
                    text-gray-600
                  "
                >
                  Special wholesale products and
                  bulk quantities for florists,
                  weddings, decorators, hotels,
                  restaurants and events.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCategory("All")
                }
                className="
                  shrink-0
                  rounded-full
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-gray-900
                  shadow-sm
                  transition
                  hover:bg-gray-950
                  hover:text-white
                "
              >
                ← All Flowers
              </button>

            </div>
          </div>
        )}

        {/* =====================================================
            PRODUCT GRID
        ===================================================== */}

        <ProductGrid
          search=""
          selectedCategory={
            selectedCategory
          }
        />

      </div>
    </section>
  );
}