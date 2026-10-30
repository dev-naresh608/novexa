import Stripe from "stripe";
import { config } from "../../configs/config.js";

let stripeClient = null;

const getStripe = () => {
  const stripeKey =
    config.stripe?.secret_key ||
    config.STRIPE?.secret_key ||
    process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(stripeKey);
  }
  return stripeClient;
};

const isValidHttpsUrl = (url) => {
  try {
    return (
      typeof url === "string" &&
      (url.startsWith("https://") || url.startsWith("http://"))
    );
  } catch {
    return false;
  }
};

export const handleCreateCheckout = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message:
          "Stripe is not configured. Please add STRIPE_SECRET_KEY to your server environment variables.",
      });
    }

    const { product, items, products, priceDetails, orderId, customerId } =
      req.body;

    const clientUrl =
      config.stripe?.client_url ||
      config.STRIPE?.client_url ||
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:3000";

    const normalizedClientUrl = clientUrl.startsWith("http")
      ? clientUrl.replace(/\/$/, "")
      : "http://localhost:3000";

    const currency = (
      req.body.currency ||
      config.stripe?.currency ||
      "inr"
    ).toLowerCase();

    const line_items = [];

    // Case 1: Multiple items from Cart (Novexa's main flow)
    const cartItems = items || products || [];
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      for (const item of cartItems) {
        const name =
          item.product_name ||
          item.name ||
          item.title ||
          "Grocery Item";

        const price = Number(
          item.product_offer_price ||
            item.product_selling_price ||
            item.price ||
            0,
        );

        const qty = Number(item.product_qty || item.qty || item.quantity || 1);

        if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty < 1) {
          continue;
        }

        const imageUrl = item.product_url || item.image;
        const images = isValidHttpsUrl(imageUrl) ? [imageUrl] : [];

        line_items.push({
          price_data: {
            currency,
            product_data: {
              name,
              description: item.product_weight
                ? `Weight: ${item.product_weight} ${item.product_weight_type || ""}`
                : item.product_description || undefined,
              images: images.length > 0 ? images : undefined,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: qty,
        });
      }

      // Add delivery charge if present
      const deliveryCharge = Number(priceDetails?.deliveryCharge || 0);
      if (deliveryCharge > 0) {
        line_items.push({
          price_data: {
            currency,
            product_data: {
              name: "Delivery Charge",
              description: "Fast doorstep delivery",
            },
            unit_amount: Math.round(deliveryCharge * 100),
          },
          quantity: 1,
        });
      }

      // Add GST & Taxes if present
      const taxPrice = Number(priceDetails?.taxPrice || 0);
      if (taxPrice > 0) {
        line_items.push({
          price_data: {
            currency,
            product_data: {
              name: "GST & Taxes (2%)",
            },
            unit_amount: Math.round(taxPrice * 100),
          },
          quantity: 1,
        });
      }
    }

    // Case 2: Single product checkout payload (from user code sample)
    if (line_items.length === 0 && product) {
      const name = product.product_name || product.name || "Product";
      const price = Number(
        product.product_offer_price ||
          product.product_selling_price ||
          product.price ||
          0,
      );
      const qty = Number(
        product.product_qty || product.qty || product.quantity || 1,
      );

      if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid product details",
        });
      }

      const imageUrl =
        product.product_url ||
        (Array.isArray(product.images) ? product.images[0] : product.images);
      const images = isValidHttpsUrl(imageUrl) ? [imageUrl] : [];

      line_items.push({
        price_data: {
          currency,
          product_data: {
            name,
            description: product.product_description || product.description,
            images: images.length > 0 ? images : undefined,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: qty,
      });
    }

    if (line_items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found for checkout",
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${normalizedClientUrl}/active-orders?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${normalizedClientUrl}/cart?payment=cancelled`,
      metadata: {
        orderId: orderId ? String(orderId) : "",
        customerId: customerId ? String(customerId) : "",
      },
    });

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
      session,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create checkout session",
    });
  }
};
