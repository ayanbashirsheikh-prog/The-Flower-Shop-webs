import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  ArrowRight,
  Instagram,
  MessageCircle,
  Send,
  Flower2,
} from "lucide-react";

import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#fffaf8]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-pink-600/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-pink-300 backdrop-blur">
              <Flower2 size={16} />
              We'd love to hear from you
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Let's talk about
              <span className="block font-serif font-normal italic text-pink-400">
                flowers & moments.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Have a question about an order, need help choosing
              flowers, or simply want to say hello? Our team is
              always happy to help.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">

          {/* LEFT */}

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">
              Contact information
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-950">
              We're here for you.
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              Reach out to us through any of the channels below.
              We'll get back to you as soon as possible.
            </p>

            <div className="mt-10 space-y-4">

              <ContactCard
                icon={Phone}
                title="Call us"
                value="+91 98765 43210"
                subtitle="Mon – Sat, 9:00 AM – 7:00 PM"
              />

              <ContactCard
                icon={Mail}
                title="Email us"
                value="hello@theflowershop.com"
                subtitle="We usually reply within 24 hours"
              />

              <ContactCard
                icon={MapPin}
                title="Visit us"
                value="Mumbai, Maharashtra"
                subtitle="India"
              />

              <ContactCard
                icon={Clock3}
                title="Business hours"
                value="Monday – Saturday"
                subtitle="9:00 AM – 7:00 PM"
              />

            </div>

            {/* SOCIAL */}

            <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white">

              <p className="text-sm font-semibold text-slate-400">
                Follow The Flower Shop
              </p>

              <div className="mt-4 flex gap-3">

                <SocialButton icon={Instagram} />

                <SocialButton icon={MessageCircle} />

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl sm:p-10">

            <div className="mb-8">

              <h2 className="text-2xl font-bold text-slate-950">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill out the form and our team will get back to you.
              </p>

            </div>

            {submitted && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
                🌸 Thank you! Your message has been received.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <Input
                  label="Your name"
                  name="name"
                  placeholder="Ayan"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <Input
                label="Subject"
                name="subject"
                placeholder="How can we help?"
                value={form.subject}
                onChange={handleChange}
                required
              />

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message
                </label>

                <textarea
                  name="message"
                  rows={6}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
                />

              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-700"
              >
                Send Message
                <Send
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* =====================================================
          FAQ / SUPPORT
      ===================================================== */}

      <section className="border-y border-slate-100 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="grid gap-10 md:grid-cols-3">

            <SupportCard
              title="Order Help"
              text="Need help with an existing order? Keep your order details ready and contact our support team."
            />

            <SupportCard
              title="Flower Selection"
              text="Not sure which flowers to choose? Tell us the occasion and we'll help you find something special."
            />

            <SupportCard
              title="Delivery Questions"
              text="Have questions about delivery timing or locations? Our team is happy to assist."
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-to-r from-pink-600 to-rose-500 px-8 py-14 text-center text-white shadow-2xl sm:px-16">

          <h2 className="text-3xl font-bold sm:text-4xl">
            Looking for the perfect bouquet?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-pink-100">
            Explore our collection and find something beautiful
            for someone special.
          </p>

          <a
            href="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-pink-600 transition hover:bg-pink-50"
          >
            Explore Collection
            <ArrowRight size={18} />
          </a>

        </div>

      </section>

    </main>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-pink-100 hover:shadow-lg">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
        <Icon size={20} />
      </div>

      <div className="min-w-0">

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <p className="mt-1 truncate font-bold text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>

      </div>

    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
      />

    </div>
  );
}

function SocialButton({
  icon: Icon,
}) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-pink-600"
    >
      <Icon size={19} />
    </button>
  );
}

function SupportCard({
  title,
  text,
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-[#fffaf8] p-7">

      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-500">
        {text}
      </p>

    </div>
  );
}