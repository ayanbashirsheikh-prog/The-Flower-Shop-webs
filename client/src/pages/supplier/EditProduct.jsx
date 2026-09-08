import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  ImagePlus,
  Package,
  IndianRupee,
  Boxes,
  Star,
  Save,
  RefreshCw,
  Trash2,
  Truck,
  Sparkles,
  ShoppingBag,
  Tag,
  Palette,
  Ruler,
  Flower2,
  Search,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/products";
const SERVER_URL = "http://localhost:5000";

const INITIAL_FORM_DATA = {
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
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New image selected by admin
  const [image, setImage] = useState(null);

  // Preview can contain either existing server image or local object URL
  const [preview, setPreview] = useState("");

  // Keep original image separately
  const [originalImage, setOriginalImage] = useState("");

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  useEffect(() => {
    fetchProduct();

    return () => {
      // Cleanup local preview when component unmounts
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };

    // We intentionally only fetch when product ID changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/${id}`);

      if (!response.data?.success) {
        toast.error(response.data?.message || "Product not found");
        navigate("/admin/products");
        return;
      }

      const product = response.data.product;

      // ---------------------------------------------------------
      // Populate form
      // ---------------------------------------------------------

      setFormData({
        name: product.name ?? "",
        description: product.description ?? "",
        shortDescription: product.shortDescription ?? "",

        pricePerKg: product.pricePerKg ?? "",
        compareAtPricePerKg: product.compareAtPricePerKg ?? "",

        category: product.category ?? "",
        subcategory: product.subcategory ?? "",

        stockKg: product.stockKg ?? "",
        lowStockThresholdKg: product.lowStockThresholdKg ?? "5",

        sku: product.sku ?? "",

        size: product.size ?? "",
        color: product.color ?? "",
        flowerType: product.flowerType ?? "",

        occasion: Array.isArray(product.occasion)
          ? product.occasion.join(", ")
          : product.occasion ?? "",

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

        sameDayDelivery: Boolean(product.sameDayDelivery),

        metaTitle: product.metaTitle ?? "",
        metaDescription: product.metaDescription ?? "",

        minOrderKg: product.minOrderKg ?? "1",
        maxOrderKg: product.maxOrderKg ?? "20",
        quantityStepKg: product.quantityStepKg ?? "1",
      });

      // ---------------------------------------------------------
      // Existing image
      // ---------------------------------------------------------

      const existingImage = product.image
        ? getImageUrl(product.image)
        : "";

      setOriginalImage(existingImage);
      setPreview(existingImage);

      // Important: editing existing product should start
      // with no newly selected image.
      setImage(null);
    } catch (error) {
      console.error("FETCH PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load product"
      );

      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  function getImageUrl(imagePath) {
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
  }

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // SKU CHANGE
  // =========================================================

  const handleSkuChange = (e) => {
    setFormData((current) => ({
      ...current,
      sku: e.target.value
        .toUpperCase()
        .replace(/\s+/g, "-"),
    }));
  };

  // =========================================================
  // IMAGE DROP
  // =========================================================

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles?.[0];

    if (!file) return;

    // Validate file size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    // Validate image type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    // Revoke previous local object URL
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl = URL.createObjectURL(file);

    setImage(file);
    setPreview(objectUrl);

    toast.success("New image selected");
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

    maxFiles: 1,
  });

  // =========================================================
  // REMOVE NEW IMAGE
  // =========================================================

  const removeImage = () => {
    // Only remove newly selected image.
    // DO NOT call fetchProduct().
    // That would reload/reset the entire form.

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview(originalImage);

    toast.success("New image removed");
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const name = formData.name.trim();
    const description = formData.description.trim();

    const price = Number(formData.pricePerKg);
    const comparePrice = Number(
      formData.compareAtPricePerKg || 0
    );

    const stock = Number(formData.stockKg);

    const lowStock = Number(
      formData.lowStockThresholdKg
    );

    const minOrder = Number(formData.minOrderKg);
    const maxOrder = Number(formData.maxOrderKg);
    const quantityStep = Number(
      formData.quantityStepKg
    );

    // ---------------------------------------------------------
    // Basic
    // ---------------------------------------------------------

    if (!name) {
      toast.error("Product name is required.");
      return false;
    }

    if (name.length < 2) {
      toast.error(
        "Product name must contain at least 2 characters."
      );
      return false;
    }

    if (!description) {
      toast.error("Product description is required.");
      return false;
    }

    // ---------------------------------------------------------
    // Price
    // ---------------------------------------------------------

    if (!Number.isFinite(price) || price <= 0) {
      toast.error(
        "Selling price must be greater than ₹0."
      );
      return false;
    }

    if (
      comparePrice > 0 &&
      comparePrice < price
    ) {
      toast.error(
        "Original/MRP price cannot be lower than selling price."
      );
      return false;
    }

    // ---------------------------------------------------------
    // Inventory
    // ---------------------------------------------------------

    if (!Number.isFinite(stock) || stock < 0) {
      toast.error("Stock cannot be negative.");
      return false;
    }

    if (!Number.isFinite(lowStock) || lowStock < 0) {
      toast.error(
        "Low stock threshold cannot be negative."
      );
      return false;
    }

    // ---------------------------------------------------------
    // Order quantity
    // ---------------------------------------------------------

    if (!Number.isFinite(minOrder) || minOrder <= 0) {
      toast.error(
        "Minimum order must be greater than 0."
      );
      return false;
    }

    if (!Number.isFinite(maxOrder) || maxOrder <= 0) {
      toast.error(
        "Maximum order must be greater than 0."
      );
      return false;
    }

    if (minOrder > maxOrder) {
      toast.error(
        "Minimum order cannot be greater than maximum order."
      );
      return false;
    }

    if (
      !Number.isFinite(quantityStep) ||
      quantityStep <= 0
    ) {
      toast.error(
        "Quantity step must be greater than 0."
      );
      return false;
    }

    if (quantityStep > maxOrder) {
      toast.error(
        "Quantity step cannot be greater than maximum order."
      );
      return false;
    }

    // ---------------------------------------------------------
    // Category
    // ---------------------------------------------------------

    if (!formData.category) {
      toast.error("Please select a category.");
      return false;
    }

    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      // -------------------------------------------------------
      // BASIC INFO
      // -------------------------------------------------------

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

      // -------------------------------------------------------
      // PRICING
      // -------------------------------------------------------

      data.append(
        "pricePerKg",
        String(formData.pricePerKg)
      );

      data.append(
        "compareAtPricePerKg",
        String(
          formData.compareAtPricePerKg || 0
        )
      );

      // -------------------------------------------------------
      // CATEGORY
      // -------------------------------------------------------

      data.append(
        "category",
        formData.category
      );

      data.append(
        "subcategory",
        formData.subcategory.trim()
      );

      // -------------------------------------------------------
      // INVENTORY
      // -------------------------------------------------------

      data.append(
        "stockKg",
        String(formData.stockKg)
      );

      data.append(
        "lowStockThresholdKg",
        String(formData.lowStockThresholdKg)
      );

      data.append(
        "sku",
        formData.sku.trim().toUpperCase()
      );

      // -------------------------------------------------------
      // PRODUCT DETAILS
      // -------------------------------------------------------

      data.append(
        "size",
        formData.size.trim()
      );

      data.append(
        "color",
        formData.color.trim()
      );

      data.append(
        "flowerType",
        formData.flowerType.trim()
      );

      data.append(
        "occasion",
        formData.occasion.trim()
      );

      // -------------------------------------------------------
      // FLAGS
      // -------------------------------------------------------

      data.append(
        "featured",
        String(formData.featured)
      );

      data.append(
        "bestseller",
        String(formData.bestseller)
      );

      data.append(
        "newArrival",
        String(formData.newArrival)
      );

      data.append(
        "deliveryAvailable",
        String(formData.deliveryAvailable)
      );

      data.append(
        "sameDayDelivery",
        String(formData.sameDayDelivery)
      );

      // -------------------------------------------------------
      // SEO
      // -------------------------------------------------------

      data.append(
        "metaTitle",
        formData.metaTitle.trim()
      );

      data.append(
        "metaDescription",
        formData.metaDescription.trim()
      );

      // -------------------------------------------------------
      // ORDER QUANTITY
      // -------------------------------------------------------

      data.append(
        "minOrderKg",
        String(formData.minOrderKg)
      );

      data.append(
        "maxOrderKg",
        String(formData.maxOrderKg)
      );

      data.append(
        "quantityStepKg",
        String(formData.quantityStepKg)
      );

      // -------------------------------------------------------
      // NEW IMAGE
      // -------------------------------------------------------

      if (image) {
        data.append("image", image);
      }

      // -------------------------------------------------------
      // API REQUEST
      // -------------------------------------------------------

      const response = await axios.put(
        `${API_URL}/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        toast.success(
          "🌸 Product updated successfully!"
        );

        // Cleanup local object URL
        if (preview?.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }

        navigate("/admin/products");
      } else {
        toast.error(
          response.data?.message ||
            "Failed to update product."
        );
      }
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update product.";

      toast.error(`❌ ${message}`);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DISCOUNT
  // =========================================================

  const sellingPrice = Number(
    formData.pricePerKg || 0
  );

  const comparePrice = Number(
    formData.compareAtPricePerKg || 0
  );

  const discount =
    comparePrice > sellingPrice &&
    sellingPrice > 0
      ? Math.round(
          ((comparePrice - sellingPrice) /
            comparePrice) *
            100
        )
      : 0;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl">
            <RefreshCw
              size={40}
              className="animate-spin text-pink-600"
            />
          </div>

          <p className="mt-5 text-lg font-bold text-gray-700">
            Loading product...
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Please wait
          </p>
        </motion.div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8"
        >
          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            disabled={saving}
            className="mb-5 flex items-center gap-2 rounded-xl px-2 py-2 font-semibold text-gray-500 transition hover:text-pink-600 disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-pink-700">
                  Admin
                </span>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-purple-700">
                  Product Editor
                </span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                Edit Product
              </h1>

              <p className="mt-2 max-w-2xl text-gray-500">
                Update your luxury flower product,
                pricing, inventory, delivery and SEO
                settings.
              </p>
            </div>

            <div className="hidden items-center gap-3 rounded-2xl border border-white bg-white/80 px-5 py-4 shadow-lg backdrop-blur-xl md:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100">
                <Flower2
                  size={22}
                  className="text-pink-600"
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Editing
                </p>

                <p className="font-black text-gray-900">
                  {formData.name ||
                    "Flower Product"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <motion.form
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* ===================================================
              PRODUCT IMAGE
          ==================================================== */}

          <section className="overflow-hidden rounded-[30px] border border-white bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-8">
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <ImagePlus
                    size={20}
                    className="text-pink-600"
                  />

                  <span className="text-sm font-black uppercase tracking-wider text-pink-600">
                    Visual
                  </span>
                </div>

                <h2 className="text-2xl font-black text-gray-900">
                  Product Image
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload a new image to replace the
                  current product image.
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
                JPG / PNG / WEBP • Max 5MB
              </div>
            </div>

            <div
              {...getRootProps()}
              className={`group relative min-h-[360px] cursor-pointer overflow-hidden rounded-[28px] border-2 border-dashed transition-all duration-300 ${
                isDragActive
                  ? "border-pink-600 bg-pink-100"
                  : "border-pink-200 bg-pink-50 hover:border-pink-400 hover:bg-pink-100/70"
              }`}
            >
              <input {...getInputProps()} />

              {preview ? (
                <>
                  <img
                    src={preview}
                    alt={
                      formData.name ||
                      "Product preview"
                    }
                    className="h-[360px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="rounded-xl bg-white/95 px-4 py-3 shadow-lg">
                        <p className="flex items-center gap-2 font-bold text-gray-800">
                          <ImagePlus size={18} />
                          Click or drop to replace
                        </p>

                        {image && (
                          <p className="mt-1 text-xs text-green-600">
                            New image selected
                          </p>
                        )}
                      </div>

                      {image && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-red-600"
                        >
                          <Trash2 size={17} />
                          Remove New Image
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[360px] items-center justify-center p-8">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-white shadow-xl">
                      <ImagePlus
                        size={48}
                        className="text-pink-500"
                      />
                    </div>

                    <h3 className="mt-6 text-2xl font-black text-gray-900">
                      Upload Product Image
                    </h3>

                    <p className="mt-2 text-gray-500">
                      Drag & drop or click to select
                    </p>

                    <p className="mt-4 text-xs font-semibold text-gray-400">
                      Recommended: 1200 × 1200px
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ===================================================
              BASIC INFORMATION
          ==================================================== */}

          <section className="rounded-[30px] border border-white bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-8">
            <SectionHeader
              icon={
                <Package
                  size={21}
                  className="text-pink-600"
                />
              }
              eyebrow="Product"
              title="Basic Information"
              description="The main information customers will see."
            />

            <div className="space-y-6">

              {/* NAME */}

              <InputField
                label="Product Name"
                required
                icon={
                  <Package size={20} />
                }
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  placeholder="Premium Red Rose Bouquet"
                  className={inputClass}
                />
              </InputField>

              {/* SHORT DESCRIPTION */}

              <InputField
                label="Short Description"
                hint={`${formData.shortDescription.length}/300`}
              >
                <input
                  type="text"
                  name="shortDescription"
                  value={
                    formData.shortDescription
                  }
                  onChange={handleChange}
                  maxLength={300}
                  placeholder="Fresh premium red roses beautifully arranged."
                  className={inputClass}
                />
              </InputField>

              {/* DESCRIPTION */}

              <InputField
                label="Full Description"
                required
                hint={`${formData.description.length}/3000`}
              >
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={7}
                  maxLength={3000}
                  required
                  placeholder="Describe the flowers, freshness, packaging, arrangement and other important details..."
                  className={`${inputClass} resize-y`}
                />
              </InputField>
            </div>
          </section>

          {/* ===================================================
              PRICING & INVENTORY
          ==================================================== */}

          <section className="rounded-[30px] border border-white bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-8">
            <SectionHeader
              icon={
                <IndianRupee
                  size={21}
                  className="text-green-600"
                />
              }
              eyebrow="Commerce"
              title="Pricing & Inventory"
              description="Manage your selling price, MRP and available stock."
            />

            <div className="grid gap-6 md:grid-cols-2">

              {/* SELLING PRICE */}

              <InputField
                label="Selling Price / KG"
                required
                icon={
                  <IndianRupee size={20} />
                }
              >
                <input
                  type="number"
                  name="pricePerKg"
                  value={formData.pricePerKg}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="999"
                  className={inputClassWithIcon}
                />
              </InputField>

              {/* MRP */}

              <InputField
                label="Original / MRP Price / KG"
                icon={
                  <IndianRupee size={20} />
                }
              >
                <input
                  type="number"
                  name="compareAtPricePerKg"
                  value={
                    formData.compareAtPricePerKg
                  }
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="1299"
                  className={inputClassWithIcon}
                />
              </InputField>

              {/* STOCK */}

              <InputField
                label="Available Stock / KG"
                required
                icon={
                  <Boxes size={20} />
                }
              >
                <input
                  type="number"
                  name="stockKg"
                  value={formData.stockKg}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                  placeholder="25"
                  className={inputClassWithIcon}
                />
              </InputField>

              {/* LOW STOCK */}

              <InputField
                label="Low Stock Alert / KG"
              >
                <input
                  type="number"
                  name="lowStockThresholdKg"
                  value={
                    formData.lowStockThresholdKg
                  }
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="5"
                  className={inputClass}
                />
              </InputField>
            </div>

            {/* DISCOUNT PREVIEW */}

            {discount > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-black text-green-800">
                      Discount Preview
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      Customers will see this
                      product at a discounted price.
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-600 px-4 py-2 text-lg font-black text-white">
                    {discount}% OFF
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          {/* ===================================================
              PRODUCT DETAILS
          ==================================================== */}

          <section className="rounded-[30px] border border-white bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-8">
            <SectionHeader
              icon={
                <Flower2
                  size={21}
                  className="text-pink-600"
                />
              }
              eyebrow="Catalog"
              title="Product Details"
              description="Organize your product for search, categories and filters."
            />

            <div className="grid gap-6 md:grid-cols-2">

              {/* CATEGORY */}

              <InputField
                label="Category"
                required
              >
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={selectClass}
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
              </InputField>

              {/* SUBCATEGORY */}

              <InputField label="Subcategory">
                <input
                  type="text"
                  name="subcategory"
                  value={
                    formData.subcategory
                  }
                  onChange={handleChange}
                  placeholder="Premium Roses"
                  className={inputClass}
                />
              </InputField>

              {/* SKU */}

              <InputField
                label="SKU"
                icon={<Tag size={20} />}
              >
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleSkuChange}
                  maxLength={50}
                  placeholder="ROSE-001"
                  className={inputClassWithIcon}
                />
              </InputField>

              {/* FLOWER TYPE */}

              <InputField
                label="Flower Type"
                icon={
                  <Flower2 size={20} />
                }
              >
                <input
                  type="text"
                  name="flowerType"
                  value={
                    formData.flowerType
                  }
                  onChange={handleChange}
                  placeholder="Red Rose"
                  className={inputClassWithIcon}
                />
              </InputField>

              {/* SIZE */}

              <InputField
                label="Size"
                icon={
                  <Ruler size={20} />
                }
              >
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="Large"
                  className={inputClassWithIcon}
                />
              </InputField>

              {/* COLOR */}

              <InputField
                label="Color"
                icon={
                  <Palette size={20} />
                }
              >
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Red"
                  className={inputClassWithIcon}
                />
              </InputField>

              {/* OCCASIONS */}

              <div className="md:col-span-2">
                <InputField label="Occasions">
                  <input
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    placeholder="Birthday, Anniversary, Wedding"
                    className={inputClass}
                  />
                </InputField>

                <p className="mt-2 text-xs text-gray-400">
                  Separate multiple occasions
                  using commas.
                </p>
              </div>
            </div>
          </section>

          {/* ===================================================
              ORDER QUANTITY
          ==================================================== */}

          <section className="rounded-[30px] border border-white bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-8">
            <SectionHeader
              icon={
                <ShoppingBag
                  size={21}
                  className="text-purple-600"
                />
              }
              eyebrow="Orders"
              title="Order Quantity"
              description="Control how customers can purchase this product."
            />

            <div className="grid gap-6 md:grid-cols-3">

              <InputField label="Minimum Order KG">
                <input
                  type="number"
                  name="minOrderKg"
                  value={formData.minOrderKg}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className={inputClass}
                />
              </InputField>

              <InputField label="Maximum Order KG">
                <input
                  type="number"
                  name="maxOrderKg"
                  value={formData.maxOrderKg}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className={inputClass}
                />
              </InputField>

              <InputField label="Quantity Step KG">
                <input
                  type="number"
                  name="quantityStepKg"
                  value={
                    formData.quantityStepKg
                  }
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className={inputClass}
                />
              </InputField>
            </div>
          </section>

          {/* ===================================================
              PRODUCT SETTINGS
          ==================================================== */}

          <section className="rounded-[30px] border border-white bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-8">
            <SectionHeader
              icon={
                <Sparkles
                  size={21}
                  className="text-yellow-500"
                />
              }
              eyebrow="Visibility"
              title="Product Settings"
              description="Control how this product appears across your store."
            />

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
                icon={
                  <ShoppingBag
                    size={20}
                    className="text-purple-500"
                  />
                }
                label="Bestseller"
                description="Mark this product as a bestseller."
              />

              <Toggle
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
                icon={
                  <Sparkles
                    size={20}
                    className="text-blue-500"
                  />
                }
                label="New Arrival"
                description="Display this product as a new arrival."
              />

              <Toggle
                name="deliveryAvailable"
                checked={
                  formData.deliveryAvailable
                }
                onChange={handleChange}
                icon={
                  <Truck
                    size={20}
                    className="text-green-500"
                  />
                }
                label="Delivery Available"
                description="Allow customers to order this product."
              />

              <Toggle
                name="sameDayDelivery"
                checked={
                  formData.sameDayDelivery
                }
                onChange={handleChange}
                icon={
                  <Truck
                    size={20}
                    className="text-pink-500"
                  />
                }
                label="Same Day Delivery"
                description="Enable same-day delivery for this product."
              />
            </div>
          </section>

          {/* ===================================================
              SEO
          ==================================================== */}

          <section className="rounded-[30px] border border-white bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-8">
            <SectionHeader
              icon={
                <Search
                  size={21}
                  className="text-blue-600"
                />
              }
              eyebrow="Search Engine"
              title="SEO Settings"
              description="Improve how this product appears in Google and other search engines."
            />

            <div className="space-y-6">

              <InputField
                label="Meta Title"
                hint={`${formData.metaTitle.length}/160`}
              >
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  maxLength={160}
                  placeholder="Premium Red Rose Bouquet | The Flower Shop"
                  className={inputClass}
                />
              </InputField>

              <InputField
                label="Meta Description"
                hint={`${formData.metaDescription.length}/320`}
              >
                <textarea
                  name="metaDescription"
                  value={
                    formData.metaDescription
                  }
                  onChange={handleChange}
                  maxLength={320}
                  rows={5}
                  placeholder="Buy premium fresh red roses online from The Flower Shop. Beautifully arranged and delivered fresh."
                  className={`${inputClass} resize-y`}
                />
              </InputField>
            </div>
          </section>

          {/* ===================================================
              SAVE BAR
          ==================================================== */}

          <div className="sticky bottom-4 z-30">
            <div className="rounded-[28px] border border-white bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:p-4">
              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/products")
                  }
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>
        </motion.form>
      </div>
    </div>
  );
}

// =============================================================
// REUSABLE SECTION HEADER
// =============================================================

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mb-7">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50">
          {icon}
        </div>

        <span className="text-xs font-black uppercase tracking-[0.15em] text-gray-400">
          {eyebrow}
        </span>
      </div>

      <h2 className="text-2xl font-black text-gray-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

// =============================================================
// REUSABLE INPUT FIELD
// =============================================================

function InputField({
  label,
  required = false,
  hint,
  icon,
  children,
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 font-bold text-gray-900">
          {icon && (
            <span className="text-gray-400">
              {icon}
            </span>
          )}

          {label}

          {required && (
            <span className="text-pink-600">
              *
            </span>
          )}
        </label>

        {hint && (
          <span className="text-xs font-medium text-gray-400">
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

// =============================================================
// TOGGLE
// =============================================================

function Toggle({
  name,
  checked,
  onChange,
  label,
  description,
  icon,
}) {
  return (
    <label
      className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 ${
        checked
          ? "border-pink-200 bg-pink-50"
          : "border-gray-100 bg-gray-50 hover:border-pink-100 hover:bg-pink-50/50"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm transition ${
              checked
                ? "bg-white"
                : "bg-white"
            }`}
          >
            {icon}
          </div>
        )}

        <div>
          <p className="font-bold text-gray-900">
            {label}
          </p>

          <p className="mt-1 text-sm leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      {/* Custom Toggle */}

      <div className="relative shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />

        <div className="h-7 w-12 rounded-full bg-gray-300 transition peer-checked:bg-pink-600 peer-focus:ring-4 peer-focus:ring-pink-100" />

        <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

// =============================================================
// INPUT CLASSES
// =============================================================

const inputClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100";

const inputClassWithIcon =
  "w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100";

const selectClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100";