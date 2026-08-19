import { ShoppingCart, Heart } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <div className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <button className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-md">
          <Heart size={18} />
        </button>
      </div>

      <div className="p-5">

        <h3 className="text-xl font-bold">
          {product.name}
        </h3>

        <p className="mt-2 text-pink-600 font-semibold">
          ₹{product.price}
        </p>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 text-white hover:bg-pink-700">
          <ShoppingCart size={18} />
          Add To Cart
        </button>

      </div>
    </div>
  );
}