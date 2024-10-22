import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/orders", {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          setOrders(res.data);
          console.log(res.data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>All Orders</h2>
      {orders.map(order => (
        <div key={order._id}>
          <h2>Order ID: {order.orderId}</h2>
          <p>Status: {order.status}</p>
          <p>Payment Method: {order.paymentMethod}</p>

          <h3>Items:</h3>
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Original Price</th>
                <th>Discount Price</th>
                <th>Selling Price</th>
                <th>Quantity Ordered</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item._id}>
                  {item.productId ? (
                    <>
                      <td>
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          style={{ width: "100px", height: "100px" }}
                        />
                      </td>
                      <td>{item.productId.name}</td>
                      <td>{item.productId.description}</td>
                      <td>${item.productId.originalPrice}</td>
                      <td>${item.productId.discountPrice}</td>
                      <td>${item.productId.sellingPrice}</td>
                      <td>{item.quantity}</td>
                    </>
                  ) : (
                    <td colSpan="7">Product details not available</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <p>Total Amount: ${order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
