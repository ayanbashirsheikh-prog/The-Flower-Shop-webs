const categories = [
  "All",
  "Roses",
  "Birthday",
  "Anniversary",
];

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">

      <h2 className="mb-5 text-2xl font-bold">
        Categories
      </h2>

      <div className="space-y-3">

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-full rounded-xl px-4 py-3 text-left ${
              selectedCategory === category
                ? "bg-pink-600 text-white"
                : "bg-gray-100 hover:bg-pink-100"
            }`}
          >
            {category}
          </button>
        ))}

      </div>

    </div>
  );
}