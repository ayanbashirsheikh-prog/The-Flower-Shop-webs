import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600 text-2xl text-white shadow-lg">
        🌸
      </div>

      <div>

        <h1 className="text-2xl font-extrabold text-slate-900">
          The Flower Shop
        </h1>

        <p className="text-xs text-gray-500">
          Luxury Flowers
        </p>

      </div>
    </Link>
  );
}