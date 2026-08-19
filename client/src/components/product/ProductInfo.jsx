import { Heart, ShoppingCart, Star } from "lucide-react";

export default function ProductInfo() {
  return (
    <div>

      <p className="font-semibold text-pink-600">
        Premium Collection
      </p>

      <h1 className="mt-3 text-5xl font-bold">
        Luxury Rose Bouquet 🌹
      </h1>

      <div className="mt-4 flex items-center gap-2">
        <Star fill="gold" color="gold" />
        <Star fill="gold" color="gold" />
        <Star fill="gold" color="gold" />
        <Star fill="gold" color="gold" />
        <Star fill="gold" color="gold" />

        <span className="text-gray-500">(4.9 Reviews)</span>
      </div>

      <h2 className="mt-6 text-4xl font-bold text-pink-600">
        ₹1999
      </h2>

      <p className="mt-6 text-lg text-gray-600">
        Fresh hand-picked luxury flowers made for birthdays,
        anniversaries and special moments.
      </p>

      <div className="mt-8 flex gap-4">

        <button className="flex items-center gap-2 rounded-2xl bg-pink-600 px-8 py-4 text-white hover:bg-pink-700">
          <ShoppingCart size={20} />
          Add To Cart
        </button>

        <button className="rounded-2xl border p-4 hover:bg-pink-50">
          <Heart />
        </button>

      </div>

    </div>
  );
}