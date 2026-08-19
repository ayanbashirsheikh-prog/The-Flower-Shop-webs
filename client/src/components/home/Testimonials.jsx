const reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    city: "Mumbai",
    image: "https://i.pravatar.cc/300?img=11",
    review:
      "Absolutely stunning flowers! The bouquet looked even better than the pictures.",
  },

  {
    id: 2,
    name: "Ananya Patel",
    city: "Delhi",
    image: "https://i.pravatar.cc/300?img=32",
    review:
      "Beautiful packaging and same-day delivery. Highly recommended!",
  },

  {
    id: 3,
    name: "Rohan Verma",
    city: "Pune",
    image: "https://i.pravatar.cc/300?img=14",
    review:
      "Premium quality flowers and excellent customer service.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-pink-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
            Testimonials
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900">
            What Our Customers Say
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            Thousands of customers trust us for birthdays, anniversaries
            and special occasions.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {reviews.map((item) => (
            <div
              key={item.id}
              className="rounded-[32px] border border-pink-100 bg-white p-8 shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-full object-cover"
                />

                <div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="text-gray-500">
                    {item.city}
                  </p>

                </div>

              </div>

              <div className="mt-6 flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="mt-5 text-gray-600 leading-7">
                "{item.review}"
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}