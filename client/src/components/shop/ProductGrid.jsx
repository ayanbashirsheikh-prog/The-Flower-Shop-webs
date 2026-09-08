import { useMemo } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  SearchX,
} from "lucide-react";

import productsData from "@/data/productsData";
import ProductCard from "./ProductCard";

/* =========================================================
   PREMIUM PRODUCT GRID

   Handles:
   - All Flowers
   - Best Sellers
   - Wholesale
   - Search
   - Category filtering
   - API products
   - Local fallback products
   - Responsive grid
   - Premium empty states
   - Product count
========================================================= */

export default function ProductGrid({
  products = [],
  search = "",
  selectedCategory = "All",
}) {
  /* =======================================================
     PRODUCT SOURCE
  ======================================================= */

  const productList = useMemo(() => {
    if (
      Array.isArray(products) &&
      products.length > 0
    ) {
      return products;
    }

    return Array.isArray(productsData)
      ? productsData
      : [];
  }, [products]);

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    const normalizedSearch = String(
      search || ""
    )
      .trim()
      .toLowerCase();

    const normalizedCategory = String(
      selectedCategory || "All"
    )
      .trim()
      .toLowerCase();

    return productList.filter((product) => {
      if (!product) {
        return false;
      }

      /* ===================================================
         SEARCH
      =================================================== */

      const name = String(
        product?.name || ""
      ).toLowerCase();

      const description = String(
        product?.shortDescription ||
          product?.description ||
          ""
      ).toLowerCase();

      const category = String(
        product?.category || ""
      ).toLowerCase();

      const flowerType = String(
        product?.flowerType || ""
      ).toLowerCase();

      const subcategory = String(
        product?.subcategory || ""
      ).toLowerCase();

      const searchMatch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        description.includes(
          normalizedSearch
        ) ||
        category.includes(
          normalizedSearch
        ) ||
        flowerType.includes(
          normalizedSearch
        ) ||
        subcategory.includes(
          normalizedSearch
        );

      if (!searchMatch) {
        return false;
      }

      /* ===================================================
         ALL FLOWERS
      =================================================== */

      if (
        normalizedCategory === "all" ||
        !normalizedCategory
      ) {
        return true;
      }

      /* ===================================================
         BEST SELLERS
      =================================================== */

      if (
        normalizedCategory ===
        "best sellers"
      ) {
        return (
          product?.bestseller === true ||
          product?.isBestSeller === true
        );
      }

      /* ===================================================
         WHOLESALE
      =================================================== */

      if (
        normalizedCategory ===
        "wholesale"
      ) {
        return (
          product?.wholesale === true ||
          product?.isWholesale === true
        );
      }

      /* ===================================================
         NEW ARRIVALS
      =================================================== */

      if (
        normalizedCategory ===
        "new arrivals"
      ) {
        return (
          product?.newArrival === true ||
          product?.isNewArrival === true
        );
      }

      /* ===================================================
         NORMAL CATEGORY
      =================================================== */

      return (
        category === normalizedCategory ||
        subcategory === normalizedCategory ||
        flowerType === normalizedCategory
      );
    });
  }, [
    productList,
    search,
    selectedCategory,
  ]);

  /* =======================================================
     CATEGORY META
  ======================================================= */

  const categoryMeta = useMemo(() => {
    const category =
      String(
        selectedCategory || "All"
      ).trim();

    const normalized =
      category.toLowerCase();

    if (normalized === "best sellers") {
      return {
        icon: Sparkles,
        label: "Best Sellers",
        description:
          "Our most loved flowers, chosen again and again.",
      };
    }

    if (normalized === "wholesale") {
      return {
        icon: Sparkles,
        label: "Wholesale Collection",
        description:
          "Premium flowers for larger orders and special occasions.",
      };
    }

    if (normalized === "new arrivals") {
      return {
        icon: Sparkles,
        label: "New Arrivals",
        description:
          "Fresh additions to our floral collection.",
      };
    }

    if (normalized === "all") {
      return {
        icon: Sparkles,
        label: "All Flowers",
        description:
          "Explore our complete collection of fresh, premium flowers.",
      };
    }

    return {
      icon: Sparkles,
      label: category,
      description:
        "Beautiful flowers selected for your special moments.",
    };
  }, [selectedCategory]);

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (
    filteredProducts.length === 0
  ) {
    const isBestSeller =
      String(
        selectedCategory
      ).toLowerCase() ===
      "best sellers";

    const isWholesale =
      String(
        selectedCategory
      ).toLowerCase() ===
      "wholesale";

    const isNewArrival =
      String(
        selectedCategory
      ).toLowerCase() ===
      "new arrivals";

    return (
      <section
        className="
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-slate-200/70
          bg-white
          px-6
          py-20
          shadow-[0_20px_70px_rgba(15,23,42,0.06)]
        "
      >
        {/* Decorative background */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-pink-100/60
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-24
            h-64
            w-64
            rounded-full
            bg-rose-100/50
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            flex
            max-w-xl
            flex-col
            items-center
            text-center
          "
        >
          {/* Icon */}

          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-pink-100
              bg-gradient-to-br
              from-pink-50
              to-rose-50
              shadow-[0_15px_40px_rgba(244,63,94,0.12)]
            "
          >
            {isBestSeller ||
            isNewArrival ? (
              <Sparkles
                size={30}
                strokeWidth={1.5}
                className="text-pink-500"
              />
            ) : isWholesale ? (
              <span className="text-3xl">
                🌸
              </span>
            ) : (
              <SearchX
                size={30}
                strokeWidth={1.5}
                className="text-pink-500"
              />
            )}
          </div>

          {/* Small label */}

          <span
            className="
              mt-7
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.3em]
              text-pink-500
            "
          >
            {selectedCategory ||
              "Collection"}
          </span>

          {/* Title */}

          <h3
            className="
              mt-3
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              sm:text-3xl
            "
          >
            {isBestSeller
              ? "No best sellers yet"
              : isWholesale
              ? "No wholesale flowers yet"
              : isNewArrival
              ? "No new arrivals yet"
              : search
              ? "No flowers found"
              : "Nothing here yet"}
          </h3>

          {/* Description */}

          <p
            className="
              mt-3
              max-w-md
              text-sm
              leading-7
              text-slate-500
            "
          >
            {isBestSeller
              ? "Best-selling flowers will appear here once they are marked as bestseller in the admin panel."
              : isWholesale
              ? "Wholesale products will appear here once they are marked as wholesale."
              : isNewArrival
              ? "Our newest floral arrivals will appear here soon."
              : search
              ? `We couldn't find any flowers matching "${search}".`
              : "There are currently no products available in this collection."}
          </p>

          {/* Search hint */}

          {search && (
            <div
              className="
                mt-7
                rounded-full
                border
                border-slate-200
                bg-slate-50
                px-5
                py-2.5
                text-xs
                font-medium
                text-slate-500
              "
            >
              Try searching for roses,
              lilies, bouquets or gifts
            </div>
          )}
        </div>
      </section>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">

      {/* =================================================
          GRID HEADER
          ================================================= */}

      <div
        className="
          mb-7
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >

        {/* LEFT */}

        <div>
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-pink-500
              "
            />

            <span
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.25em]
                text-pink-500
              "
            >
              {categoryMeta.label}
            </span>
          </div>

          <h2
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              sm:text-3xl
            "
          >
            {search
              ? `Results for "${search}"`
              : categoryMeta.label}
          </h2>

          <p
            className="
              mt-1.5
              max-w-xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            {search
              ? `Beautiful flowers matching your search.`
              : categoryMeta.description}
          </p>
        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              shadow-sm
            "
          >
            <SlidersHorizontal
              size={14}
              className="text-slate-400"
            />

            <span
              className="
                text-xs
                font-semibold
                text-slate-600
              "
            >
              {filteredProducts.length}
              {" "}
              {filteredProducts.length ===
              1
                ? "flower"
                : "flowers"}
            </span>
          </div>
        </div>
      </div>

      {/* =================================================
          PRODUCT GRID
          ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-7
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-3
        "
      >
        {filteredProducts.map(
          (product, index) => {
            const productId =
              product?.id ??
              product?._id ??
              `product-${index}`;

            return (
              <ProductCard
                key={String(
                  productId
                )}
                product={product}
              />
            );
          }
        )}
      </div>

    </section>
  );
}