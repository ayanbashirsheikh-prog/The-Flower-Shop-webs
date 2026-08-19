import { Link } from "react-router-dom";

import rose from "@/assets/images/categories/roses.jpg";
import birthday from "@/assets/images/categories/birthday.jpg";
import anniversary from "@/assets/images/categories/anniversary.jpg";
import tulip from "@/assets/images/categories/tulip.jpg";

const categories = [
  {
    id: 1,
    title: "Roses",
    image: rose,
    count: "120+ Bouquets",
  },

  {
    id: 2,
    title: "Birthday",
    image: birthday,
    count: "80+ Gifts",
  },

  {
    id: 3,
    title: "Anniversary",
    image: anniversary,
    count: "95+ Collections",
  },

  {
    id: 4,
    title: "Tulips",
    image: tulip,
    count: "70+ Designs",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mb-16 text-center">

          <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
            Our Collections
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            Explore Categories
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            Discover handcrafted luxury flower collections designed for
            birthdays, anniversaries and every special moment.
          </p>

        </div>

        {/* Grid */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (
            <Link
              key={category.id}
              to="/shop"
              className="group overflow-hidden rounded-[32px] bg-white shadow-lg transition duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >

              <div className="relative overflow-hidden">

                <img
                  src={category.image}
                  alt={category.title}
                  className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 text-white">

                  <h3 className="text-3xl font-bold">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm text-pink-200">
                    {category.count}
                  </p>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}