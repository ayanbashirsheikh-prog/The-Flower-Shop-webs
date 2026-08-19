import {
  User,
  ShoppingBag,
  MapPin,
  Settings,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function UserSidebar() {

  const location = useLocation();

  const menu = [
    {
      name: "My Profile",
      icon: User,
      path: "/profile",
    },
    {
      name: "My Orders",
      icon: ShoppingBag,
      path: "/my-orders",
    },
    {
      name: "Addresses",
      icon: MapPin,
      path: "/addresses",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/account-settings",
    },
  ];

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold">
        My Account
      </h2>

      <div className="space-y-2">

        {menu.map((item) => {

          const active =
            location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3
                rounded-2xl px-4 py-4
                transition
                ${
                  active
                    ? "bg-pink-600 text-white"
                    : "hover:bg-pink-50"
                }
              `}
            >
              <item.icon size={20} />

              {item.name}
            </Link>
          );
        })}

      </div>

    </div>
  );
}