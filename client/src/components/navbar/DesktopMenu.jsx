import { NavLink } from "react-router-dom";

const links = [
  { title: "Home", path: "/" },
  { title: "Shop", path: "/shop" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

export default function DesktopMenu() {
  return (
    <nav className="hidden items-center gap-8 lg:flex">

      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `font-medium transition ${
              isActive
                ? "text-pink-600"
                : "text-gray-700 hover:text-pink-600"
            }`
          }
        >
          {link.title}
        </NavLink>
      ))}

    </nav>
  );
}