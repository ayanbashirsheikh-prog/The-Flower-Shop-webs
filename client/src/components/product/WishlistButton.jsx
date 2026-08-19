import { Heart } from "lucide-react";

export default function WishlistButton() {
  return (
    <button className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-lg transition hover:scale-110">
      <Heart size={18} />
    </button>
  );
}