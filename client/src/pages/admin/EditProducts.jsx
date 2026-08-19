import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  Save,
  Upload,
  ImagePlus,
  Package,
  IndianRupee,
  Boxes,
  Star,
  Tag,
  Truck,
  X,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/products";
const SERVER_URL = "http://localhost:5000";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",

    pricePerKg: "",
    compareAtPricePerKg: "",
    discountPercentage: "",

    category: "",
    subcategory: "",

    stockKg: "",
    lowStockThresholdKg: "",

    sku: "",

    size: "",
    color: "",
    flowerType: "",
    occasion: "",

    minOrderKg: "1",
    maxOrderKg: "20",
    quantityStepKg: "1",

    featured: false,
    bestseller: false,
    newArrival: true,
    isActive: true,

    deliveryAvailable: true,
    sameDayDelivery: false,

    metaTitle: "",
    metaDescription: "",
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

      const response = await axios.get(
        `${API_URL}/${id}`
      );

      if (!response.data?.success) {
        toast.error("Product not found");
        navigate("/admin/products");
        return;
      }

      const product = response.data.product;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        shortDescription:
          product.shortDescription || "",

        pricePerKg:
          product.pricePerKg ?? "",

        compareAtPricePerKg:
          product.compareAtPricePerKg ?? "",

        discountPercentage:
          product.discountPercentage ?? "",

        category: product.category || "",
        subcategory: product.subcategory || "",

        stockKg:
          product.stockKg ?? "",

        lowStockThresholdKg:
          product.lowStockThresholdKg ?? 5,

        sku: product.sku || "",

        size: product.size || "",
        color: product.color || "",
        flowerType: product.flowerType || "",

        occasion: Array.isArray(product.occasion)
          ? product.occasion.join(", ")
          : product.occasion || "",

        minOrderKg:
          product.minOrderKg ?? 1,

        maxOrderKg:
          product.maxOrderKg ?? 20,

        quantityStepKg:
          product.quantityStepKg ?? 1,

        featured: Boolean(product.featured),
        bestseller: Boolean(product.bestseller),
        newArrival:
          product.newArrival !== false,

        isActive:
          product.isActive !== false,

        deliveryAvailable:
          product.deliveryAvailable !== false,

        sameDayDelivery:
          Boolean(product.sameDayDelivery),

        metaTitle:
          product.metaTitle || "",

        metaDescription:
          product.metaDescription || "",
      });

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
          "❌ Failed to load product"
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
  // IMAGE UPLOAD
  // =====================================================

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const {
    getRootProps,
    getInputProps,
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

    const currentProductImage =
      formData.image;

    if (currentProductImage) {
      setPreview(
        getImageUrl(currentProductImage)
      );
    } else {
      setPreview("");
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setProgress(0);

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
        formData.sku.trim()
      );

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
        formData.occasion
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
        "isActive",
        formData.isActive
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
        formData.metaTitle.trim()
      );

      data.append(
        "metaDescription",
        formData.metaDescription.trim()
      );

      if (image) {
        data.append("image", image);
      }

      const response = await axios.put(
        `${API_URL}/${id}`,
        data,
        {
          onUploadProgress: (event) => {
            if (!event.total) return;

            const percent = Math.round(
              (event.loaded * 100) /
                event.total
            );

            setProgress(percent);
          },
        }
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
        <div className="text-center">
          <RefreshCw
            size={45}
            className="mx-auto animate-spin text-pink-600"
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
              className="mb-5 flex items-center gap-2 font-semibold text-gray-600 transition hover:text-pink-600"
            >
              <ArrowLeft size={18} />
              Back to Products
            </button>

            <h1 className="text-4xl font-black text-gray-900 md:text-5xl">
              Edit Product
            </h1>

            <p className="mt-2 text-gray-500">
              Update your luxury flower
              product details.
            </p>

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
          className="space-y-8"
        >

          {/* IMAGE */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <div className="mb-5 flex items-center gap-3">
              <ImagePlus
                className="text-pink-600"
              />

              <h2 className="text-2xl font-black">
                Product Image
              </h2>
            </div>

            <div
              {...getRootProps()}
              className="relative flex min-h-[350px] cursor-pointer items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed border-pink-300 bg-pink-50 transition hover:border-pink-500"
            >

              <input {...getInputProps()} />

              {preview ? (
                <>
                  <img
                    src={preview}
                    alt={formData.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
                    <div className="rounded-2xl bg-white px-5 py-3 font-bold text-gray-900 shadow-xl">
                      Click to replace image
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">

                  <ImagePlus
                    size={65}
                    className="mx-auto text-pink-500"
                  />

                  <h3 className="mt-4 text-2xl font-black">
                    Drag & Drop Image
                  </h3>

                  <p className="mt-2 text-gray-500">
                    Click to upload a new
                    product image
                  </p>

                </div>
              )}

            </div>

            {image && (
              <button
                type="button"
                onClick={removeImage}
                className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 font-bold text-red-600 hover:bg-red-600 hover:text-white"
              >
                <X size={17} />
                Remove New Image
              </button>
            )}

          </section>

          {/* BASIC INFO */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <div className="mb-6 flex items-center gap-3">
              <Package className="text-pink-600" />

              <h2 className="text-2xl font-black">
                Basic Information
              </h2>
            </div>

            <div className="space-y-6">

              <div>
                <label className="mb-2 block font-bold">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

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
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={3000}
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />

                <div className="mt-2 text-right text-sm text-gray-400">
                  {formData.description.length}
                  /3000
                </div>
              </div>

            </div>

          </section>

          {/* PRICING */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <div className="mb-6 flex items-center gap-3">
              <IndianRupee className="text-pink-600" />

              <h2 className="text-2xl font-black">
                Pricing
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

              <div>
                <label className="mb-2 block font-bold">
                  Selling Price / KG
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="pricePerKg"
                  value={formData.pricePerKg}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Original Price / KG
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="compareAtPricePerKg"
                  value={
                    formData.compareAtPricePerKg
                  }
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Calculated Discount
                </label>

                <div className="flex h-[58px] items-center rounded-2xl bg-green-50 px-4 font-black text-green-700">
                  {formData.discountPercentage || 0}%
                  OFF
                </div>
              </div>

            </div>

          </section>

          {/* INVENTORY */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <div className="mb-6 flex items-center gap-3">
              <Boxes className="text-pink-600" />

              <h2 className="text-2xl font-black">
                Inventory & Quantity
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

              <div>
                <label className="mb-2 block font-bold">
                  Stock KG
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="stockKg"
                  value={formData.stockKg}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Low Stock Alert KG
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="lowStockThresholdKg"
                  value={
                    formData.lowStockThresholdKg
                  }
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
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
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 uppercase outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                />
              </div>

            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">

              <div>
                <label className="mb-2 block font-bold">
                  Minimum Order KG
                </label>

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  name="minOrderKg"
                  value={formData.minOrderKg}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Maximum Order KG
                </label>

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  name="maxOrderKg"
                  value={formData.maxOrderKg}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Quantity Step KG
                </label>

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  name="quantityStepKg"
                  value={
                    formData.quantityStepKg
                  }
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500"
                />
              </div>

            </div>

          </section>

          {/* CATEGORY */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <div className="mb-6 flex items-center gap-3">
              <Tag className="text-pink-600" />

              <h2 className="text-2xl font-black">
                Product Details
              </h2>
            </div>

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
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 outline-none focus:border-pink-500"
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="bouquet">
                    Bouquet
                  </option>

                  <option value="rose">
                    Rose
                  </option>

                  <option value="birthday">
                    Birthday
                  </option>

                  <option value="wedding">
                    Wedding
                  </option>

                  <option value="luxury">
                    Luxury
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
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Flower Type
                </label>

                <input
                  type="text"
                  name="flowerType"
                  value={formData.flowerType}
                  onChange={handleChange}
                  placeholder="Rose, Lily, Tulip..."
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500"
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
                  placeholder="Small, Medium, Large"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500"
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
                  placeholder="Red, White, Pink..."
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Occasions
                </label>

                <input
                  type="text"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  placeholder="Birthday, Wedding, Anniversary"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500"
                />
              </div>

            </div>

          </section>

          {/* FLAGS */}

          <section className="rounded-[30px] border border-white bg-white/80 p-6 shadow-xl backdrop-blur-xl md:p-8">

            <div className="mb-6 flex items-center gap-3">
              <Star className="text-pink-600" />

              <h2 className="text-2xl font-black">
                Product Status
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <Checkbox
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                label="Featured Product"
              />

              <Checkbox
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
                label="Bestseller"
              />

              <Checkbox
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
                label="New Arrival"
              />

              <Checkbox
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                label="Product Active"
              />

              <Checkbox
                name="deliveryAvailable"
                checked={
                  formData.deliveryAvailable
                }
                onChange={handleChange}
                label="Delivery Available"
              />

              <Checkbox
                name="sameDayDelivery"
                checked={
                  formData.sameDayDelivery
                }
                onChange={handleChange}
                label="Same Day Delivery"
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
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none focus:border-pink-500"
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
                  rows={4}
                  maxLength={320}
                  className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-pink-500"
                />
              </div>

            </div>

          </section>

          {/* PROGRESS */}

          {saving && (
            <div className="overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          )}

          {/* SAVE */}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 py-5 text-lg font-black text-white shadow-xl shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
          >

            {saving ? (
              <>
                <RefreshCw
                  size={21}
                  className="animate-spin"
                />

                Updating {progress}%
              </>
            ) : (
              <>
                <Save size={21} />

                Save Changes
              </>
            )}

          </button>

        </motion.form>

      </div>
    </div>
  );
}

// =====================================================
// CHECKBOX
// =====================================================

function Checkbox({
  name,
  checked,
  onChange,
  label,
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-pink-100 bg-pink-50 p-5 transition hover:bg-pink-100">

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-pink-600"
      />

      <span className="font-bold text-gray-800">
        {label}
      </span>

    </label>
  );
}