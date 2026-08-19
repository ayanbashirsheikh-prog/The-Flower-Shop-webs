import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/images/hero/hero.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fff8fa]">
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-pink-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-rose-100/50 blur-3xl" />

      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="max-w-xl"
          >
            {/* EYEBROW */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm backdrop-blur">
              <Sparkles size={15} />

              Premium Flower Collection
            </div>

            {/* HEADING */}

            <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Fresh flowers,

              <span className="mt-2 block text-pink-600">
                beautifully delivered.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-7 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Thoughtfully designed bouquets made with the freshest flowers
              for the moments that matter most.
            </p>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="mt-9 flex flex-wrap items-center gap-4">

              {/* SHOP FLOWERS */}

              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 rounded-full bg-slate-950 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-pink-600 hover:shadow-xl hover:shadow-pink-200"
              >
                Shop Flowers

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* EXPLORE COLLECTION */}

              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-800 transition-all duration-300 hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600"
              >
                Explore Collection

                <ChevronRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>

            {/* =================================================
                MINI BENEFITS
            ================================================= */}

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-pink-100 pt-6">

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock3
                  size={17}
                  className="text-pink-600"
                />

                Same-day delivery
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Heart
                  size={17}
                  className="text-pink-600"
                />

                Made with love
              </div>

            </div>
          </motion.div>

          {/* =================================================
              RIGHT IMAGE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="relative"
          >
            {/* MAIN IMAGE */}

            <div className="relative mx-auto max-w-[620px]">

              <div className="absolute -inset-4 rounded-[3rem] bg-pink-200/30 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-2xl shadow-pink-100">

                <img
                  src={heroImage}
                  alt="Luxury flower bouquet"
                  className="aspect-[4/4.5] w-full rounded-[2rem] object-cover"
                />

              </div>

              {/* =================================================
                  RATING CARD
              ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                }}
                className="absolute -left-4 bottom-12 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-left-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                  <Star
                    size={18}
                    className="fill-pink-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    4.9/5 Rating
                  </p>

                  <p className="text-xs text-slate-500">
                    Loved by customers
                  </p>
                </div>
              </motion.div>

              {/* =================================================
                  DELIVERY CARD
              ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: -15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 1,
                  duration: 0.5,
                }}
                className="absolute -right-3 top-12 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-right-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Clock3 size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Fresh & Fast
                  </p>

                  <p className="text-xs text-slate-500">
                    Delivered with care
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}