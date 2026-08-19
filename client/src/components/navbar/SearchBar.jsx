import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full">

      <Search
        size={20}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search roses, bouquets, gifts..."
        className="h-14 w-full rounded-full border border-pink-100 bg-white/90 pl-14 pr-5 shadow-lg outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
      />

    </div>
  );
}