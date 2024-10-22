const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const router = express.Router();

// Add item to cart
router.post("/add", auth, async (req, res) => {
  const { productId, quantity } = req.body;
  // console.log("auth", req.decoded.id._id);

  try {
    let cart = await Cart.findOne({ userId: req.decoded.id._id });

    console.log("userID", req.decoded.id._id);

    if (!cart) {
      cart = new Cart({ userId: req.decoded.id._id, items: [] });
    }
    // console.log("cart", cart);
    const product = await Product.findById(productId);
    // console.log("product", product);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    console.log("cart saving", cart);
    await cart.save();
    res.json(cart.items);
    Product.findByIdAndUpdate(
      { _id: productId },
      { $inc: { quantity: -quantity } }
    )
      .then(productObj => console.log("productObj", productObj))
      .catch(err => res.status(500).send(err));
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get cart items for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.decoded.id._id }).populate(
      "items.productId"
    );
    if (!cart) return res.json({ items: [] });
    res.json(cart.items);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove item from cart
router.delete("/remove/:id", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.decoded.id._id });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = cart.items.filter(
      item => item.productId.toString() !== req.params.id
    );
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
