import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import {
  Upload,
  ImagePlus,
  Package,
  IndianRupee,
  Boxes,
  Star,
  Truck,
  Weight,
  Tag,
  Crown,
  X,
  Scale,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/products";

export default function AddProduct() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  /* =====================================================
     FORM DATA
  ===================================================== */

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",

    pricePerKg: "",
    compareAtPricePerKg: "",

    category: "",
    subcategory: "",

    stockKg: "",
    lowStockThresholdKg: "5",

    sku: "",

    size: "",
    color: "",
    flowerType: "",
    occasion: "",

    featured: false,
    bestseller: false,
    newArrival: true,

    deliveryAvailable: true,
    sameDayDelivery: false,

    metaTitle: "",
    metaDescription: "",
  });

  /* =====================================================
     PACKAGE VARIANTS

     250g / 500g / 1kg
  ===================================================== */

  const [variants, setVariants] = useState([
    {
      id: "250g",
      label: "250 g",
      weightKg: 0.25,
      enabled: true,
      price: "",
      compareAtPrice: "",
    },
    {
      id: "500g",
      label: "500 g",
      weightKg: 0.5,
      enabled: true,
      price: "",
      compareAtPrice: "",
    },
    {
      id: "1kg",
      label: "1 KG",
      weightKg: 1,
      enabled: true,
      price: "",
      compareAtPrice: "",
    },
  ]);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =====================================================
     AUTO CALCULATE VARIANT PRICES
  ===================================================== */

  const calculateVariantPrices = (
    pricePerKg,
    compareAtPricePerKg
  ) => {
    const sellingPrice = Number(pricePerKg || 0);
    const comparePrice = Number(
      compareAtPricePerKg || 0
    );

    setVariants((current) =>
      current.map((variant) => ({
        ...variant,

        price:
          sellingPrice > 0
            ? (
                sellingPrice *
                variant.weightKg
              ).toFixed(2)
            : "",

        compareAtPrice:
          comparePrice > 0
            ? (
                comparePrice *
                variant.weightKg
              ).toFixed(2)
            : "",
      }))
    );
  };

  /* =====================================================
     PRICE CHANGE
  ===================================================== */

  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (
      name === "pricePerKg" ||
      name === "compareAtPricePerKg"
    ) {
      const updatedPrice =
        name === "pricePerKg"
          ? value
          : formData.pricePerKg;

      const updatedComparePrice =
        name === "compareAtPricePerKg"
          ? value
          : formData.compareAtPricePerKg;

      calculateVariantPrices(
        updatedPrice,
        updatedComparePrice
      );
    }
  };

  /* =====================================================
     UPDATE VARIANT
  ===================================================== */

  const updateVariant = (
    variantId,
    field,
    value
  ) => {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  /* =====================================================
     IMAGE
  ===================================================== */

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be less than 5MB"
      );
      return;
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: false,
  });

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error(
        "Product name is required"
      );
      return false;
    }

    if (
      formData.description.trim().length <
      10
    ) {
      toast.error(
        "Description must contain at least 10 characters"
      );
      return false;
    }

    if (
      !formData.pricePerKg ||
      Number(formData.pricePerKg) <= 0
    ) {
      toast.error(
        "Enter a valid price per KG"
      );
      return false;
    }

    if (!formData.category) {
      toast.error(
        "Please select a category"
      );
      return false;
    }

    if (
      formData.stockKg === "" ||
      Number(formData.stockKg) < 0
    ) {
      toast.error(
        "Enter valid stock in KG"
      );
      return false;
    }

    if (
      formData.compareAtPricePerKg &&
      Number(formData.compareAtPricePerKg) <
        Number(formData.pricePerKg)
    ) {
      toast.error(
        "Compare-at price cannot be lower than selling price"
      );
      return false;
    }

    const enabledVariants =
      variants.filter(
        (variant) => variant.enabled
      );

    if (enabledVariants.length === 0) {
      toast.error(
        "Enable at least one package size"
      );
      return false;
    }

    for (const variant of enabledVariants) {
      if (
        !variant.price ||
        Number(variant.price) <= 0
      ) {
        toast.error(
          `Enter valid price for ${variant.label}`
        );
        return false;
      }

      if (
        variant.compareAtPrice &&
        Number(
          variant.compareAtPrice
        ) < Number(variant.price)
      ) {
        toast.error(
          `MRP cannot be lower than selling price for ${variant.label}`
        );
        return false;
      }
    }

    return true;
  };

  /* =====================================================
     DISCOUNT
  ===================================================== */

  const discount =
    formData.compareAtPricePerKg &&
    Number(
      formData.compareAtPricePerKg
    ) >
      Number(formData.pricePerKg)
      ? Math.round(
          ((Number(
            formData.compareAtPricePerKg
          ) -
            Number(
              formData.pricePerKg
            )) /
            Number(
              formData.compareAtPricePerKg
            )) *
            100
        )
      : 0;

  /* =====================================================
     MINIMUM ORDER PRICE
  ===================================================== */

  const minimumOrderPrice =
    Number(formData.pricePerKg || 0) *
    0.25;

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const data = new FormData();

      /*
       * Send normal fields
       */

      Object.entries(formData).forEach(
        ([key, value]) => {
          data.append(
            key,
            String(value)
          );
        }
      );

      /*
       * Send variants as JSON
       */

      const enabledVariants =
        variants
          .filter(
            (variant) =>
              variant.enabled
          )
          .map((variant) => ({
            label: variant.label,

            weightKg:
              variant.weightKg,

            weightGrams:
              variant.weightKg *
              1000,

            price: Number(
              variant.price
            ),

            compareAtPrice:
              Number(
                variant.compareAtPrice ||
                  0
              ),

            enabled: true,
          }));

      data.append(
        "variants",
        JSON.stringify(
          enabledVariants
        )
      );

      /*
       * Image
       */

      if (image) {
        data.append(
          "image",
          image
        );
      }

      const response =
        await axios.post(
          API_URL,
          data,
          {
            onUploadProgress: (
              event
            ) => {
              if (!event.total)
                return;

              const percent =
                Math.round(
                  (event.loaded /
                    event.total) *
                    100
                );

              setProgress(
                percent
              );
            },
          }
        );

      if (
        !response.data?.success
      ) {
        throw new Error(
          response.data
            ?.message ||
            "Failed to add product"
        );
      }

      toast.success(
        "🌸 Product added successfully"
      );

      /* =================================================
         RESET
      ================================================= */

      setFormData({
        name: "",
        description: "",
        shortDescription: "",

        pricePerKg: "",
        compareAtPricePerKg: "",

        category: "",
        subcategory: "",

        stockKg: "",
        lowStockThresholdKg: "5",

        sku: "",

        size: "",
        color: "",
        flowerType: "",
        occasion: "",

        featured: false,
        bestseller: false,
        newArrival: true,

        deliveryAvailable: true,
        sameDayDelivery: false,

        metaTitle: "",
        metaDescription: "",
      });

      setVariants([
        {
          id: "250g",
          label: "250 g",
          weightKg: 0.25,
          enabled: true,
          price: "",
          compareAtPrice: "",
        },
        {
          id: "500g",
          label: "500 g",
          weightKg: 0.5,
          enabled: true,
          price: "",
          compareAtPrice: "",
        },
        {
          id: "1kg",
          label: "1 KG",
          weightKg: 1,
          enabled: true,
          price: "",
          compareAtPrice: "",
        },
      ]);

      removeImage();
      setProgress(0);
    } catch (error) {
      console.error(
        "ADD PRODUCT ERROR:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "❌ Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 p-4 md:p-8">
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
          duration: 0.5,
        }}
        className="mx-auto max-w-7xl"
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg">
              <Package size={27} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-gray-900 md:text-4xl">
                Add New Product
              </h1>

              <p className="mt-1 text-gray-500">
                Create a premium flower
                product for your store.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* =================================================
              MAIN FORM
          ================================================= */}

          <div className="space-y-8">
            {/* =================================================
                IMAGE
            ================================================= */}

            <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <ImagePlus
                  className="text-pink-600"
                  size={22}
                />

                <h2 className="text-xl font-black">
                  Product Image
                </h2>
              </div>

              <div
                {...getRootProps()}
                className={`relative flex min-h-[330px] cursor-pointer items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed transition ${
                  isDragActive
                    ? "border-pink-600 bg-pink-100"
                    : "border-pink-300 bg-pink-50 hover:border-pink-500"
                }`}
              >
                <input
                  {...getInputProps()}
                />

                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Product preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/20" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-lg"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-100 text-pink-600">
                      <Upload size={34} />
                    </div>

                    <h3 className="mt-5 text-xl font-black">
                      {isDragActive
                        ? "Drop image here"
                        : "Drag & Drop Product Image"}
                    </h3>

                    <p className="mt-2 text-gray-500">
                      or click to browse
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                      JPG, PNG or WEBP • Max
                      5MB
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="mb-6 text-xl font-black">
                Basic Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block font-bold">
                    Product Name *
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={
                      handleChange
                    }
                    placeholder="Premium Red Rose Bouquet"
                    maxLength={120}
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    rows={6}
                    maxLength={3000}
                    required
                    placeholder="Describe your flower product..."
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-4 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  />

                  <div className="mt-2 text-right text-xs text-gray-400">
                    {
                      formData
                        .description
                        .length
                    }
                    /3000
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    Short Description
                  </label>

                  <input
                    name="shortDescription"
                    value={
                      formData.shortDescription
                    }
                    onChange={
                      handleChange
                    }
                    maxLength={300}
                    placeholder="Fresh luxury roses for special moments"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-bold">
                      Category *
                    </label>

                    <select
                      name="category"
                      value={
                        formData.category
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    >
                      <option value="">
                        Select Category
                      </option>

                      <option value="bouquet">
                        💐 Bouquet
                      </option>

                      <option value="rose">
                        🌹 Rose
                      </option>

                      <option value="birthday">
                        🎂 Birthday
                      </option>

                      <option value="wedding">
                        💍 Wedding
                      </option>

                      <option value="anniversary">
                        💕 Anniversary
                      </option>

                      <option value="luxury">
                        ✨ Luxury
                      </option>

                      <option value="mixed">
                        🌸 Mixed Flowers
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-bold">
                      Subcategory
                    </label>

                    <input
                      name="subcategory"
                      value={
                        formData.subcategory
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Red Roses"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                PRICING
            ================================================= */}

            <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <IndianRupee
                  className="text-pink-600"
                  size={22}
                />

                <h2 className="text-xl font-black">
                  Pricing
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-bold">
                    Selling Price / KG *
                  </label>

                  <div className="relative">
                    <IndianRupee
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={19}
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="pricePerKg"
                      value={
                        formData.pricePerKg
                      }
                      onChange={
                        handlePriceChange
                      }
                      placeholder="1000"
                      required
                      className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    MRP / Compare Price / KG
                  </label>

                  <div className="relative">
                    <IndianRupee
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={19}
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="compareAtPricePerKg"
                      value={
                        formData.compareAtPricePerKg
                      }
                      onChange={
                        handlePriceChange
                      }
                      placeholder="1299"
                      className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                </div>
              </div>

              {discount > 0 && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-700">
                  <Tag size={20} />

                  <span className="font-bold">
                    {discount}% discount will
                    be applied automatically.
                  </span>
                </div>
              )}

              {/* =================================================
                  PACKAGE SIZES
              ================================================= */}

              <div className="mt-8">
                <div className="mb-4 flex items-center gap-3">
                  <Scale
                    className="text-pink-600"
                    size={22}
                  />

                  <div>
                    <h3 className="text-lg font-black">
                      Package Sizes
                    </h3>

                    <p className="text-sm text-gray-500">
                      Customer can choose 250g,
                      500g or 1KG.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {variants.map(
                    (variant) => (
                      <div
                        key={variant.id}
                        className={`rounded-3xl border p-5 transition ${
                          variant.enabled
                            ? "border-pink-200 bg-pink-50/60"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                          {/* ENABLE */}

                          <label className="flex cursor-pointer items-center gap-3 lg:w-[170px]">
                            <input
                              type="checkbox"
                              checked={
                                variant.enabled
                              }
                              onChange={(
                                e
                              ) =>
                                updateVariant(
                                  variant.id,
                                  "enabled",
                                  e.target
                                    .checked
                                )
                              }
                              className="h-5 w-5 accent-pink-600"
                            />

                            <div>
                              <p className="font-black text-gray-900">
                                {
                                  variant.label
                                }
                              </p>

                              <p className="text-xs text-gray-500">
                                {variant.weightKg *
                                  1000}{" "}
                                grams
                              </p>
                            </div>
                          </label>

                          {/* SELLING PRICE */}

                          <div className="flex-1">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                              Selling Price
                            </label>

                            <div className="relative">
                              <IndianRupee
                                size={17}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                              />

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                  variant.price
                                }
                                disabled={
                                  !variant.enabled
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateVariant(
                                    variant.id,
                                    "price",
                                    e
                                      .target
                                      .value
                                  )
                                }
                                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 font-bold outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                              />
                            </div>
                          </div>

                          {/* MRP */}

                          <div className="flex-1">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                              MRP
                            </label>

                            <div className="relative">
                              <IndianRupee
                                size={17}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                              />

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                  variant.compareAtPrice
                                }
                                disabled={
                                  !variant.enabled
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateVariant(
                                    variant.id,
                                    "compareAtPrice",
                                    e
                                      .target
                                      .value
                                  )
                                }
                                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 font-bold outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-4 rounded-2xl bg-gray-900 p-4 text-sm text-white">
                  <p className="font-bold">
                    💡 Example
                  </p>

                  <p className="mt-1 text-gray-300">
                    If price is ₹1000/KG:
                    250g = ₹250,
                    500g = ₹500,
                    1KG = ₹1000.
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                WEIGHT + STOCK
            ================================================= */}

            <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <Weight
                  className="text-pink-600"
                  size={22}
                />

                <h2 className="text-xl font-black">
                  Weight & Inventory
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-bold">
                    Available Stock (KG) *
                  </label>

                  <div className="relative">
                    <Boxes
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={19}
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      name="stockKg"
                      value={
                        formData.stockKg
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="50"
                      required
                      className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    Low Stock Alert (KG)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="lowStockThresholdKg"
                    value={
                      formData.lowStockThresholdKg
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                DETAILS
            ================================================= */}

            <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="mb-6 text-xl font-black">
                Product Details
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  name="flowerType"
                  value={
                    formData.flowerType
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Flower Type — Rose"
                  className="rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />

                <input
                  name="color"
                  value={
                    formData.color
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Color — Red"
                  className="rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />

                <input
                  name="size"
                  value={
                    formData.size
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Size — Large"
                  className="rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />

                <input
                  name="sku"
                  value={
                    formData.sku
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="SKU — ROSE-001"
                  className="rounded-2xl border border-gray-200 px-4 py-4 uppercase outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block font-bold">
                    Occasions
                  </label>

                  <input
                    name="occasion"
                    value={
                      formData.occasion
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Birthday, Anniversary, Wedding"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Separate multiple
                    occasions with commas.
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                FLAGS
            ================================================= */}

            <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="mb-6 text-xl font-black">
                Store Settings
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Toggle
                  name="featured"
                  checked={
                    formData.featured
                  }
                  onChange={
                    handleChange
                  }
                  icon={
                    <Star size={19} />
                  }
                  title="Featured Product"
                  description="Show in featured collection"
                />

                <Toggle
                  name="bestseller"
                  checked={
                    formData.bestseller
                  }
                  onChange={
                    handleChange
                  }
                  icon={
                    <Crown size={19} />
                  }
                  title="Bestseller"
                  description="Mark as bestseller"
                />

                <Toggle
                  name="newArrival"
                  checked={
                    formData.newArrival
                  }
                  onChange={
                    handleChange
                  }
                  icon={
                    <Package
                      size={19}
                    />
                  }
                  title="New Arrival"
                  description="Show as new arrival"
                />

                <Toggle
                  name="deliveryAvailable"
                  checked={
                    formData.deliveryAvailable
                  }
                  onChange={
                    handleChange
                  }
                  icon={
                    <Truck size={19} />
                  }
                  title="Delivery Available"
                  description="Allow delivery"
                />

                <Toggle
                  name="sameDayDelivery"
                  checked={
                    formData.sameDayDelivery
                  }
                  onChange={
                    handleChange
                  }
                  icon={
                    <Truck size={19} />
                  }
                  title="Same Day Delivery"
                  description="Offer same-day delivery"
                />
              </div>
            </section>

            {/* =================================================
                SEO
            ================================================= */}

            <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">
              <h2 className="mb-6 text-xl font-black">
                SEO Settings
              </h2>

              <div className="space-y-5">
                <input
                  name="metaTitle"
                  value={
                    formData.metaTitle
                  }
                  onChange={
                    handleChange
                  }
                  maxLength={160}
                  placeholder="SEO Meta Title"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />

                <textarea
                  name="metaDescription"
                  value={
                    formData.metaDescription
                  }
                  onChange={
                    handleChange
                  }
                  maxLength={320}
                  rows={4}
                  placeholder="SEO Meta Description"
                  className="w-full resize-none rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>
            </section>
          </div>

          {/* =================================================
              LIVE PREVIEW
          ================================================= */}

          <div>
            <div className="sticky top-6 space-y-5">
              <section className="overflow-hidden rounded-[30px] border border-white bg-white shadow-xl">
                <div className="relative h-72 bg-gradient-to-br from-pink-100 to-rose-100">
                  {preview ? (
                    <img
                      src={preview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-pink-300">
                      <ImagePlus
                        size={70}
                      />
                    </div>
                  )}

                  {discount > 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-black text-white">
                      {discount}% OFF
                    </span>
                  )}

                  {formData.featured && (
                    <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-black text-white">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-pink-600">
                    {formData.category ||
                      "Flower Category"}
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-gray-900">
                    {formData.name ||
                      "Flower Name"}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {formData.description ||
                      "Your product description will appear here."}
                  </p>

                  {/* =================================================
                      PRICE
                  ================================================= */}

                  <div className="mt-5">
                    <p className="text-sm font-bold text-gray-400">
                      Starting from
                    </p>

                    <p className="mt-1 text-2xl font-black text-pink-600">
                      ₹
                      {Number(
                        variants.find(
                          (v) =>
                            v.enabled
                        )?.price ||
                          formData.pricePerKg ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}

                      <span className="ml-2 text-sm font-bold text-gray-400">
                        /{" "}
                        {
                          variants.find(
                            (v) =>
                              v.enabled
                          )?.label
                        }
                      </span>
                    </p>
                  </div>

                  {/* =================================================
                      PACKAGE OPTIONS
                  ================================================= */}

                  <div className="mt-5">
                    <p className="mb-3 text-sm font-black text-gray-900">
                      Available Sizes
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {variants
                        .filter(
                          (variant) =>
                            variant.enabled
                        )
                        .map(
                          (variant) => (
                            <div
                              key={
                                variant.id
                              }
                              className="rounded-2xl border border-pink-100 bg-pink-50 p-3 text-center"
                            >
                              <p className="text-xs font-bold text-gray-500">
                                {
                                  variant.label
                                }
                              </p>

                              <p className="mt-1 font-black text-pink-600">
                                ₹
                                {Number(
                                  variant.price ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </div>

                  {/* =================================================
                      STOCK
                  ================================================= */}

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-gray-400">
                        Stock
                      </p>

                      <p className="mt-1 font-black">
                        {formData.stockKg ||
                          0}{" "}
                        KG
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-gray-400">
                        Packages
                      </p>

                      <p className="mt-1 font-black">
                        {
                          variants.filter(
                            (v) =>
                              v.enabled
                          ).length
                        }{" "}
                        Sizes
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  PRICE SUMMARY
              ================================================= */}

              <section className="rounded-[30px] bg-gray-900 p-6 text-white shadow-xl">
                <h3 className="text-lg font-black">
                  Price Summary
                </h3>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Price / KG
                    </span>

                    <strong>
                      ₹
                      {Number(
                        formData.pricePerKg ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      250 g
                    </span>

                    <strong>
                      ₹
                      {Number(
                        variants.find(
                          (v) =>
                            v.id ===
                            "250g"
                        )?.price ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      500 g
                    </span>

                    <strong>
                      ₹
                      {Number(
                        variants.find(
                          (v) =>
                            v.id ===
                            "500g"
                        )?.price ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      1 KG
                    </span>

                    <strong>
                      ₹
                      {Number(
                        variants.find(
                          (v) =>
                            v.id ===
                            "1kg"
                        )?.price ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>
                        Discount
                      </span>

                      <strong>
                        {discount}%
                      </strong>
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  PROGRESS
              ================================================= */}

              {loading && (
                <div className="rounded-[25px] bg-white p-5 shadow-lg">
                  <div className="mb-2 flex justify-between text-sm font-bold">
                    <span>
                      Uploading...
                    </span>

                    <span>
                      {progress}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-600 transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 py-5 text-lg font-black text-white shadow-xl shadow-pink-200 transition hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload size={21} />

                {loading
                  ? `Uploading ${progress}%`
                  : "🌸 Add Product"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* =====================================================
   TOGGLE COMPONENT
===================================================== */

function Toggle({
  name,
  checked,
  onChange,
  icon,
  title,
  description,
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-pink-200 hover:bg-pink-50">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-pink-600"
      />

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
        {icon}
      </div>

      <div>
        <p className="font-bold text-gray-900">
          {title}
        </p>

        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>
    </label>
  );
}