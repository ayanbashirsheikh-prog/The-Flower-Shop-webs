import rosesImage from "@/assets/images/categories/roses.jpg";
import birthdayImage from "@/assets/images/categories/birthday.jpg";
import anniversaryImage from "@/assets/images/categories/anniversary.jpg";
import luxuryBouquetImage from "@/assets/images/categories/luxury-bouquets.jpg";

const categoriesData = [
  {
    id: 1,
    title: "Roses",
    slug: "roses",
    description: "Classic roses for every beautiful moment.",
    image: rosesImage,
    path: "/shop?category=roses",
  },

  {
    id: 2,
    title: "Birthday Flowers",
    slug: "birthday",
    description: "Make their special day unforgettable.",
    image: birthdayImage,
    path: "/shop?category=birthday",
  },

  {
    id: 3,
    title: "Anniversary",
    slug: "anniversary",
    description: "Celebrate love with beautiful flowers.",
    image: anniversaryImage,
    path: "/shop?category=anniversary",
  },

  {
    id: 4,
    title: "Luxury Bouquets",
    slug: "luxury-bouquets",
    description: "Elegant bouquets for unforgettable moments.",
    image: luxuryBouquetImage,
    path: "/shop?category=luxury-bouquets",
  },
];

export default categoriesData;