import React, { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddProduct = async e => {
    e.preventDefault();

    // Validation
    if (!productName || !productPrice) {
      setError("Please fill in all required fields");
      return;
    }

    // Create the product data object
    const newProduct = {
      name: productName,
      description: productDescription,
      price: productPrice,
    };

    try {
      // Send the POST request to your backend
      const response = await axios.post(
        "http://localhost:5000/api/products",
        newProduct
      );
      setSuccess("Product added successfully!");
      setError(""); // Clear error if successful
    } catch (err) {
      setError("Error adding product, please try again.");
      setSuccess(""); // Clear success if there’s an error
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleAddProduct}>
        <div>
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Product Description</label>
          <input
            type="text"
            value={productDescription}
            onChange={e => setProductDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Product Price</label>
          <input
            type="number"
            value={productPrice}
            onChange={e => setProductPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
