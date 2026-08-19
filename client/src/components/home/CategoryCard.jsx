import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={category.path || `/shop?category=${category.slug}`}
        className="group relative block h-[390px] overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-100"
      >
        {/* IMAGE */}
        <img
          src={category.image}
          alt={category.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* DARK GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/85" />

        {/* SOFT HOVER OVERLAY */}
        <div className="absolute inset-0 bg-pink-500/0 transition-colors duration-500 group-hover:bg-pink-500/10" />

        {/* TOP CATEGORY LABEL */}
        <div className="absolute left-5 top-5">
          <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            Collection
          </span>
        </div>

        {/* CONTENT */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-end justify-between gap-4">
            {/* TEXT */}
            <div className="max-w-[210px]">
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {category.title}
              </h3>

              <p className="mt-2 text-sm leading-5 text-white/75">
                {category.description}
              </p>
            </div>

            {/* ARROW */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 transition-all duration-300 group-hover:rotate-45 group-hover:bg-pink-600 group-hover:text-white">
              <ArrowUpRight size={19} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}