import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";
import { useModal, MODAL_TYPES } from "../../../components";
import {
  getProductByIdApi,
  updateProductApi,
  handleDeleteProductApi,
  ProductHeaderDetail,
  ProductImageCard,
  ProductPricingCard,
  ProductSpecsCard,
  ProductDescriptionCard,
  ProductIdInfo,
} from "../index";
import { ArrowLeft, Loader2, PackageX } from "lucide-react";

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_weight: "",
    product_weight_type: "none",
    product_cost_price: "",
    product_selling_price: "",
    product_offer_price: "",
    product_description: "",
    is_product_in_stock: true,
    is_offer_available: false,
    show_in_menu: true,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductByIdApi(productId);
        if (!isMounted) return;

        if (!data || !data.success || !data.product) {
          toast.error(data?.message || "Product not found");
          setProduct(null);
          return;
        }
        setProduct(data.product);
        setFormData({
          product_name: data.product.product_name || "",
          product_weight: data.product.product_weight || "",
          product_weight_type: data.product.product_weight_type || "none",
          product_cost_price: data.product.product_cost_price || "",
          product_selling_price: data.product.product_selling_price || "",
          product_offer_price: data.product.product_offer_price || "",
          product_description: data.product.product_description || "",
          is_product_in_stock: data.product.is_product_in_stock !== false,
          is_offer_available: data.product.is_offer_available === true,
          show_in_menu: data.product.show_in_menu !== false,
        });
      } catch (error) {
        if (isMounted) {
          toast.error(error.message || "Failed to load product");
          setProduct(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "product_cost_price" ||
        name === "product_selling_price" ||
        name === "product_offer_price" ||
        name === "product_weight"
          ? value.replace(",", ".")
          : value,
    }));
  };

  const handleCancel = () => {
    if (product) {
      setFormData({
        product_name: product.product_name || "",
        product_weight: product.product_weight || "",
        product_weight_type: product.product_weight_type || "none",
        product_cost_price: product.product_cost_price || "",
        product_selling_price: product.product_selling_price || "",
        product_offer_price: product.product_offer_price || "",
        product_description: product.product_description || "",
        is_product_in_stock: product.is_product_in_stock !== false,
        is_offer_available: product.is_offer_available === true,
        show_in_menu: product.show_in_menu !== false,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async (extraFields = {}) => {
    const mergedData = { ...formData, ...extraFields };

    if (!mergedData.product_name.trim()) {
      return toast.error("Product name cannot be empty");
    }
    if (!mergedData.product_selling_price || Number(mergedData.product_selling_price) <= 0) {
      return toast.error("Selling price must be greater than 0");
    }
    if (mergedData.is_offer_available) {
      if (!mergedData.product_offer_price || Number(mergedData.product_offer_price) <= 0) {
        return toast.error("Offer price must be greater than 0 when offer is active");
      }
      if (Number(mergedData.product_offer_price) >= Number(mergedData.product_selling_price)) {
        return toast.error("Offer price must be less than regular selling price");
      }
    }

    setSaving(true);
    try {
      const payload = {
        product_name: mergedData.product_name.trim(),
        product_weight: mergedData.product_weight ? Number(mergedData.product_weight) : undefined,
        product_weight_type: mergedData.product_weight_type,
        product_cost_price: mergedData.product_cost_price ? Number(mergedData.product_cost_price) : 0,
        product_selling_price: Number(mergedData.product_selling_price),
        product_offer_price: mergedData.is_offer_available && mergedData.product_offer_price ? Number(mergedData.product_offer_price) : null,
        product_description: mergedData.product_description.trim(),
        is_product_in_stock: Boolean(mergedData.is_product_in_stock),
        is_offer_available: Boolean(mergedData.is_offer_available),
        show_in_menu: Boolean(mergedData.show_in_menu),
      };

      const sellerId = currentUser?.store_id || currentUser?._id;
      const res = await updateProductApi(productId, payload, sellerId);

      if (res && res.success) {
        toast.success("Product updated successfully!");
        setProduct((prev) => ({ ...prev, ...payload }));
        setIsEditing(false);
      } else {
        toast.error(res?.message || "Failed to update product");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    openModal(MODAL_TYPES.CONFIRM, {
      title: "Delete Product?",
      message: `Are you sure you want to delete "${product?.product_name || "this product"}"? This will permanently remove it from your inventory.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          await handleDeleteProductApi(productId, currentUser, (updated) => dispatch(updateUser(updated)));
          toast.success("Product deleted successfully");
          navigate("/product-list");
        } catch (error) {
          toast.error(error.message || "Failed to delete product");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <div className="text-gray-500 font-semibold text-xs animate-pulse">
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 border border-amber-200 shadow-xs">
          <PackageX size={28} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Product Not Found</h2>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          The requested product could not be located or may have been removed.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border-none"
        >
          <ArrowLeft size={14} />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto px-4 py-2">
      {/* Header component */}
      <ProductHeaderDetail
        productName={isEditing ? formData.product_name : product.product_name}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saving={saving}
        onSave={handleSave}
        onCancel={handleCancel}
        isInStock={isEditing ? formData.is_product_in_stock : product.is_product_in_stock}
        isOfferAvailable={isEditing ? formData.is_offer_available : product.is_offer_available}
        showInMenu={isEditing ? formData.show_in_menu : product.show_in_menu}
        onDelete={handleDelete}
      />

      {/* Grid Layout (like OrderDetailPage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Product Specs & Image (colspan 8) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <ProductImageCard
                productUrl={product.product_url}
                productName={product.product_name}
              />
            </div>
            <div>
              <ProductSpecsCard
                isEditing={isEditing}
                formData={formData}
                onChange={handleChange}
                product={product}
              />
            </div>
          </div>

          <div>
            <ProductDescriptionCard
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
              product={product}
            />
          </div>
        </div>

        {/* Right Side: Pricing & Metadata (colspan 4) */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <ProductPricingCard
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
              product={product}
            />
          </div>

          <div>
            <ProductIdInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
