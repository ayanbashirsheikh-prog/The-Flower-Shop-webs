export default function CategoryFilter({
  categories,
  selected,
  setSelected,
}) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelected(category)}
          className={`rounded-full px-5 py-2 font-medium transition ${
            selected === category
              ? "bg-pink-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {category}
        </button>
      ))}

    </div>
  );
}