const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const router = express.Router();

// Place an order (Cash on Delivery)
router.post("/place", auth, async (req, res) => {
  try {
    console.log("userID", req.decoded.id._id);

    const cart = await Cart.findOne({ userId: req.decoded.id._id }).populate(
      "items.productId"
    );
    console.log("cart", cart);
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ msg: "Cart is empty" });

    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.productId.sellingPrice * item.quantity;
    }, 0);

    const newOrder = new Order({
      userId: req.decoded.id._id,
      items: cart.items,
      totalAmount,
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId: req.decoded.id._id });

    res.json(newOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// View user orders
router.get("/myorders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate(
      "items.productId"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// View all orders (Admin only)
router.get("/", auth, async (req, res) => {
  if (req.decoded.id.role !== "admin")
    return res.status(403).json({ msg: "Access denied" });

  try {
    const orders = await Order.find().populate("items.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
