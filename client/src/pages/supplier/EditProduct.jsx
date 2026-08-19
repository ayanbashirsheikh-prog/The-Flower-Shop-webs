import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  Upload,
  ImagePlus,
  Package,
  IndianRupee,
  Boxes,
  Star,
  Save,
  RefreshCw,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/products";
const SERVER_URL = "http://localhost:5000";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

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
    minOrderKg: "1",
    maxOrderKg: "20",
    quantityStepKg: "1",
  });

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/${id}`);

      if (!response.data?.success) {
        toast.error(
          response.data?.message || "Product not found"
        );
        navigate("/admin/products");
        return;
      }

      const product = response.data.product;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",

        pricePerKg: product.pricePerKg ?? "",
        compareAtPricePerKg:
          product.compareAtPricePerKg ?? "",

        category: product.category || "",
        subcategory: product.subcategory || "",

        stockKg: product.stockKg ?? "",
        lowStockThresholdKg:
          product.lowStockThresholdKg ?? "5",

        sku: product.sku || "",

        size: product.size || "",
        color: product.color || "",
        flowerType: product.flowerType || "",

        occasion: Array.isArray(product.occasion)
          ? product.occasion.join(", ")
          : product.occasion || "",

        featured: Boolean(product.featured),
        bestseller: Boolean(product.bestseller),
        newArrival:
          product.newArrival === undefined
            ? true
            : Boolean(product.newArrival),

        deliveryAvailable:
          product.deliveryAvailable === undefined
            ? true
            : Boolean(product.deliveryAvailable),

        sameDayDelivery: Boolean(
          product.sameDayDelivery
        ),

        metaTitle: product.metaTitle || "",
        metaDescription:
          product.metaDescription || "",

        minOrderKg: product.minOrderKg ?? "1",
        maxOrderKg: product.maxOrderKg ?? "20",
        quantityStepKg:
          product.quantityStepKg ?? "1",
      });

      // Existing image
      if (product.image) {
        setPreview(getImageUrl(product.image));
      }
    } catch (error) {
      console.error(
        "FETCH PRODUCT ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load product"
      );

      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    if (imagePath.startsWith("/")) {
      return `${SERVER_URL}${imagePath}`;
    }

    return `${SERVER_URL}/${imagePath}`;
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // IMAGE DROP
  // =====================================================

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setImage(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  // =====================================================
  // REMOVE NEW IMAGE
  // =====================================================

  const removeImage = () => {
    setImage(null);

    /*
      If user removes a newly selected image,
      reload original image from backend.
    */
    fetchProduct();
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "shortDescription",
        formData.shortDescription.trim()
      );

      data.append(
        "pricePerKg",
        formData.pricePerKg
      );

      data.append(
        "compareAtPricePerKg",
        formData.compareAtPricePerKg || 0
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "subcategory",
        formData.subcategory
      );

      data.append(
        "stockKg",
        formData.stockKg
      );

      data.append(
        "lowStockThresholdKg",
        formData.lowStockThresholdKg
      );

      data.append(
        "sku",
        formData.sku
      );

      data.append(
        "size",
        formData.size
      );

      data.append(
        "color",
        formData.color
      );

      data.append(
        "flowerType",
        formData.flowerType
      );

      data.append(
        "occasion",
        formData.occasion
      );

      data.append(
        "featured",
        formData.featured
      );

      data.append(
        "bestseller",
        formData.bestseller
      );

      data.append(
        "newArrival",
        formData.newArrival
      );

      data.append(
        "deliveryAvailable",
        formData.deliveryAvailable
      );

      data.append(
        "sameDayDelivery",
        formData.sameDayDelivery
      );

      data.append(
        "metaTitle",
        formData.metaTitle
      );

      data.append(
        "metaDescription",
        formData.metaDescription
      );

      data.append(
        "minOrderKg",
        formData.minOrderKg
      );

      data.append(
        "maxOrderKg",
        formData.maxOrderKg
      );

      data.append(
        "quantityStepKg",
        formData.quantityStepKg
      );

      // New image
      if (image) {
        data.append("image", image);
      }

      const response = await axios.put(
        `${API_URL}/${id}`,
        data
      );

      if (response.data?.success) {
        toast.success(
          "🌸 Product updated successfully"
        );

        navigate("/admin/products");
      } else {
        toast.error(
          response.data?.message ||
            "Failed to update product"
        );
      }
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "❌ Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="flex flex-col items-center">
          <RefreshCw
            size={45}
            className="animate-spin text-pink-600"
          />

          <p className="mt-4 font-semibold text-gray-600">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-5 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center"
        >
          <div>
            <button
              type="button"
              onClick={() =>
                navigate("/admin/products")
              }
              className="mb-4 flex items-center gap-2 font-semibold text-gray-500 transition hover:text-pink-600"
            >
              <ArrowLeft size={18} />
              Back to Products
            </button>

            <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
              Edit Product
            </h1>

            <p className="mt-2 text-gray-500">
              Update your luxury flower product
              details.
            </p>
          </div>

          <div className="rounded-2xl bg-pink-100 px-5 py-3 font-bold text-pink-700">
            🌸 Product Editor
          </div>
        </motion.div>

        {/* FORM */}

        <motion.form
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* IMAGE */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <div className="mb-5">
              <h2 className="text-2xl font-black text-gray-900">
                Product Image
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload a new image to replace the
                current product image.
              </p>
            </div>

            <div
              {...getRootProps()}
              className={`relative flex min-h-[350px] cursor-pointer items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed transition ${
                isDragActive
                  ? "border-pink-600 bg-pink-100"
                  : "border-pink-300 bg-pink-50"
              }`}
            >
              <input {...getInputProps()} />

              {preview ? (
                <>
                  <img
                    src={preview}
                    alt={formData.name}
                    className="h-full min-h-[350px] w-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-5">
                    <div className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 font-semibold text-gray-800">
                      <ImagePlus size={18} />
                      Click or drop to replace
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <ImagePlus
                    size={70}
                    className="mx-auto text-pink-500"
                  />

                  <h3 className="mt-4 text-2xl font-black">
                    Upload Product Image
                  </h3>

                  <p className="mt-2 text-gray-500">
                    Drag & drop or click to select
                  </p>
                </div>
              )}
            </div>

            {image && (
              <button
                type="button"
                onClick={removeImage}
                className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
              >
                <Trash2 size={17} />
                Remove New Image
              </button>
            )}
          </section>

          {/* BASIC INFO */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <h2 className="mb-6 text-2xl font-black">
              Basic Information
            </h2>

            <div className="space-y-6">

              {/* NAME */}

              <div>
                <label className="mb-2 block font-bold">
                  Product Name
                </label>

                <div className="relative">
                  <Package
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={120}
                    className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* SHORT DESCRIPTION */}

              <div>
                <label className="mb-2 block font-bold">
                  Short Description
                </label>

                <input
                  type="text"
                  name="shortDescription"
                  value={
                    formData.shortDescription
                  }
                  onChange={handleChange}
                  maxLength={300}
                  placeholder="Premium red rose bouquet"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block font-bold">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  maxLength={3000}
                  required
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />

                <div className="mt-2 text-right text-sm text-gray-400">
                  {formData.description.length}/3000
                </div>
              </div>

            </div>
          </section>

          {/* PRICING + STOCK */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <h2 className="mb-6 text-2xl font-black">
              Pricing & Inventory
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              {/* PRICE */}

              <div>
                <label className="mb-2 block font-bold">
                  Selling Price / KG
                </label>

                <div className="relative">
                  <IndianRupee
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="number"
                    name="pricePerKg"
                    value={formData.pricePerKg}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* COMPARE PRICE */}

              <div>
                <label className="mb-2 block font-bold">
                  Original / MRP Price / KG
                </label>

                <div className="relative">
                  <IndianRupee
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="number"
                    name="compareAtPricePerKg"
                    value={
                      formData.compareAtPricePerKg
                    }
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* STOCK */}

              <div>
                <label className="mb-2 block font-bold">
                  Stock / KG
                </label>

                <div className="relative">
                  <Boxes
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="number"
                    name="stockKg"
                    value={formData.stockKg}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                    className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* LOW STOCK */}

              <div>
                <label className="mb-2 block font-bold">
                  Low Stock Alert / KG
                </label>

                <input
                  type="number"
                  name="lowStockThresholdKg"
                  value={
                    formData.lowStockThresholdKg
                  }
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

            </div>

            {/* DISCOUNT PREVIEW */}

            {Number(
              formData.compareAtPricePerKg
            ) >
              Number(formData.pricePerKg) &&
              Number(formData.pricePerKg) > 0 && (
                <div className="mt-6 rounded-2xl bg-green-50 p-5">
                  <p className="font-bold text-green-800">
                    Discount Preview
                  </p>

                  <p className="mt-1 text-green-700">
                    {Math.round(
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
                    )}
                    % OFF
                  </p>
                </div>
              )}
          </section>

          {/* CATEGORY */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <h2 className="mb-6 text-2xl font-black">
              Product Details
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-bold">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-white p-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
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

                  <option value="luxury">
                    ✨ Luxury
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Subcategory
                </label>

                <input
                  type="text"
                  name="subcategory"
                  value={
                    formData.subcategory
                  }
                  onChange={handleChange}
                  placeholder="Premium Roses"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  SKU
                </label>

                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="ROSE-001"
                  className="w-full rounded-2xl border border-gray-200 p-4 uppercase outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Flower Type
                </label>

                <input
                  type="text"
                  name="flowerType"
                  value={
                    formData.flowerType
                  }
                  onChange={handleChange}
                  placeholder="Red Rose"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Size
                </label>

                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="Large"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Color
                </label>

                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Red"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-bold">
                  Occasions
                </label>

                <input
                  type="text"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  placeholder="Birthday, Anniversary, Wedding"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />

                <p className="mt-2 text-sm text-gray-400">
                  Separate multiple occasions
                  with commas.
                </p>
              </div>

            </div>
          </section>

          {/* ORDER SETTINGS */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <h2 className="mb-6 text-2xl font-black">
              Order Quantity
            </h2>

            <div className="grid gap-6 md:grid-cols-3">

              <div>
                <label className="mb-2 block font-bold">
                  Minimum Order KG
                </label>

                <input
                  type="number"
                  name="minOrderKg"
                  value={
                    formData.minOrderKg
                  }
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Maximum Order KG
                </label>

                <input
                  type="number"
                  name="maxOrderKg"
                  value={
                    formData.maxOrderKg
                  }
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Quantity Step KG
                </label>

                <input
                  type="number"
                  name="quantityStepKg"
                  value={
                    formData.quantityStepKg
                  }
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500"
                />
              </div>

            </div>
          </section>

          {/* FLAGS */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <h2 className="mb-6 text-2xl font-black">
              Product Settings
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <Toggle
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                icon={
                  <Star
                    size={20}
                    className="text-yellow-500"
                  />
                }
                label="Featured Product"
                description="Show this product in featured sections."
              />

              <Toggle
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
                label="Bestseller"
                description="Mark this product as a bestseller."
              />

              <Toggle
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
                label="New Arrival"
                description="Display this product as a new arrival."
              />

              <Toggle
                name="deliveryAvailable"
                checked={
                  formData.deliveryAvailable
                }
                onChange={handleChange}
                label="Delivery Available"
                description="Allow customers to order this product."
              />

              <Toggle
                name="sameDayDelivery"
                checked={
                  formData.sameDayDelivery
                }
                onChange={handleChange}
                label="Same Day Delivery"
                description="Enable same-day delivery."
              />

            </div>
          </section>

          {/* SEO */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <h2 className="mb-6 text-2xl font-black">
              SEO Settings
            </h2>

            <div className="space-y-6">

              <div>
                <label className="mb-2 block font-bold">
                  Meta Title
                </label>

                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  maxLength={160}
                  placeholder="Premium Red Rose Bouquet | The Flower Shop"
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Meta Description
                </label>

                <textarea
                  name="metaDescription"
                  value={
                    formData.metaDescription
                  }
                  onChange={handleChange}
                  maxLength={320}
                  rows={4}
                  placeholder="Buy premium fresh red roses online..."
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500"
                />
              </div>

            </div>
          </section>

          {/* SAVE */}

          <div className="sticky bottom-5 z-20 rounded-[28px] border border-white bg-white/90 p-4 shadow-2xl backdrop-blur-xl">

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft size={18} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex flex-[2] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 py-4 font-black text-white shadow-xl shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <RefreshCw
                      size={20}
                      className="animate-spin"
                    />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Product Changes
                  </>
                )}
              </button>

            </div>
          </div>

        </motion.form>
      </div>
    </div>
  );
}

// =====================================================
// TOGGLE
// =====================================================

function Toggle({
  name,
  checked,
  onChange,
  label,
  description,
  icon,
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:bg-pink-50">

      <div className="flex items-center gap-3">

        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
            {icon}
          </div>
        )}

        <div>
          <p className="font-bold text-gray-900">
            {label}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        </div>

      </div>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-pink-600"
      />
    </label>
  );
}