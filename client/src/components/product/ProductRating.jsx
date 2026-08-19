import { Star } from "lucide-react";

export default function ProductRating({ rating }) {
  return (
    <div className="flex items-center gap-1">

      <Star
        size={16}
        className="fill-yellow-400 text-yellow-400"
      />

      <span className="text-sm font-semibold">
        {rating}
      </span>

    </div>
  );
}