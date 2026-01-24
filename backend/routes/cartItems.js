import express from "express";
import { CartItem } from "../models/CartItem.js";
import { Product } from "../models/Product.js";
import { DeliveryOption } from "../models/DeliveryOption.js";
import { Offer } from "../models/Offer.js";
import { Store } from "../models/Store.js";

const router = express.Router();

const toInt = (v) => {
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
};

const validateQuantity = (q) => {
  return Number.isInteger(q) && q >= 1 && q <= 10;
};

router.get("/", async (req, res) => {
  try {
    const expand = req.query.expand;
    const items = await CartItem.findAll();

    if (expand !== "product") {
      return res.json(items);
    }

    const offerIds = items.map((i) => i.offerId).filter(Boolean);

    const offers = await Offer.findAll({ where: { id: offerIds } });
    const offerById = new Map(offers.map((o) => [o.id, o]));

    const productIds = offers.map((o) => o.productId).filter(Boolean);
    const storeIds = offers.map((o) => o.storeId).filter(Boolean);

    const products = await Product.findAll({ where: { id: productIds } });
    const stores = await Store.findAll({ where: { id: storeIds } });

    const productById = new Map(products.map((p) => [p.id, p]));
    const storeById = new Map(stores.map((s) => [s.id, s]));

    const enriched = items.map((item) => {
      const offer = offerById.get(item.offerId) ?? null;
      const product = offer ? (productById.get(offer.productId) ?? null) : null;
      const store = offer ? (storeById.get(offer.storeId) ?? null) : null;

      return {
        ...item.toJSON(),
        offer,
        store,
        product,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("GET /cart-items error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const offerId = req.body.offerId ? toInt(req.body.offerId) : null;
    const productId = req.body.productId ? toInt(req.body.productId) : null;
    const storeId = req.body.storeId ? toInt(req.body.storeId) : null;
    const quantity = toInt(req.body.quantity);

    if (!validateQuantity(quantity)) {
      return res.status(400).json({ error: "Quantity must be integer between 1 and 10" });
    }

    let resolvedOffer = null;

    if (offerId) {
      resolvedOffer = await Offer.findByPk(offerId);
    } else if (productId) {
      const where = { productId, inStock: true };
      if (storeId) where.storeId = storeId;

      resolvedOffer = await Offer.findOne({
        where,
        order: [["priceCents", "ASC"]],
      });
    }

    if (!resolvedOffer) {
      return res.status(400).json({ error: "Offer not found (or out of stock)" });
    }

    let cartItem = await CartItem.findOne({ where: { offerId: resolvedOffer.id } });

    if (cartItem) {
      cartItem.quantity = Math.min(10, cartItem.quantity + quantity);
      await cartItem.save();
      return res.status(200).json(cartItem);
    }

    cartItem = await CartItem.create({
      offerId: resolvedOffer.id,
      quantity,
      deliveryOptionId: 1,
    });

    res.status(201).json(cartItem);
  } catch (err) {
    console.error("POST /cart-items error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid cart item id" });

    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

    const hasQuantity = req.body.quantity !== undefined;
    const hasDelivery = req.body.deliveryOptionId !== undefined;

    if (!hasQuantity && !hasDelivery) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    if (hasQuantity) {
      const quantity = toInt(req.body.quantity);
      if (!validateQuantity(quantity)) {
        return res.status(400).json({ error: "Quantity must be integer between 1 and 10" });
      }
      cartItem.quantity = quantity;
    }

    if (hasDelivery) {
      const deliveryOptionId = toInt(req.body.deliveryOptionId);
      if (!deliveryOptionId) {
        return res.status(400).json({ error: "Invalid delivery option id" });
      }

      const deliveryOption = await DeliveryOption.findByPk(deliveryOptionId);
      if (!deliveryOption) {
        return res.status(400).json({ error: "Invalid delivery option" });
      }

      cartItem.deliveryOptionId = deliveryOptionId;
    }

    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    console.error("PUT /cart-items/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid cart item id" });

    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

    await cartItem.destroy();
    res.sendStatus(204);
  } catch (err) {
    console.error("DELETE /cart-items/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;