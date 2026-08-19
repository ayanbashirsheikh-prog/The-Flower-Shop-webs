import {
  Truck,
  Flower2,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    title: "Same Day Delivery",
    description: "Selected locations",
  },
  {
    icon: Flower2,
    title: "Fresh Flowers",
    description: "Hand-picked with care",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "100% secure checkout",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Here whenever you need",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-100 px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-10">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4 px-5 py-6 lg:px-7"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                <Icon size={20} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}