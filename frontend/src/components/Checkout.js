import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [orderSummary, setOrderSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const placeOrder = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.post(
            "/api/orders/place",
            {},
            {
              headers: { Authorization: token },
            }
          );
          setOrderSummary(response.data);
        } catch (err) {
          console.error(err);
          navigate("/cart");
        }
      }
    };

    placeOrder();
  }, [navigate]);

  if (!orderSummary) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Order Summary</h2>
      <p>Order ID: {orderSummary.orderId}</p>
      <p>Total Amount: ${orderSummary.totalAmount}</p>
      <ul>
        {orderSummary.items.map(item => (
          <li key={item.productId._id}>
            {item.productId.name} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Checkout;
