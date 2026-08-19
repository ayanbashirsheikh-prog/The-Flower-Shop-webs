import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import {
  removeFromWishlist,
  clearWishlist,
  selectWishlistItems,
} from "../../redux/slices/wishlistSlice";

import { addToCart } from "../../redux/slices/cartSlice";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector(
    selectWishlistItems
  );

  const handleRemove = (product) => {
    dispatch(
      removeFromWishlist(product.id)
    );

    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        ...product,
        id: product.id,
      })
    );

    toast.success(
      `${product.name} added to cart 🛍️`
    );
  };

  const handleClear = () => {
    if (!wishlistItems.length) return;

    dispatch(clearWishlist());

    toast.success("Wishlist cleared");
  };

  // ==========================================
  // EMPTY WISHLIST
  // ==========================================

  if (wishlistItems.length === 0) {
    return (
      <section className="min-h-[80vh] bg-gradient-to-br from-rose-50 via-white to-pink-50 px-6 py-16">

        <div className="mx-auto flex min-h-[65vh] max-w-5xl items-center justify-center">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="w-full max-w-xl rounded-[40px] border border-white/70 bg-white/80 p-10 text-center shadow-[0_30px_80px_rgba(244,114,182,0.15)] backdrop-blur-xl sm:p-14"
          >

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-rose-100"
            >
              <Heart
                size={42}
                strokeWidth={1.5}
                className="text-pink-500"
              />
            </motion.div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-pink-500">
              <Sparkles size={15} />
              Your Collection
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Your wishlist is waiting
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-500">
              Save the flowers you love and
              keep your favourites together
              for your next beautiful moment.
            </p>

            <button
              onClick={() =>
                navigate("/shop")
              }
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 px-8 py-4 font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              Explore Flowers
              <ArrowRight size={18} />
            </button>

          </motion.div>

        </div>

      </section>
    );
  }

  // ==========================================
  // WISHLIST
  // ==========================================

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-pink-500">
              <Heart size={16} />
              My Collection
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Wishlist
            </h1>

            <p className="mt-2 text-slate-500">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1
                ? "favourite"
                : "favourites"}{" "}
              saved for later.
            </p>

          </div>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 self-start rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 sm:self-auto"
          >
            <Trash2 size={16} />
            Clear Wishlist
          </button>

        </div>

        {/* PRODUCTS */}

        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >

          <AnimatePresence mode="popLayout">

            {wishlistItems.map(
              (product, index) => (
                <motion.article
                  key={product.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="group overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.07)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(244,114,182,0.15)]"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-[4/5] overflow-hidden bg-rose-50">

                    <Link
                      to={`/product/${product.id}`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </Link>

                    {/* Wishlist */}

                    <button
                      onClick={() =>
                        handleRemove(product)
                      }
                      aria-label="Remove from wishlist"
                      className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/85 text-pink-600 shadow-lg backdrop-blur-md transition hover:scale-110"
                    >
                      <Heart
                        size={19}
                        fill="currentColor"
                      />
                    </button>

                    {/* Badge */}

                    <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-md">
                      Saved
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    <Link
                      to={`/product/${product.id}`}
                    >
                      <h2 className="line-clamp-1 text-lg font-bold text-slate-900 transition group-hover:text-pink-600">
                        {product.name}
                      </h2>
                    </Link>

                    {product.category && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {product.category}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-xl font-bold text-slate-900">
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      <button
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white transition hover:scale-110 hover:bg-pink-600"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag
                          size={18}
                        />
                      </button>

                    </div>

                  </div>

                </motion.article>
              )
            )}

          </AnimatePresence>

        </motion.div>

        {/* BOTTOM CTA */}

        <div className="mt-14 flex justify-center">

          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:text-pink-600"
          >
            Continue Shopping
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>

      </div>

    </section>
  );
}