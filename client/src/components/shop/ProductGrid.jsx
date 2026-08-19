import { useMemo } from "react";

import productsData from "@/data/productsData";
import ProductCard from "./ProductCard";


/* =========================================================
   PRODUCT GRID
   Handles:
   - All Flowers
   - Best Sellers
   - Wholesale
   - Search
   - Category filtering
   - API products
   - Local fallback products
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
    /*
      API products are the primary source.

      Local productsData is used only when
      the API does not provide products.
    */

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
    const normalizedSearch =
      String(search || "")
        .trim()
        .toLowerCase();

    return productList.filter((product) => {
      if (!product) {
        return false;
      }

      /* ===================================================
         SEARCH
      =================================================== */

      const name =
        String(product.name || "")
          .toLowerCase();

      const description =
        String(
          product.shortDescription ||
            product.description ||
            ""
        ).toLowerCase();

      const category =
        String(
          product.category || ""
        ).toLowerCase();

      const flowerType =
        String(
          product.flowerType || ""
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
        );

      if (!searchMatch) {
        return false;
      }

      /* ===================================================
         ALL FLOWERS
      =================================================== */

      if (
        selectedCategory === "All" ||
        !selectedCategory
      ) {
        return true;
      }

      /* ===================================================
         BEST SELLERS
      =================================================== */

      if (
        selectedCategory ===
        "Best Sellers"
      ) {
        return (
          product.bestseller === true ||
          product.isBestSeller === true
        );
      }

      /* ===================================================
         WHOLESALE
      =================================================== */

      if (
        selectedCategory ===
        "Wholesale"
      ) {
        return (
          product.wholesale === true ||
          product.isWholesale === true
        );
      }

      /* ===================================================
         NORMAL CATEGORY
         Example:
         Roses
         Lilies
         Bouquets
         Birthday
         Anniversary
      =================================================== */

      return (
        category ===
        String(
          selectedCategory
        )
          .trim()
          .toLowerCase()
      );
    });
  }, [
    productList,
    search,
    selectedCategory,
  ]);

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (
    filteredProducts.length === 0
  ) {
    const isBestSeller =
      selectedCategory ===
      "Best Sellers";

    const isWholesale =
      selectedCategory ===
      "Wholesale";

    return (
      <div
        className="
          flex
          min-h-[360px]
          items-center
          justify-center
          rounded-[32px]
          border
          border-slate-100
          bg-white
          px-6
          py-16
          text-center
          shadow-[0_15px_50px_rgba(15,23,42,0.05)]
        "
      >
        <div className="max-w-md">

          {/* ICON */}

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-pink-50
              text-2xl
            "
          >
            {isBestSeller
              ? "⭐"
              : isWholesale
              ? "🌸"
              : "🌷"}
          </div>

          {/* TITLE */}

          <h3
            className="
              mt-5
              text-xl
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            {isBestSeller
              ? "No best sellers yet"
              : isWholesale
              ? "No wholesale flowers yet"
              : "No flowers found"}
          </h3>

          {/* DESCRIPTION */}

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            {isBestSeller
              ? "Best-selling flowers will appear here once they are marked as bestseller in the admin panel."
              : isWholesale
              ? "Wholesale products will appear here once they are marked as wholesale."
              : search
              ? `We couldn't find any flowers matching "${search}".`
              : "There are currently no products available in this collection."}
          </p>

        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
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
  );
}