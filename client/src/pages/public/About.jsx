import {
  ArrowRight,
  Flower2,
  Heart,
  Leaf,
  Sparkles,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="min-h-screen bg-[#fffaf8] text-slate-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          <div className="relative z-10">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm">
              <Flower2 size={16} />
              Our Story
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Flowers that
              <span className="block font-serif font-normal italic text-pink-600">
                speak from the heart.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              At The Flower Shop, we believe flowers are more than
              beautiful arrangements. They are a way to celebrate,
              comfort, appreciate and create unforgettable moments.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-bold text-white shadow-xl transition hover:bg-pink-600"
              >
                Explore Flowers
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-800 transition hover:border-pink-300 hover:text-pink-600"
              >
                Talk to us
              </Link>

            </div>

          </div>

          {/* IMAGE */}

          <div className="relative">

            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-pink-200/40 to-rose-200/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85"
                alt="Beautiful flowers"
                className="h-[560px] w-full rounded-[2rem] object-cover"
              />

              <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                    <Heart size={21} fill="currentColor" />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      Made with love
                    </p>

                    <p className="text-sm text-slate-500">
                      Fresh flowers. Beautiful moments.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="border-y border-slate-100 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">
              What we believe
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              The little things matter.
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              Every bouquet is created with attention to detail,
              from the flowers we choose to the way your order
              reaches your door.
            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <ValueCard
              icon={Leaf}
              title="Freshness First"
              text="We believe beautiful flowers should feel as fresh as the moment they were picked."
            />

            <ValueCard
              icon={Heart}
              title="Made With Love"
              text="Every arrangement is thoughtfully designed to make your special moments even more meaningful."
            />

            <ValueCard
              icon={Sparkles}
              title="Beautifully Crafted"
              text="From elegant bouquets to thoughtful details, we focus on creating an experience worth remembering."
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          STORY
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div className="overflow-hidden rounded-[2rem]">

            <img
              src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85"
              alt="Flower arrangement"
              className="h-[520px] w-full object-cover transition duration-700 hover:scale-105"
            />

          </div>

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">
              Why The Flower Shop
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              A flower for every
              <span className="font-serif font-normal italic text-pink-600">
                {" "}feeling.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Whether you're celebrating a birthday, anniversary,
              new beginning or simply want to remind someone that
              you're thinking about them, flowers have a special
              way of saying what words sometimes cannot.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Our goal is simple — make premium flowers accessible,
              beautifully presented and easy to send to the people
              who matter most.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">

              <div>
                <p className="text-3xl font-bold text-slate-950">
                  100%
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Thoughtfully arranged
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-950">
                  24/7
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Online ordering
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SERVICE STRIP
      ===================================================== */}

      <section className="bg-slate-950 text-white">

        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:grid-cols-3 lg:px-8">

          <ServiceItem
            icon={Flower2}
            title="Premium Flowers"
            text="Beautiful arrangements for every occasion."
          />

          <ServiceItem
            icon={Truck}
            title="Reliable Delivery"
            text="Carefully packed and delivered to your doorstep."
          />

          <ServiceItem
            icon={Heart}
            title="Made For Moments"
            text="Because every special moment deserves flowers."
          />

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-pink-600 to-rose-500 px-8 py-16 text-center text-white shadow-2xl sm:px-16">

          <Sparkles className="mx-auto mb-5" size={28} />

          <h2 className="text-4xl font-bold sm:text-5xl">
            Ready to make someone smile?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-pink-100">
            Explore our collection of beautiful flowers and
            find the perfect arrangement for your special moment.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-pink-600 transition hover:bg-pink-50"
          >
            Shop Flowers
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </main>
  );
}

function ValueCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="group rounded-3xl border border-slate-100 bg-[#fffaf8] p-8 transition duration-300 hover:-translate-y-1 hover:border-pink-100 hover:shadow-xl">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
        <Icon size={24} />
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-500">
        {text}
      </p>

    </div>
  );
}

function ServiceItem({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-pink-300">
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-bold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {text}
        </p>
      </div>

    </div>
  );
}