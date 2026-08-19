export default function ProductGallery() {
  return (
    <div className="space-y-4">
      <img
        src="https://images.unsplash.com/photo-1561181286-d3fee7d55364"
        alt="Flower"
        className="h-[500px] w-full rounded-3xl object-cover shadow-xl"
      />

      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((item) => (
          <img
            key={item}
            src="https://images.unsplash.com/photo-1561181286-d3fee7d55364"
            alt="thumbnail"
            className="h-24 w-full cursor-pointer rounded-2xl object-cover border-2 hover:border-pink-500"
          />
        ))}
      </div>
    </div>
  );
}