import rose from "@/assets/images/categories/roses.jpg";
import marigold from "@/assets/images/categories/marigold.jpg";
import yellowMarigold from "@/assets/images/categories/yellow-marigold.jpg";
import birthday from "@/assets/images/categories/birthday.jpg";
import anniversary from "@/assets/images/categories/anniversary.jpg";
import lily from "@/assets/images/categories/lily.jpg";
import tulip from "@/assets/images/categories/tulip.jpg";

import whiteChrysanthemum from "@/assets/images/categories/WhiteChrysanthemum.jpg";
import purpleChrysanthemum from "@/assets/images/categories/PurpleChrysanthemum.jpg";
import buttonRoses from "@/assets/images/categories/ButtonRoses.jpg";
import redrosebouquet from "@/assets/images/categories/RedRoseBouquet.jpg";
import flowerbouquet from "@/assets/images/categories/FlowerBouquet.jpg";
import mixedbouquet from "@/assets/images/categories/MixedBouquet.jpg";
import flowernecklace from "@/assets/images/categories/flowernecklace.jpg";
import flowernecklace2 from "@/assets/images/categories/flowernecklace2.jpg";

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
=========================================================
*/


const productsData = [

  /* =====================================================
     NORMAL FLOWERS
  ===================================================== */

  {
  id: 1,
  name: "Red Rose",
  price: 100,
  pricePerKg: 100,
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
    name: "Marigold",
    price: 60,
    pricePerKg: 60,
    image: marigold,
    category: "Marigold",

    description:
      "Elegant fresh marigold, perfect for occasions and special celebrations.",

    rating: 4.9,
    quantityStepKg: 0.25,
    minOrderKg: 0.25,
    maxOrderKg: 20,
    unit: "kg",
    wholesale: false,
  },


  {
    id: 3,
    name: "Yellow Marigold",
    price: 40,
    pricePerKg: 40,
    image: yellowMarigold,
    category: "Yellow Marigold",

    description:
      "Elegant fresh yellow marigold, perfect for occasions and special celebrations.",

    rating: 4.9,
    quantityStepKg: 0.25,
    minOrderKg: 0.25,
    maxOrderKg: 20,
    unit: "kg",
    wholesale: false,
  },


  {
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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


  {
    id: 8,
    name: "White Chrysanthemum",
    price: 100,
    pricePerKg: 100,
    image: whiteChrysanthemum,
    category: "Chrysanthemum",

    description:
      "Fresh white chrysanthemum with a beautiful premium finish, perfect for gifting.",

    rating: 4.8,
    quantityStepKg: 0.25,
    minOrderKg: 0.25,
    maxOrderKg: 20,
    unit: "kg",
    wholesale: false,
  },


  {
    id: 9,
    name: "Button Roses",
    price: 200,
    pricePerKg: 200,
    image: buttonRoses,
    category: "Roses",

    description:
      "Fresh Button Roses with a beautiful premium finish, perfect for gifting.",

    rating: 4.8,
    quantityStepKg: 0.25,
    minOrderKg: 0.25,
    maxOrderKg: 20,
    unit: "kg",
    wholesale: false,
  },


  {
    id: 10,
    name: "Purple Chrysanthemum",
    price: 80,
    pricePerKg: 80,
    image: purpleChrysanthemum,
    category: "Chrysanthemum",

    description:
      "Fresh Purple Chrysanthemum with a beautiful premium finish, perfect for gifting.",

    rating: 4.8,
    quantityStepKg: 0.25,
    minOrderKg: 0.25,
    maxOrderKg: 20,
    unit: "kg",
    wholesale: false,
  },

  {
  id: 11,

  name: "Red Rose Bouquet",

  price: 300,

  pricePerKg: 300,

  image: redrosebouquet,

  category: "Bouquets",

  description:
    "A beautiful classic bouquet of fresh red roses, perfect for romantic occasions, birthdays and special celebrations.",

  rating: 4.9,

  quantityStepKg: 1,

  minOrderKg: 1,

  maxOrderKg: 10,

  unit: "piece",

  wholesale: false,
},

{
  id: 12,

  name: "Flower Bouquet",

  price: 300,

  pricePerKg: 300,

  image: flowerbouquet,

  category: "Bouquets",

  description:
    "A beautiful classic bouquet of fresh flowers, perfect for romantic occasions, birthdays and special celebrations.",

  rating: 4.9,

  quantityStepKg: 1,

  minOrderKg: 1,

  maxOrderKg: 10,

  unit: "piece",

  wholesale: false,
},

{
  id: 13,

  name: "Mixed Bouquet",

  price: 300,

  pricePerKg: 300,

  image: mixedbouquet,

  category: "Bouquets",

  description:
    "A beautiful classic bouquet of fresh flowers, perfect for romantic occasions, birthdays and special celebrations.",

  rating: 4.9,

  quantityStepKg: 1,

  minOrderKg: 1,

  maxOrderKg: 10,

  unit: "piece",

  wholesale: false,
},

{
  id: 14,

  name: "Flower Necklace",

  price: 300,

  pricePerKg: 300,

  image: flowernecklace,

  category: "necklace",

  description:
    "A beautiful flower necklace of fresh flowers, perfect for romantic occasions, birthdays and special celebrations.",

  rating: 4.9,

  quantityStepKg: 1,

  minOrderKg: 1,

  maxOrderKg: 10,

  unit: "piece",

  wholesale: false,
},

{
  id: 15,

  name: "Flower Necklace 2",

  price: 300,

  pricePerKg: 300,

  image: flowernecklace2,

  category: "necklace",

  description:
    "A beautiful flower necklace of fresh flowers, perfect for romantic occasions, birthdays and special celebrations.",

  rating: 4.9,

  quantityStepKg: 1,

  minOrderKg: 1,

  maxOrderKg: 10,

  unit: "piece",

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
    name: "Marigold - Wholesale",
    price: 799,
    pricePerKg: 799,
    image: marigold,
    category: "Wholesale",

    description:
      "Fresh premium marigold available in bulk quantities for weddings, florists, decorators and businesses.",

    rating: 4.9,
    quantityStepKg: 0.25,
    minOrderKg: 5,
    maxOrderKg: 100,
    unit: "kg",
    wholesale: true,
  },


  {
    id: 103,
    name: "Yellow Marigold - Wholesale",
    price: 849,
    pricePerKg: 849,
    image: yellowMarigold,
    category: "Wholesale",

    description:
      "Premium yellow marigold for bulk wedding decorations, events, florists and business orders.",

    rating: 4.8,
    quantityStepKg: 0.25,
    minOrderKg: 5,
    maxOrderKg: 100,
    unit: "kg",
    wholesale: true,
  },


  {
    id: 104,
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
    id: 105,
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
    id: 106,
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


  {
    id: 107,
    name: "White Chrysanthemum - Wholesale",
    price: 699,
    pricePerKg: 699,
    image: whiteChrysanthemum,
    category: "Wholesale",

    description:
      "Fresh white chrysanthemum at special bulk pricing for events, decorators, hotels and florists.",

    rating: 4.7,
    quantityStepKg: 0.25,
    minOrderKg: 5,
    maxOrderKg: 100,
    unit: "kg",
    wholesale: true,
  },


  {
    id: 108,
    name: "Button Roses - Wholesale",
    price: 699,
    pricePerKg: 699,
    image: buttonRoses,
    category: "Wholesale",

    description:
      "Fresh Button Roses at special bulk pricing for events, decorators, hotels and florists.",

    rating: 4.7,
    quantityStepKg: 0.25,
    minOrderKg: 5,
    maxOrderKg: 100,
    unit: "kg",
    wholesale: true,
  },


  {
    id: 109,
    name: "Purple Chrysanthemum - Wholesale",
    price: 699,
    pricePerKg: 699,
    image: purpleChrysanthemum,
    category: "Wholesale",

    description:
      "Fresh Purple Chrysanthemum at special bulk pricing for events, decorators, hotels and florists.",

    rating: 4.7,
    quantityStepKg: 0.25,
    minOrderKg: 5,
    maxOrderKg: 100,
    unit: "kg",
    wholesale: true,
  },

];


export default productsData;