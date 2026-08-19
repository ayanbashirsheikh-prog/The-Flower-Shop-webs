import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <h2 className="text-3xl font-bold text-pink-500">
            🌸 The Flower Shop
          </h2>

          <p className="mt-4 text-gray-400">
            Luxury flowers for every special moment.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Quick Links</h3>

          <div className="space-y-2 text-gray-400">
            <Link to="/">Home</Link>
            <br />
            <Link to="/shop">Shop</Link>
            <br />
            <Link to="/about">About</Link>
            <br />
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Support</h3>

          <p className="text-gray-400">+91 9876543210</p>
          <p className="text-gray-400">support@flowershop.com</p>
        </div>

        <div>
          <h3 className="mb-4 font-bold">Follow Us</h3>

          <div className="flex gap-4">
            <Instagram />
            <Facebook />
            <Twitter />
            <Mail />
          </div>
        </div>
      </div>
    </footer>
  );
}