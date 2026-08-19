import {
  Truck,
  ShieldCheck,
  Flower2,
  Gift,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Same day delivery available.",
  },

  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% safe payments.",
  },

  {
    icon: Flower2,
    title: "Fresh Flowers",
    desc: "Premium quality flowers.",
  },

  {
    icon: Gift,
    title: "Luxury Packaging",
    desc: "Beautiful gift wrapping.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-pink-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">
            Why Us
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Why Choose The Flower Shop
          </h2>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-[32px] bg-white p-8 text-center shadow-lg"
              >
                <div className="mb-5 flex justify-center">

                  <Icon
                    size={40}
                    className="text-pink-600"
                  />

                </div>

                <h3 className="text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-gray-600">
                  {item.desc}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}