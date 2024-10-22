const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cartId: { type: String, default: uuidv4 },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
