import ProductCard from "./ProductCard";
import productsData from "@/data/productsData";

export default function ProductGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

      {productsData.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}

    </div>
  );
}