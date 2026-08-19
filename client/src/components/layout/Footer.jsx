import { Link } from "react-router-dom";

import {
  Instagram,
  Mail,
  Heart,
  Flower2,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Logo */}

          <div>
            <div className="flex items-center gap-3">

              <Flower2
                size={32}
                className="text-pink-500"
              />

              <h2 className="text-3xl font-bold text-pink-500">
                The Flower Shop
              </h2>

            </div>

            <p className="mt-4 text-gray-400">
              Luxury flowers for every special moment.
            </p>

            <div className="mt-6 flex gap-4">

              <button className="rounded-full bg-white/10 p-3 hover:bg-pink-600">
                <Instagram size={20} />
              </button>

              <button className="rounded-full bg-white/10 p-3 hover:bg-pink-600">
                <Mail size={20} />
              </button>

            </div>
          </div>

          {/* Links */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <Link to="/">Home</Link>

              <Link to="/shop">Shop</Link>

              <Link to="/about">About</Link>

              <Link to="/contact">Contact</Link>

            </div>

          </div>

          {/* Support */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Support
            </h3>

            <p className="text-gray-400">
              +91 9876543210
            </p>

            <p className="text-gray-400">
              support@flowershop.com
            </p>

            <p className="text-gray-400">
              Mumbai, India
            </p>

          </div>

          {/* Newsletter */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Newsletter
            </h3>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-700 bg-slate-900 px-4 py-3 outline-none"
            />

            <button className="mt-4 w-full rounded-xl bg-pink-600 py-3 font-semibold hover:bg-pink-700">
              Subscribe
            </button>

          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-gray-500">

          <p className="flex items-center justify-center gap-2">
            Made with
            <Heart
              size={16}
              className="text-pink-500"
            />
            by The Flower Shop
          </p>

        </div>

      </div>
    </footer>
  );
}