import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";

import occasionImage from "@/assets/images/home/occasion-banner.jpg";

export default function OccasionBanner() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative min-h-[420px] overflow-hidden rounded-[2rem]"
        >
          <img
            src={occasionImage}
            alt="Special occasion flowers"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

          <div className="relative flex min-h-[420px] max-w-xl flex-col justify-center px-8 py-12 text-white md:px-16">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Gift size={22} />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-200">
              Make Every Moment Special
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Say it with flowers.
            </h2>

            <p className="mt-5 leading-7 text-white/80">
              Find the perfect bouquet for birthdays, anniversaries,
              celebrations and every beautiful moment in between.
            </p>

            <Link
              to="/shop"
              className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-pink-600 hover:text-white"
            >
              Explore Flowers

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}