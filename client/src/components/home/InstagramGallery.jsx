import rose from "@/assets/images/categories/roses.jpg";
import birthday from "@/assets/images/categories/birthday.jpg";
import anniversary from "@/assets/images/categories/anniversary.jpg";
import tulip from "@/assets/images/categories/tulip.jpg";

const gallery = [
  rose,
  birthday,
  anniversary,
  tulip,
  rose,
  birthday,
];

export default function InstagramGallery() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mb-16 text-center">

          <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
            Instagram
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Follow Our Journey
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            Beautiful moments captured with our luxury flower collections.
          </p>

        </div>

        {/* Grid */}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

          {gallery.map((image, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-[30px]"
            >
              <img
                src={image}
                alt="flower"
                className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}