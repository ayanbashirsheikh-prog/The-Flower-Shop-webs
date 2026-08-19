import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import storyImage from "@/assets/images/home/brand-story.jpg";

export default function BrandStory() {
  return (
    <section className="overflow-hidden bg-[#fffaf9] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Image */}
          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative"
          >
            <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full border border-pink-200" />

            <img
              src={storyImage}
              alt="Beautiful flower arrangement"
              className="relative z-10 h-[500px] w-full rounded-[2rem] object-cover shadow-2xl"
            />

            <div className="absolute -bottom-6 -right-6 z-20 rounded-2xl bg-white p-6 shadow-xl">
              <p className="text-3xl font-bold text-pink-600">
                10K+
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Happy Customers
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">
              The Flower Shop
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              More than flowers.
              <span className="block text-pink-600">
                We deliver emotions.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Every bouquet tells a story. From a simple “I love you” to
              unforgettable celebrations, we carefully create floral
              arrangements that make every moment feel extraordinary.
            </p>

            <p className="mt-5 leading-7 text-gray-500">
              Our flowers are carefully selected, beautifully arranged, and
              delivered with the attention your special moments deserve.
            </p>

            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
            >
              Discover Our Story

              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}