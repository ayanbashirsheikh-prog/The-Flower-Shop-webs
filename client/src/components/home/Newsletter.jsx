import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const handleSubmit = (event) => {
    event.preventDefault();

    toast.success("Thank you for subscribing!");
  };

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-pink-600 px-6 py-16 text-center text-white md:px-16">

        <div className="mx-auto max-w-2xl">
          <Mail className="mx-auto mb-5" size={36} />

          <h2 className="text-3xl font-bold md:text-4xl">
            Flowers, stories & special offers
          </h2>

          <p className="mt-4 text-pink-100">
            Subscribe to receive beautiful inspiration, new collections and
            exclusive offers.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 rounded-full border-0 px-5 py-3 text-gray-900 outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-semibold transition hover:bg-gray-800"
            >
              Subscribe

              <ArrowRight size={18} />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}