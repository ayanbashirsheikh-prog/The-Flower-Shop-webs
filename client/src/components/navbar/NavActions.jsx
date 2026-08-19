import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NavActions() {
  /* =====================================================
     CART
  ===================================================== */

  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0),
    0
  );

  /* =====================================================
     WISHLIST
  ===================================================== */

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items || []
  );

  const wishlistCount = wishlistItems.length;

  /* =====================================================
     AUTH
  ===================================================== */

  const user = useSelector(
    (state) => state.auth?.user
  );

  /* =====================================================
     ICON BUTTON
  ===================================================== */

  const iconButton =
    "group relative flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition-all duration-300 hover:bg-pink-50 hover:text-pink-600";

  return (
    <div className="flex items-center gap-2">

      {/* =================================================
          WISHLIST
      ================================================= */}

      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.94 }}
      >
        <Link
          to="/wishlist"
          aria-label="Wishlist"
          className={iconButton}
        >
          <Heart
            size={20}
            strokeWidth={1.8}
            className="transition-all duration-300 group-hover:scale-110"
          />

          {/* Wishlist Badge */}

          {wishlistCount > 0 && (
            <motion.span
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 px-1 text-[10px] font-bold text-white shadow-md shadow-pink-300/40"
            >
              {wishlistCount > 99
                ? "99+"
                : wishlistCount}
            </motion.span>
          )}
        </Link>
      </motion.div>


      {/* =================================================
          ACCOUNT
      ================================================= */}

      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.94 }}
      >
        <Link
          to={user ? "/profile" : "/login"}
          aria-label="Account"
          className={iconButton}
        >
          <User
            size={20}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:scale-110"
          />

          {/* Logged-in indicator */}

          {user && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-emerald-500" />
          )}
        </Link>
      </motion.div>


      {/* =================================================
          DIVIDER
      ================================================= */}

      <div className="mx-1 hidden h-6 w-px bg-slate-200 md:block" />


      {/* =================================================
          CART
      ================================================= */}

      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.94 }}
      >
        <Link
          to="/cart"
          aria-label="Shopping cart"
          className="group relative flex h-11 items-center justify-center gap-2 rounded-full px-3 text-slate-700 transition-all duration-300 hover:bg-pink-50 hover:text-pink-600"
        >

          {/* Shopping Bag */}

          <div className="relative">

            <ShoppingBag
              size={21}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            {/* Cart Badge */}

            {cartCount > 0 && (
              <motion.span
                initial={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                }}
                className="absolute -right-2.5 -top-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 px-1 text-[10px] font-bold text-white shadow-md shadow-pink-300/40"
              >
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </motion.span>
            )}

          </div>

          {/* Cart text */}

          <span className="hidden text-sm font-semibold lg:inline">
            Cart
          </span>

        </Link>
      </motion.div>

    </div>
  );
}