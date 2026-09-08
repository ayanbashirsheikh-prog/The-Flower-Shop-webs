import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import { loginSuccess } from "../../redux/slices/authSlice";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    // =================================================
    // VALIDATION
    // =================================================

    if (!email || !password) {
      toast.error(
        "Please enter your email and password"
      );
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // LOGIN
      // =================================================

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const responseUser =
        response?.data?.user;

      if (!responseUser) {
        throw new Error(
          "User information was not received"
        );
      }

      // =================================================
      // VERIFY CURRENT SESSION
      // =================================================

      const meResponse = await axios.get(
        `${API_URL}/api/auth/me`,
        {
          withCredentials: true,
        }
      );

      const authenticatedUser =
        meResponse?.data?.user ||
        responseUser;

      // =================================================
      // REDUX
      // =================================================

      /*
        The backend now authenticates using an
        HTTP-only cookie.

        We don't need to save the JWT in localStorage.
      */

      dispatch(
        loginSuccess({
          user: authenticatedUser,

          /*
            Kept temporarily for compatibility
            with the current Redux slice.

            The actual authentication is handled
            by the HTTP-only cookie.
          */
          token: response?.data?.token || null,
        })
      );

      // =================================================
      // USER DATA
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(
          authenticatedUser
        )
      );

      /*
        IMPORTANT:
        Do NOT store JWT in localStorage.
      */

      localStorage.removeItem(
        "token"
      );

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      toast.success(
        `Welcome back, ${
          authenticatedUser?.name ||
          "there"
        }!`
      );

      // =================================================
      // ROLE BASED REDIRECT
      // =================================================

      if (
        authenticatedUser?.role ===
        "admin"
      ) {
        navigate("/admin", {
          replace: true,
        });

        return;
      }

      if (
        authenticatedUser?.role ===
        "supplier"
      ) {
        navigate("/supplier", {
          replace: true,
        });

        return;
      }

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      const status =
        error?.response?.status;

      const message =
        error?.response?.data
          ?.message ||
        "Unable to login. Please try again.";

      if (status === 401) {
        toast.error(
          "Invalid email or password"
        );
      } else if (status === 403) {
        toast.error(message);
      } else {
        toast.error(message);
      }
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
        bg-[#fffafa]
        px-4
        py-12
      "
    >
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-20
          h-80
          w-80
          rounded-full
          bg-pink-300/30
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-10
          h-96
          w-96
          rounded-full
          bg-rose-300/30
          blur-[140px]
        "
      />

      {/* =================================================
          LOGIN CARD
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
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
        "
      >
        <div
          className="
            rounded-[36px]
            border
            border-white/70
            bg-white/85
            p-8
            shadow-[0_30px_80px_rgba(190,24,93,0.15)]
            backdrop-blur-2xl
            sm:p-10
          "
        >
          {/* =================================================
              LOGO
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
                duration: 0.5,
              }}
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-pink-500
                to-rose-600
                text-4xl
                text-white
                shadow-xl
                shadow-pink-300/40
              "
            >
              🌸
            </motion.div>

            <h1
              className="
                mt-6
                text-4xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              Welcome Back
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Sign in to your Flower Shop
              account
            </p>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >
            {/* =================================================
                EMAIL
            ================================================= */}

            <div>
              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Email Address
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
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    pl-12
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-pink-400
                    focus:ring-4
                    focus:ring-pink-100
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                  "
                />
              </div>
            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>
              <label
                htmlFor="password"
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
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    pl-12
                    pr-12
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-pink-400
                    focus:ring-4
                    focus:ring-pink-100
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                  "
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    transition
                    hover:text-pink-600
                    disabled:cursor-not-allowed
                  "
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-pink-600
                to-rose-600
                font-semibold
                text-white
                shadow-lg
                shadow-pink-300/30
                transition
                hover:-translate-y-0.5
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <span
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />

                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <ArrowRight
                    size={18}
                    className="
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </>
              )}
            </button>
          </form>

          {/* =================================================
              SECURITY NOTE
          ================================================= */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
              text-xs
              text-slate-400
            "
          >
            <ShieldCheck
              size={15}
              className="text-emerald-500"
            />

            <span>
              Your account is securely
              protected
            </span>
          </div>

          {/* =================================================
              REGISTER
          ================================================= */}

          <p
            className="
              mt-7
              text-center
              text-sm
              text-slate-500
            "
          >
            Don't have an account?

            <Link
              to="/register"
              className="
                ml-2
                font-semibold
                text-pink-600
                transition
                hover:text-pink-700
              "
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}