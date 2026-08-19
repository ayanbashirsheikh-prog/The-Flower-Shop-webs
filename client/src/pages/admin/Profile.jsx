import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Edit3,
  Save,
  X,
  LogOut,
  Camera,
  Crown,
  CalendarDays,
  Package,
  Heart,
  ShoppingBag,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

/* =========================================================
   PROFILE PAGE
========================================================= */

export default function Profile() {
  const navigate = useNavigate();

  const savedUser = useMemo(() => {
    try {
      const user = localStorage.getItem("user");

      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }, []);

  const [user, setUser] = useState(
    savedUser || {
      name: "Ayan",
      email: "admin@theflowershop.com",
      phone: "",
      role: "admin",
    }
  );

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  /* =====================================================
     EDIT PROFILE
  ===================================================== */

  const handleEdit = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setIsEditing(true);
    setMessage("");
  };

  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setIsEditing(false);
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setIsEditing(false);

    setMessage("Profile updated successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  /* =====================================================
     PASSWORD
  ===================================================== */

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setMessage(
        "Please fill all password fields."
      );

      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setMessage(
        "New password and confirmation do not match."
      );

      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage(
        "Password must contain at least 6 characters."
      );

      return;
    }

    /*
      IMPORTANT:
      This is currently frontend UI only.
      Connect this form to your backend password
      change API when that endpoint is ready.
    */

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setMessage(
      "Password request submitted successfully."
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* =====================================================
     ROLE
  ===================================================== */

  const role =
    user?.role?.toLowerCase() === "admin"
      ? "Administrator"
      : user?.role || "Customer";

  /* =====================================================
     JOIN DATE
  ===================================================== */

  const joinDate = "August 2026";

  return (
    <div className="min-h-screen bg-[#f8f8fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles
                size={17}
                className="text-pink-500"
              />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
                Account Center
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your personal information,
              account security and administrator
              preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Edit3 size={17} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            SUCCESS / INFO MESSAGE
        ================================================= */}

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={19} />
            {message}
          </div>
        )}

        {/* =================================================
            PROFILE HERO
        ================================================= */}

        <section className="relative mb-6 overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-sm">

          {/* Background decoration */}

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-pink-100/60 blur-3xl" />

          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-rose-100/50 blur-3xl" />

          <div className="relative p-6 sm:p-8">

            <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

              {/* Avatar */}

              <div className="flex flex-col items-center gap-5 sm:flex-row">

                <div className="relative">

                  <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 text-4xl font-bold text-white shadow-xl shadow-pink-200">
                    {user?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "A"}
                  </div>

                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-lg transition hover:bg-pink-600"
                    title="Change profile photo"
                  >
                    <Camera size={17} />
                  </button>

                </div>

                <div className="text-center sm:text-left">

                  <div className="flex flex-col items-center gap-2 sm:flex-row">

                    <h2 className="text-2xl font-bold text-slate-900">
                      {user?.name || "Admin"}
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600">
                      <Crown size={13} />
                      {role}
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {user?.email}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 sm:justify-start">

                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      Joined {joinDate}
                    </span>

                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Account Active
                    </span>

                  </div>

                </div>

              </div>

              {/* Security badge */}

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 md:min-w-[220px]">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Secure Account
                    </p>

                    <p className="mt-0.5 text-xs text-emerald-600">
                      Protection enabled
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <ProfileStat
            icon={ShoppingBag}
            label="Orders"
            value="245"
          />

          <ProfileStat
            icon={Package}
            label="Products"
            value="68"
          />

          <ProfileStat
            icon={Heart}
            label="Wishlist"
            value="12"
          />

          <ProfileStat
            icon={ShieldCheck}
            label="Security"
            value="Strong"
          />

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7 flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Your basic account information
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <User size={21} />
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Full Name"
                icon={User}
                value={form.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <InputField
                label="Email Address"
                icon={Mail}
                value={form.email}
                disabled={!isEditing}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              <InputField
                label="Phone Number"
                icon={Phone}
                value={form.phone}
                placeholder="+91 XXXXX XXXXX"
                disabled={!isEditing}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />

              <InputField
                label="Account Role"
                icon={ShieldCheck}
                value={role}
                disabled
              />

            </div>

            <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50/50 p-4">

              <div className="flex gap-3">

                <div className="mt-0.5 text-pink-600">
                  <Sparkles size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Your information is private
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Personal account details are only
                    visible to authorized administrators
                    and are securely stored.
                  </p>
                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              SECURITY
          ================================================= */}

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7 flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Security
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Keep your account protected
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Lock size={20} />
              </div>

            </div>

            <form
              onSubmit={handlePasswordChange}
              className="space-y-5"
            >

              <PasswordField
                label="Current Password"
                value={
                  passwordForm.currentPassword
                }
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword:
                      e.target.value,
                  })
                }
                show={showPassword}
                onToggle={() =>
                  setShowPassword(!showPassword)
                }
              />

              <PasswordField
                label="New Password"
                value={
                  passwordForm.newPassword
                }
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword:
                      e.target.value,
                  })
                }
                show={showPassword}
                onToggle={() =>
                  setShowPassword(!showPassword)
                }
              />

              <PasswordField
                label="Confirm New Password"
                value={
                  passwordForm.confirmPassword
                }
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword:
                      e.target.value,
                  })
                }
                show={showPassword}
                onToggle={() =>
                  setShowPassword(!showPassword)
                }
              />

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                <Lock size={17} />
                Update Password
              </button>

            </form>

          </section>

        </div>

        {/* =================================================
            ADMIN ACCESS
        ================================================= */}

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600">
                <Crown size={22} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Administrator Access
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Your account currently has administrator
                  privileges. You can manage products,
                  orders, customers and store settings.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600">
              <CheckCircle2 size={15} />
              Admin Verified
            </div>

          </div>

        </section>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <section className="mt-6 rounded-[2rem] border border-red-100 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h3 className="font-bold text-slate-900">
                Sign out of your account
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                End your current administrator session.
              </p>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="py-8 text-center text-xs text-slate-400">
          <p>
            🌸 The Flower Shop · Administrator Profile
          </p>
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   PROFILE STAT
========================================================= */

function ProfileStat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/50">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
          <Icon size={19} />
        </div>

      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  icon: Icon,
  value,
  onChange,
  disabled = false,
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <div className="relative">

        <Icon
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-2xl border py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition ${
            disabled
              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-500"
              : "border-slate-200 bg-white text-slate-800 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          }`}
        />

      </div>
    </div>
  );
}

/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <div className="relative">

        <Lock
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {show ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>

      </div>
    </div>
  );
}