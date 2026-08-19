import rose from "@/assets/images/categories/roses.jpg";
import birthday from "@/assets/images/categories/birthday.jpg";
import anniversary from "@/assets/images/categories/anniversary.jpg";
import lily from "@/assets/images/categories/lily.jpg";
import tulip from "@/assets/images/categories/tulip.jpg";

/*
=========================================================
THE FLOWER SHOP
PRODUCT DATABASE
=========================================================

QUANTITY SYSTEM
---------------------------------------------------------
250 g  = 0.25 kg
500 g  = 0.50 kg
750 g  = 0.75 kg
1 kg   = 1.00 kg

PRICE SYSTEM
---------------------------------------------------------
pricePerKg = price of 1 KG

Example:

pricePerKg: 1000

250 g  = ₹250
500 g  = ₹500
750 g  = ₹750
1 kg   = ₹1,000

IMPORTANT
---------------------------------------------------------
price and pricePerKg are kept SAME.

This prevents cart/checkout price mismatch.
=========================================================
*/


const productsData = [

  /* =====================================================
     NORMAL FLOWERS
  ===================================================== */

  {
    id: 1,

    name: "Red Rose Bouquet",

    price: 1000,

    pricePerKg: 1000,

    image: rose,

    category: "Roses",

    description:
      "Elegant fresh red roses, perfect for romantic occasions and special celebrations.",

    rating: 4.9,

    quantityStepKg: 0.25,

    minOrderKg: 0.25,

    maxOrderKg: 20,

    unit: "kg",

    wholesale: false,
  },


  {
    id: 2,

    name: "Birthday Special",

    price: 1200,

    pricePerKg: 1200,

    image: birthday,

    category: "Birthday",

    description:
      "Beautiful fresh flowers specially arranged to make birthdays unforgettable.",

    rating: 4.8,

    quantityStepKg: 0.25,

    minOrderKg: 0.25,

    maxOrderKg: 20,

    unit: "kg",

    wholesale: false,
  },


  {
    id: 3,

    name: "Anniversary Luxury",

    price: 1500,

    pricePerKg: 1500,

    image: anniversary,

    category: "Anniversary",

    description:
      "Premium flower collection created for romantic anniversaries and special moments.",

    rating: 4.7,

    quantityStepKg: 0.25,

    minOrderKg: 0.25,

    maxOrderKg: 20,

    unit: "kg",

    wholesale: false,
  },


  {
    id: 4,

    name: "White Lily Bouquet",

    price: 1800,

    pricePerKg: 1800,

    image: lily,

    category: "Luxury",

    description:
      "Premium white lilies with an elegant and luxurious appearance.",

    rating: 4.9,

    quantityStepKg: 0.25,

    minOrderKg: 0.25,

    maxOrderKg: 20,

    unit: "kg",

    wholesale: false,
  },


  {
    id: 5,

    name: "Pink Tulips",

    price: 1400,

    pricePerKg: 1400,

    image: tulip,

    category: "Tulips",

    description:
      "Fresh pink tulips with a beautiful premium finish, perfect for gifting.",

    rating: 4.8,

    quantityStepKg: 0.25,

    minOrderKg: 0.25,

    maxOrderKg: 20,

    unit: "kg",

    wholesale: false,
  },


  /* =====================================================
     WHOLESALE FLOWERS
  ===================================================== */

  {
    id: 101,

    name: "Fresh Red Roses - Wholesale",

    price: 799,

    pricePerKg: 799,

    image: rose,

    category: "Wholesale",

    description:
      "Fresh premium red roses available in bulk quantities for weddings, florists, decorators and businesses.",

    rating: 4.9,

    quantityStepKg: 0.25,

    minOrderKg: 5,

    maxOrderKg: 100,

    unit: "kg",

    wholesale: true,
  },


  {
    id: 102,

    name: "Premium Pink Roses - Wholesale",

    price: 849,

    pricePerKg: 849,

    image: rose,

    category: "Wholesale",

    description:
      "Premium pink roses for bulk wedding decorations, events, florists and business orders.",

    rating: 4.8,

    quantityStepKg: 0.25,

    minOrderKg: 5,

    maxOrderKg: 100,

    unit: "kg",

    wholesale: true,
  },


  {
    id: 103,

    name: "Fresh White Lilies - Wholesale",

    price: 999,

    pricePerKg: 999,

    image: lily,

    category: "Wholesale",

    description:
      "Fresh white lilies supplied in bulk for hotels, weddings, decorators, events and florists.",

    rating: 4.9,

    quantityStepKg: 0.25,

    minOrderKg: 5,

    maxOrderKg: 100,

    unit: "kg",

    wholesale: true,
  },


  {
    id: 104,

    name: "Premium Tulips - Wholesale",

    price: 1099,

    pricePerKg: 1099,

    image: tulip,

    category: "Wholesale",

    description:
      "Premium fresh tulips available for large events, wedding decorators and business orders.",

    rating: 4.8,

    quantityStepKg: 0.25,

    minOrderKg: 5,

    maxOrderKg: 100,

    unit: "kg",

    wholesale: true,
  },


  {
    id: 105,

    name: "Mixed Fresh Flowers - Wholesale",

    price: 699,

    pricePerKg: 699,

    image: anniversary,

    category: "Wholesale",

    description:
      "Fresh mixed flowers at special bulk pricing for events, decorators, hotels and florists.",

    rating: 4.7,

    quantityStepKg: 0.25,

    minOrderKg: 5,

    maxOrderKg: 100,

    unit: "kg",

    wholesale: true,
  },

];


export default productsData;