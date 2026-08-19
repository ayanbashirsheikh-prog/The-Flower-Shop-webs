import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  ShoppingBag,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Edit3,
  Camera,
  Clock3,
  CheckCircle2,
  LayoutDashboard,
  Bell,
  Megaphone,
  Lock,
  X,
  Save,
  Check,
} from "lucide-react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { clearCart } from "@/redux/slices/cartSlice";
import { loginSuccess, logout } from "@/redux/slices/authSlice";


// =====================================================
// PROFILE PAGE
// =====================================================

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =====================================================
  // AUTH DATA
  // =====================================================

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  });

  const token = localStorage.getItem("token");

  // =====================================================
  // MODALS
  // =====================================================

  const [editProfileOpen, setEditProfileOpen] =
    useState(false);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  // =====================================================
  // PROFILE FORM
  // =====================================================

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const [profileImage, setProfileImage] =
    useState(
      user?.profileImage || ""
    );

  // =====================================================
  // SETTINGS
  // =====================================================

  const [settings, setSettings] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          "accountSettings"
        );

      return saved
        ? JSON.parse(saved)
        : {
            orderUpdates: true,
            promotionalEmails: false,
            securityAlerts: true,
          };
    } catch {
      return {
        orderUpdates: true,
        promotionalEmails: false,
        securityAlerts: true,
      };
    }
  });

  // =====================================================
  // REDUX
  // =====================================================

  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items || []
  );

  // =====================================================
  // LOGIN CHECK
  // =====================================================

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  const isAdmin =
    String(user?.role || "").toLowerCase() ===
    "admin";

  // =====================================================
  // KEEP FORM IN SYNC
  // =====================================================

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });

    setProfileImage(
      user?.profileImage || ""
    );
  }, [user]);

  // =====================================================
  // USER INITIAL
  // =====================================================

  const initial =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() || "A";

  // =====================================================
  // OPEN EDIT PROFILE
  // =====================================================

  const handleOpenEditProfile = () => {
    setProfileForm({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });

    setEditProfileOpen(true);
  };

  // =====================================================
  // PROFILE FORM CHANGE
  // =====================================================

  const handleProfileChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      name:
        profileForm.name.trim() ||
        user.name,
      phone:
        profileForm.phone.trim(),
      address:
        profileForm.address.trim(),
      profileImage,
    };

    // Local state
    setUser(updatedUser);

    // Local storage
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    // Redux
    dispatch(
      loginSuccess({
        user: updatedUser,
        token,
      })
    );

    setEditProfileOpen(false);
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const handleProfileImage = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () => {
      const image =
        reader.result;

      setProfileImage(image);

      const updatedUser = {
        ...user,
        profileImage: image,
      };

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      dispatch(
        loginSuccess({
          user: updatedUser,
          token,
        })
      );
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // SETTINGS CHANGE
  // =====================================================

  const handleSettingChange = (
    settingName
  ) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        [settingName]:
          !prev[settingName],
      };

      localStorage.setItem(
        "accountSettings",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#fff8fb]">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden border-b border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100">

        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-rose-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            {/* USER */}

            <div className="flex items-center gap-6">

              {/* AVATAR */}

              <div className="group relative">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover shadow-xl ring-8 ring-white"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-4xl font-bold text-white shadow-xl shadow-pink-300/40 ring-8 ring-white">
                    {initial}
                  </div>
                )}

                {/* CAMERA */}

                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-white text-pink-600 shadow-md transition hover:bg-pink-600 hover:text-white"
                >
                  <Camera size={15} />
                </label>

                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleProfileImage
                  }
                />

              </div>

              {/* USER TEXT */}

              <div>

                <div className="mb-2 flex flex-wrap items-center gap-2">

                  <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-pink-600 shadow-sm backdrop-blur">

                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    Active Member

                  </span>

                  {isAdmin && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-3 py-1 text-xs font-semibold text-white shadow-sm">

                      <ShieldCheck size={13} />

                      Administrator

                    </span>
                  )}

                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">

                  Welcome,{" "}
                  {user.name?.split(" ")[0]} 🌸

                </h1>

                <p className="mt-2 text-gray-500">
                  Manage your account, orders and preferences.
                </p>

              </div>

            </div>

            {/* HERO ACTIONS */}

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* ADMIN */}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl"
                >

                  <LayoutDashboard
                    size={17}
                  />

                  Admin Dashboard

                  <ChevronRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />

                </Link>
              )}

              {/* EDIT */}

              <button
                type="button"
                onClick={
                  handleOpenEditProfile
                }
                className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-6 py-3 font-semibold text-pink-600 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-500 hover:bg-pink-600 hover:text-white hover:shadow-lg"
              >

                <Edit3 size={17} />

                Edit Profile

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* STATS */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value="0"
            subtitle="Your purchases"
          />

          <StatCard
            icon={Heart}
            title="Wishlist"
            value={
              wishlistItems.length
            }
            subtitle="Saved flowers"
          />

          <StatCard
            icon={Package}
            title="Cart Items"
            value={
              cartItems.length
            }
            subtitle="Ready to checkout"
          />

          <StatCard
            icon={Clock3}
            title="Pending"
            value="0"
            subtitle="Orders processing"
          />

        </div>

        {/* CONTENT */}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* LEFT */}

          <div className="space-y-8 lg:col-span-2">

            {/* PERSONAL INFO */}

            <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-[0_15px_50px_rgba(236,72,153,0.08)] md:p-8">

              <div className="mb-7 flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                    Account
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Personal Information
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={
                    handleOpenEditProfile
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 transition hover:bg-pink-600 hover:text-white"
                >
                  <Edit3 size={18} />
                </button>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <InfoBox
                  icon={User}
                  label="Full Name"
                  value={
                    user.name ||
                    "Not available"
                  }
                />

                <InfoBox
                  icon={Mail}
                  label="Email Address"
                  value={
                    user.email ||
                    "Not available"
                  }
                />

                <InfoBox
                  icon={Phone}
                  label="Phone Number"
                  value={
                    user.phone ||
                    "Not added"
                  }
                />

                <InfoBox
                  icon={MapPin}
                  label="Default Address"
                  value={
                    user.address ||
                    "No address saved"
                  }
                />

              </div>

            </section>

            {/* ORDERS */}

            <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-[0_15px_50px_rgba(236,72,153,0.08)] md:p-8">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                    Shopping
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Recent Orders
                  </h2>

                </div>

                <Link
                  to="/track-order"
                  className="text-sm font-semibold text-pink-600 hover:text-pink-800"
                >
                  View All
                </Link>

              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-pink-50/40 px-6 py-12 text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-pink-500 shadow-sm">
                  <Package size={28} />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  No orders yet
                </h3>

                <p className="mt-2 max-w-md text-sm text-gray-500">
                  Your beautiful flower orders will appear here once you make your first purchase.
                </p>

                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-700"
                >
                  Explore Flowers
                  <ChevronRight size={16} />
                </Link>

              </div>

            </section>

          </div>

          {/* RIGHT */}

          <aside className="space-y-6">

            {/* QUICK ACCESS */}

            <section className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-[0_15px_50px_rgba(236,72,153,0.08)]">

              <div className="border-b border-gray-100 p-6">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                  Quick Access
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  My Account
                </h2>

              </div>

              <div className="p-3">

                {/* ADMIN */}

                {isAdmin && (
                  <ProfileLink
                    icon={LayoutDashboard}
                    title="Admin Dashboard"
                    subtitle="Manage your flower store"
                    to="/admin"
                    admin
                  />
                )}

                <ProfileLink
                  icon={ShoppingBag}
                  title="My Orders"
                  subtitle="Track your purchases"
                  to="/track-order"
                />

                <ProfileLink
                  icon={Heart}
                  title="Wishlist"
                  subtitle={`${wishlistItems.length} saved items`}
                  to="/wishlist"
                />

                <ProfileLink
                  icon={ShoppingBag}
                  title="Shopping Cart"
                  subtitle={`${cartItems.length} items`}
                  to="/cart"
                />

                {/* SETTINGS BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setSettingsOpen(true)
                  }
                  className="group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition hover:bg-pink-50"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition group-hover:bg-pink-600 group-hover:text-white">
                    <Settings size={19} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-gray-900">
                      Account Settings
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      Manage preferences
                    </p>

                  </div>

                  <ChevronRight
                    size={17}
                    className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-pink-500"
                  />

                </button>

              </div>

            </section>

            {/* SECURITY */}

            <section className="rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-pink-950 p-6 text-white shadow-xl">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck size={22} />
                </div>

                <div>

                  <h3 className="font-bold">
                    Your account is secure
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-300">
                    Your personal information is protected and securely stored.
                  </p>

                </div>

              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-green-400">
                <CheckCircle2 size={16} />
                Secure account
              </div>

            </section>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center justify-between rounded-3xl border border-red-100 bg-white p-5 text-left shadow-sm transition hover:border-red-200 hover:bg-red-50"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition group-hover:bg-red-500 group-hover:text-white">
                  <LogOut size={19} />
                </div>

                <div>

                  <p className="font-bold text-gray-900">
                    Sign Out
                  </p>

                  <p className="text-xs text-gray-500">
                    Logout from your account
                  </p>

                </div>

              </div>

              <ChevronRight
                size={18}
                className="text-gray-400"
              />

            </button>

          </aside>

        </div>

      </main>

      {/* =================================================
          EDIT PROFILE MODAL
      ================================================= */}

      {editProfileOpen && (
        <ModalOverlay
          onClose={() =>
            setEditProfileOpen(false)
          }
        >

          <div className="w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-2xl">

            {/* HEADER */}

            <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 to-rose-600 px-7 py-7 text-white">

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex items-center justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-100">
                    Account
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Edit Profile
                  </h2>

                  <p className="mt-1 text-sm text-pink-100">
                    Update your personal information
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditProfileOpen(false)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  <X size={19} />
                </button>

              </div>

            </div>

            {/* BODY */}

            <div className="space-y-5 p-7">

              <FormField
                icon={User}
                label="Full Name"
                name="name"
                value={
                  profileForm.name
                }
                onChange={
                  handleProfileChange
                }
                placeholder="Enter your name"
              />

              <FormField
                icon={Phone}
                label="Phone Number"
                name="phone"
                value={
                  profileForm.phone
                }
                onChange={
                  handleProfileChange
                }
                placeholder="Enter phone number"
              />

              <FormField
                icon={MapPin}
                label="Default Address"
                name="address"
                value={
                  profileForm.address
                }
                onChange={
                  handleProfileChange
                }
                placeholder="Enter your delivery address"
                textarea
              />

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    setEditProfileOpen(false)
                  }
                  className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-gray-200 font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSaveProfile
                  }
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Save size={17} />
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        </ModalOverlay>
      )}

      {/* =================================================
          ACCOUNT SETTINGS MODAL
      ================================================= */}

      {settingsOpen && (
        <ModalOverlay
          onClose={() =>
            setSettingsOpen(false)
          }
        >

          <div className="w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-2xl">

            {/* HEADER */}

            <div className="border-b border-gray-100 px-7 py-6">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                    <Settings size={21} />
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                      Preferences
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900">
                      Account Settings
                    </h2>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSettingsOpen(false)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-pink-50 hover:text-pink-600"
                >
                  <X size={19} />
                </button>

              </div>

            </div>

            {/* SETTINGS */}

            <div className="space-y-3 p-6">

              <SettingItem
                icon={Bell}
                title="Order Updates"
                subtitle="Receive notifications about your orders"
                enabled={
                  settings.orderUpdates
                }
                onClick={() =>
                  handleSettingChange(
                    "orderUpdates"
                  )
                }
              />

              <SettingItem
                icon={Megaphone}
                title="Promotional Emails"
                subtitle="Receive offers and flower collections"
                enabled={
                  settings.promotionalEmails
                }
                onClick={() =>
                  handleSettingChange(
                    "promotionalEmails"
                  )
                }
              />

              <SettingItem
                icon={ShieldCheck}
                title="Security Alerts"
                subtitle="Important notifications about your account"
                enabled={
                  settings.securityAlerts
                }
                onClick={() =>
                  handleSettingChange(
                    "securityAlerts"
                  )
                }
              />

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm">
                    <Lock size={17} />
                  </div>

                  <div>

                    <p className="font-semibold text-gray-900">
                      Password & Security
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your password is securely managed by the authentication system.
                    </p>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(false)
                }
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5"
              >
                <Check size={17} />
                Done
              </button>

            </div>

          </div>

        </ModalOverlay>
      )}

    </div>
  );
}


// =====================================================
// MODAL OVERLAY
// =====================================================

function ModalOverlay({
  children,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}


// =====================================================
// FORM FIELD
// =====================================================

function FormField({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  textarea = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">

        <Icon
          size={18}
          className="absolute left-4 top-4 text-gray-400"
        />

        {textarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
          />
        ) : (
          <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="h-13 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
          />
        )}

      </div>

    </div>
  );
}


// =====================================================
// SETTING ITEM
// =====================================================

function SettingItem({
  icon: Icon,
  title,
  subtitle,
  enabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left transition hover:border-pink-100 hover:bg-pink-50/40"
    >

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition group-hover:bg-pink-50 group-hover:text-pink-600">
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="font-semibold text-gray-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {subtitle}
        </p>

      </div>

      {/* TOGGLE */}

      <div
        className={`relative h-6 w-11 rounded-full transition ${
          enabled
            ? "bg-pink-600"
            : "bg-gray-200"
        }`}
      >

        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />

      </div>

    </button>
  );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="group rounded-3xl border border-pink-100 bg-white p-6 shadow-[0_12px_40px_rgba(236,72,153,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(236,72,153,0.13)]">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
          <Icon size={21} />
        </div>

        <span className="text-3xl font-bold text-gray-900">
          {value}
        </span>

      </div>

      <h3 className="mt-5 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {subtitle}
      </p>

    </div>
  );
}


// =====================================================
// INFO BOX
// =====================================================

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition hover:border-pink-100 hover:bg-pink-50/40">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
          <Icon size={18} />
        </div>

        <div className="min-w-0">

          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-gray-800">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// PROFILE LINK
// =====================================================

function ProfileLink({
  icon: Icon,
  title,
  subtitle,
  to,
  admin = false,
}) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-4 rounded-2xl p-4 transition ${
        admin
          ? "mb-2 bg-gradient-to-r from-gray-950 to-gray-800 text-white shadow-lg shadow-gray-900/10 hover:-translate-y-0.5 hover:from-gray-900 hover:to-gray-700"
          : "hover:bg-pink-50"
      }`}
    >

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
          admin
            ? "bg-white/10 text-pink-300"
            : "bg-gray-50 text-gray-600 group-hover:bg-pink-600 group-hover:text-white"
        }`}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">

        <p
          className={`font-semibold ${
            admin
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          {title}
        </p>

        <p
          className={`mt-0.5 truncate text-xs ${
            admin
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {subtitle}
        </p>

      </div>

      <ChevronRight
        size={17}
        className={`transition group-hover:translate-x-1 ${
          admin
            ? "text-pink-300"
            : "text-gray-300 group-hover:text-pink-500"
        }`}
      />

    </Link>
  );
}