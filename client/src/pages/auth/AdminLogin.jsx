import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Flower2,
  Loader2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

import { loginSuccess } from "../../redux/slices/authSlice";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  /* =================================================
     INPUT HANDLER
  ================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =================================================
     LOGIN
  ================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!form.password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: form.email.trim(),
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      /* =============================================
         CHECK ADMIN ROLE
      ============================================= */

      if (data.role !== "admin") {
        toast.error(
          "This account does not have admin access."
        );

        return;
      }

      /* =============================================
         SAVE AUTH
      ============================================= */

      dispatch(
        loginSuccess({
          user: {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
          token: data.token,
        })
      );

      toast.success(
        "Welcome back, Admin 🌸"
      );

      navigate("/admin", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to login. Please try again.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#faf7f8]
        px-5
        py-12
      "
    >

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-10
          h-96
          w-96
          rounded-full
          bg-pink-200/40
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-rose-200/30
          blur-[150px]
        "
      />

      {/* =================================================
          LOGIN CARD
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-[36px]
          border
          border-white
          bg-white/90
          p-8
          shadow-[0_30px_100px_rgba(15,23,42,0.12)]
          backdrop-blur-2xl
          sm:p-10
        "
      >

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="text-center">

          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: 0.15,
            }}
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-[26px]
              bg-gradient-to-br
              from-pink-500
              to-rose-600
              text-white
              shadow-xl
              shadow-pink-200
            "
          >
            <Flower2
              size={38}
              strokeWidth={1.5}
            />
          </motion.div>

          <div className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-pink-100
            bg-pink-50
            px-4
            py-2
            text-xs
            font-bold
            uppercase
            tracking-[0.18em]
            text-pink-600
          ">
            <ShieldCheck size={14} />

            Admin Portal
          </div>

          <h1
            className="
              mt-5
              text-4xl
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            Welcome back
          </h1>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            Sign in to manage
            <span className="font-semibold text-pink-600">
              {" "}The Flower Shop
            </span>
          </p>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="mt-9 space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label
              htmlFor="admin-email"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Admin Email
            </label>

            <div className="relative">

              <Mail
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50/70
                  pl-12
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  duration-300
                  placeholder:text-slate-400
                  focus:border-pink-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-pink-100
                "
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div>

            <label
              htmlFor="admin-password"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Password
            </label>

            <div className="relative">

              <Lock
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="admin-password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50/70
                  pl-12
                  pr-12
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  duration-300
                  placeholder:text-slate-400
                  focus:border-pink-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-pink-100
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  transition
                  hover:text-pink-600
                "
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{
              scale: loading ? 1 : 1.01,
            }}
            whileTap={{
              scale: loading ? 1 : 0.98,
            }}
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-pink-500
              to-rose-600
              font-bold
              text-white
              shadow-lg
              shadow-pink-200/60
              transition
              duration-300
              hover:shadow-xl
              hover:shadow-pink-300/60
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >

            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />

                Signing in...
              </>
            ) : (
              <>
                Enter Admin Panel

                <ArrowRight size={19} />
              </>
            )}

          </motion.button>

        </form>

        {/* =================================================
            BACK TO STORE
        ================================================= */}

        <div className="
          mt-8
          border-t
          border-slate-100
          pt-6
          text-center
        ">

          <Link
            to="/"
            className="
              text-sm
              font-semibold
              text-slate-500
              transition
              hover:text-pink-600
            "
          >
            ← Back to The Flower Shop
          </Link>

        </div>

      </motion.div>

    </main>
  );
}
