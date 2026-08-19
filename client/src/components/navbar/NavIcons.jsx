import { Heart, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

import CartDrawer from "@/components/cart/CartDrawer";

export default function NavActions() {
  const [openCart, setOpenCart] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">

        <button className="rounded-full p-2 hover:bg-pink-100">
          <Heart size={20} />
        </button>

        <button
          onClick={() => setOpenCart(true)}
          className="relative rounded-full p-2 hover:bg-pink-100"
        >
          <ShoppingCart size={20} />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-xs text-white">
            2
          </span>
        </button>

        <button className="rounded-full p-2 hover:bg-pink-100">
          <User size={20} />
        </button>

      </div>

      <CartDrawer open={openCart} setOpen={setOpenCart} />
    </>
  );
}