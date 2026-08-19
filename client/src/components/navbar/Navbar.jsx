import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Truck,
} from "lucide-react";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import SearchBar from "./SearchBar";
import NavActions from "./NavActions";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <div className="relative z-50">

      {/* ================================
          ANNOUNCEMENT BAR
      ================================= */}

      <div className="hidden bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white sm:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-7 px-4 text-[11px] font-medium tracking-[0.08em]">

          <span className="flex items-center gap-2">
            <Sparkles size={13} />
            Handcrafted with Love
          </span>

          <span className="h-3 w-px bg-white/30" />

          <span className="flex items-center gap-2">
            <Truck size={13} />
            Same Day Delivery
          </span>

          <span className="h-3 w-px bg-white/30" />

          <span className="flex items-center gap-2">
            <Heart size={13} />
            Made Fresh for You
          </span>

        </div>
      </div>

      {/* ================================
          NAVBAR
      ================================= */}

      <header
        className={`
          sticky top-0 z-50
          border-b
          transition-all duration-500
          ${
            scrolled
              ? "border-pink-100 bg-white/95 shadow-xl shadow-pink-100/20 backdrop-blur-2xl"
              : "border-white/50 bg-white/85 backdrop-blur-xl"
          }
        `}
      >

        {/* Top shine */}

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />

        <div
          className={`
            mx-auto flex max-w-7xl items-center
            justify-between
            px-4 sm:px-6 lg:px-8
            transition-all duration-500
            ${
              scrolled
                ? "h-16"
                : "h-[76px]"
            }
          `}
        >

          {/* LEFT */}

          <div className="flex items-center gap-6 lg:gap-10">

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <Logo />
            </motion.div>

            <nav className="hidden lg:block">
              <DesktopMenu />
            </nav>

          </div>

          {/* CENTER */}

          <div className="hidden flex-1 px-8 lg:block xl:px-14">

            <div className="mx-auto max-w-xl">
              <SearchBar />
            </div>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-1 sm:gap-2">

            <div className="hidden md:flex">
              <NavActions />
            </div>

            <div className="lg:hidden">
              <MobileMenu />
            </div>

          </div>

        </div>

        {/* MOBILE SEARCH */}

        <div className="border-t border-pink-100/70 bg-white/75 px-4 py-3 backdrop-blur-xl lg:hidden">
          <SearchBar />
        </div>

        {/* Bottom glow */}

        <div className="absolute bottom-0 left-1/2 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-300/60 to-transparent" />

      </header>
    </div>
  );
}

