const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  originalPrice: { type: Number, required: true },
  discountPrice: { type: Number },
  sellingPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  UOM: { type: String, required: true },
  HSNCode: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
