import { X } from "lucide-react";
import CartItem from "./CartItem";

export default function CartDrawer({ open, setOpen }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-screen w-[400px] bg-white shadow-2xl transition-all duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-5">

          <h2 className="text-2xl font-bold">
            My Cart 🛒
          </h2>

          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>

        </div>

        <div className="h-[70vh] overflow-y-auto p-5">
          <CartItem />
          <CartItem />
        </div>

        <div className="absolute bottom-0 w-full border-t bg-white p-5">

          <div className="mb-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹1998</span>
          </div>

          <button className="w-full rounded-2xl bg-pink-600 py-4 font-semibold text-white hover:bg-pink-700">
            Checkout
          </button>

        </div>
      </div>
    </>
  );
}