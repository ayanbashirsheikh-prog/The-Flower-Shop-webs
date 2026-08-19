import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

import navLinks from "./navLinks";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl p-2 transition hover:bg-pink-100"
      >
        <Menu size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] bg-black/40">

          <div className="absolute right-0 top-0 h-screen w-72 bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b p-5">

              <h2 className="text-xl font-bold text-pink-600">
                🌸 The Flower Shop
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={22} />
              </button>

            </div>

            {/* Links */}

            <nav className="flex flex-col p-5">

              {navLinks.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-medium transition ${
                      isActive
                        ? "bg-pink-100 text-pink-600"
                        : "hover:bg-pink-50 hover:text-pink-600"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}

            </nav>

          </div>

        </div>
      )}
    </>
  );
}