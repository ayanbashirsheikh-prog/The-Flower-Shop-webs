import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function AddToCartButton({ product }) {
  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-pink-700 hover:shadow-lg"
    >
      <ShoppingCart size={18} />

      Add to Cart
    </button>
  );
}