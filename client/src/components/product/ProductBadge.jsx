export default function ProductBadge({ discount, bestseller }) {
  return (
    <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
      {discount && (
        <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white shadow-md">
          -{discount}%
        </span>
      )}

      {bestseller && (
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 shadow-md">
          Bestseller
        </span>
      )}
    </div>
  );
}