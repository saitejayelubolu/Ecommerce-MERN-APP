const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, default: uuidv4 },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "delivered"], default: "pending" },
  paymentMethod: { type: String, enum: ["cash"], default: "cash" },
});

module.exports = mongoose.model("Order", orderSchema);
