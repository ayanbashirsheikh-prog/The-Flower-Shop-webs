import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem() {
  return (
    <div className="flex gap-4 border-b py-4">

      <img
        src="https://images.unsplash.com/photo-1561181286-d3fee7d55364"
        alt="Flower"
        className="h-20 w-20 rounded-2xl object-cover"
      />

      <div className="flex-1">

        <h3 className="font-bold text-gray-800">
          Luxury Rose Bouquet
        </h3>

        <p className="mt-1 text-pink-600 font-semibold">
          ₹999
        </p>

        <div className="mt-3 flex items-center gap-3">

          <button className="rounded-full bg-gray-100 p-2">
            <Minus size={16} />
          </button>

          <span>1</span>

          <button className="rounded-full bg-gray-100 p-2">
            <Plus size={16} />
          </button>

        </div>

      </div>

      <button className="text-red-500">
        <Trash2 size={18} />
      </button>

    </div>
  );
}