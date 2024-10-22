const express = require("express");
const product = require("../models/Product");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const config = require("../helper/config");
const { uploadImages } = require("../helper/uploadToCloudinary");
// const { auth } = require("../middleware/auth");
const multer = require("multer");
const auth = require("../middleware/auth");
const upload = multer();
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
  secure: true,
});

// Add a new product (Admin)
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  auth,
  async (req, res) => {
    const newProduct = new product();
    try {
      let path = "/images/";
      let uploadResponse = await uploadImages(req.files.image[0].buffer, path);
      // console.log(uploadResponse);
      newProduct.image = uploadResponse.secure_url;
    } catch (err) {
      res.status(401).json({
        status: false,
        message: "Item media upload failed.",
        error: err,
      });
      return;
    }
    try {
      newProduct.name = req.body.name;
      newProduct.description = req.body.description;
      newProduct.originalPrice = req.body.originalPrice;
      newProduct.discountPrice = req.body.discountPrice;
      newProduct.sellingPrice = req.body.sellingPrice;
      newProduct.quantity = req.body.quantity;
      newProduct.UOM = req.body.UOM;
      newProduct.HSNCode = req.body.HSNCode;
      await newProduct
        .save()
        .then(newObj => {
          res.send(newObj);
        })
        .catch(err => {
          res.status(500).json(err);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
