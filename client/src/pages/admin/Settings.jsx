import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Store,
  CreditCard,
  Truck,
  Bell,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Smartphone,
  Mail,
  MapPin,
  LockKeyhole,
} from "lucide-react";
import { motion } from "framer-motion";

const defaultSettings = {
  storeName: "The Flower Shop",
  email: "hello@theflowershop.com",
  phone: "+91 98765 43210",
  address: "Mumbai, Maharashtra, India",

  deliveryFee: 99,
  freeDeliveryAbove: 999,

  upiId: "theflowershop@upi",
  gpay: "theflowershop@upi",
  phonePe: "theflowershop@upi",
  paytm: "theflowershop@upi",

  orderNotifications: true,
  emailNotifications: true,
  stockAlerts: true,

  maintenanceMode: false,
};

export default function Settings() {
  const [settings, setSettings] =
    useState(defaultSettings);

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          "flower-shop-settings"
        );

      if (stored) {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      }
    } catch {
      console.log(
        "Unable to load settings"
      );
    }
  }, []);

  const updateSetting = (
    key,
    value
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "flower-shop-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      "flower-shop-settings",
      JSON.stringify(defaultSettings)
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f7f9] p-4 md:p-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-pink-600">
            <SettingsIcon size={16} />
            Store Configuration
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your store, delivery, payments
            and notification preferences.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetSettings}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-pink-200 hover:text-pink-600"
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            onClick={saveSettings}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5"
          >
            {saved ? (
              <>
                <CheckCircle2
                  size={17}
                />
                Saved
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
        {/* SETTINGS NAV */}

        <div className="hidden h-fit rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm xl:block">
          <SettingsNav
            icon={Store}
            label="Store"
            active
          />

          <SettingsNav
            icon={Truck}
            label="Delivery"
          />

          <SettingsNav
            icon={CreditCard}
            label="Payments"
          />

          <SettingsNav
            icon={Bell}
            label="Notifications"
          />

          <SettingsNav
            icon={ShieldCheck}
            label="Security"
          />
        </div>

        {/* CONTENT */}

        <div className="space-y-6">
          {/* STORE */}

          <SettingsSection
            icon={Store}
            title="Store Information"
            description="Basic information displayed across your flower store."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Store Name"
                value={settings.storeName}
                onChange={(value) =>
                  updateSetting(
                    "storeName",
                    value
                  )
                }
                icon={Store}
              />

              <Input
                label="Store Email"
                value={settings.email}
                onChange={(value) =>
                  updateSetting(
                    "email",
                    value
                  )
                }
                icon={Mail}
              />

              <Input
                label="Phone Number"
                value={settings.phone}
                onChange={(value) =>
                  updateSetting(
                    "phone",
                    value
                  )
                }
                icon={Smartphone}
              />

              <Input
                label="Store Address"
                value={settings.address}
                onChange={(value) =>
                  updateSetting(
                    "address",
                    value
                  )
                }
                icon={MapPin}
              />
            </div>
          </SettingsSection>

          {/* DELIVERY */}

          <SettingsSection
            icon={Truck}
            title="Delivery Settings"
            description="Control your delivery charges and free delivery threshold."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <NumberInput
                label="Delivery Fee"
                value={
                  settings.deliveryFee
                }
                onChange={(value) =>
                  updateSetting(
                    "deliveryFee",
                    value
                  )
                }
              />

              <NumberInput
                label="Free Delivery Above"
                value={
                  settings.freeDeliveryAbove
                }
                onChange={(value) =>
                  updateSetting(
                    "freeDeliveryAbove",
                    value
                  )
                }
              />
            </div>

            <div className="mt-5 rounded-2xl bg-pink-50 p-4 text-sm text-pink-800">
              Orders above ₹
              {Number(
                settings.freeDeliveryAbove
              ).toLocaleString(
                "en-IN"
              )}{" "}
              will receive free delivery.
            </div>
          </SettingsSection>

          {/* PAYMENTS */}

          <SettingsSection
            icon={CreditCard}
            title="Payment Settings"
            description="Configure the UPI accounts customers can use for payments."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Primary UPI ID"
                value={settings.upiId}
                onChange={(value) =>
                  updateSetting(
                    "upiId",
                    value
                  )
                }
                icon={CreditCard}
              />

              <Input
                label="Google Pay UPI"
                value={settings.gpay}
                onChange={(value) =>
                  updateSetting(
                    "gpay",
                    value
                  )
                }
                icon={Smartphone}
              />

              <Input
                label="PhonePe UPI"
                value={settings.phonePe}
                onChange={(value) =>
                  updateSetting(
                    "phonePe",
                    value
                  )
                }
                icon={Smartphone}
              />

              <Input
                label="Paytm UPI"
                value={settings.paytm}
                onChange={(value) =>
                  updateSetting(
                    "paytm",
                    value
                  )
                }
                icon={Smartphone}
              />
            </div>
          </SettingsSection>

          {/* NOTIFICATIONS */}

          <SettingsSection
            icon={Bell}
            title="Notifications"
            description="Choose which store notifications should be enabled."
          >
            <div className="space-y-3">
              <Toggle
                title="Order Notifications"
                description="Get notified whenever a new order is placed."
                enabled={
                  settings.orderNotifications
                }
                onChange={(value) =>
                  updateSetting(
                    "orderNotifications",
                    value
                  )
                }
              />

              <Toggle
                title="Email Notifications"
                description="Send important store updates to your email."
                enabled={
                  settings.emailNotifications
                }
                onChange={(value) =>
                  updateSetting(
                    "emailNotifications",
                    value
                  )
                }
              />

              <Toggle
                title="Low Stock Alerts"
                description="Receive alerts when flower inventory is running low."
                enabled={
                  settings.stockAlerts
                }
                onChange={(value) =>
                  updateSetting(
                    "stockAlerts",
                    value
                  )
                }
              />
            </div>
          </SettingsSection>

          {/* SECURITY */}

          <SettingsSection
            icon={ShieldCheck}
            title="Store Security"
            description="Important security controls for your admin dashboard."
          >
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                  <LockKeyhole
                    size={20}
                  />
                </div>

                <div>
                  <h3 className="font-bold text-amber-900">
                    Maintenance Mode
                  </h3>

                  <p className="mt-1 text-sm text-amber-800/80">
                    Temporarily disable customer
                    access while you update the store.
                  </p>

                  <button
                    onClick={() =>
                      updateSetting(
                        "maintenanceMode",
                        !settings.maintenanceMode
                      )
                    }
                    className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                      settings.maintenanceMode
                        ? "bg-red-600 text-white"
                        : "bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {settings.maintenanceMode
                      ? "Maintenance Enabled"
                      : "Enable Maintenance Mode"}
                  </button>
                </div>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] md:p-7"
    >
      <div className="mb-6 flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </motion.section>
  );
}

function Input({
  label,
  value,
  onChange,
  icon: Icon,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
        />
      </div>
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
          ₹
        </span>

        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) =>
            onChange(
              Number(e.target.value)
            )
          }
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
        />
      </div>
    </label>
  );
}

function Toggle({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!enabled)
        }
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled
            ? "bg-pink-600"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SettingsNav({
  icon: Icon,
  label,
  active,
}) {
  return (
    <button
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-pink-50 text-pink-600"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}