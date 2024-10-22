import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/esm/FormGroup";
// import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Container, CardFooter, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState();
  const [show, setShow] = useState(false);
  const token = localStorage.getItem("token");
  // const [cartErr, setCartErr] = useState("");
  // const [cartEmpty, setCartEmpty] = useState(false);
  const handleClose = () => {
    setShow(false);
    navigate("/");
  };
  const handleRemove = async productId => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleCheckout = async () => {
    if (token) {
      await axios
        .post(
          `http://localhost:5000/api/orders/place`,
          {},
          {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(orderObj => {
          if (!orderObj.data) {
            // setCartErr("Cart is Empty");
            // setCartEmpty(true);
          }
          setOrderSummary(orderObj.data);
          // alert("Order Successfully placed..!");
          setShow(true);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/cart", {
            headers: { Authorization: token },
          });
          setCartItems(res.data);
          console.log("cart: ", res.data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchCart();
  }, []);

  return (
    <div className="row pb-4">
      <h2 className="text-center text-primary">Shopping Cart</h2>
      {/* {cartEmpty ? (
        <p>Cart is Empty</p>
      ) : ( */}
      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Product Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Original Price</th>
              <th scope="col">Discount</th>
              <th scope="col">Selling Price</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr>
                <th>{item.productId.name}</th>
                <td>{item.quantity}</td>
                <td>{item.productId.originalPrice}</td>
                <td>{item.productId.discountPrice}</td>
                <td>{item.productId.sellingPrice}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemove(item.productId._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2 text-center">
          <button className="btn btn-primary" onClick={() => handleCheckout()}>
            Proceed to Checkout
          </button>
        </div>
      </div>
      {/* )} */}
      {/* Order Summary */}
      {orderSummary ? (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Order Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fs-bold">Order ID</Form.Label>
                <Form.Control
                  type="text"
                  name="orderId"
                  value={orderSummary.orderId}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-bold">Payment Method</Form.Label>
                <Form.Control
                  type="text"
                  name="paymentMethod"
                  value={orderSummary.paymentMethod}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-bold">Status</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  value={orderSummary.status}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-bold">Total Amount</Form.Label>
                <Form.Control
                  type="text"
                  name="totalAmount"
                  value={orderSummary.totalAmount}
                />
              </Form.Group>
              <FormGroup className="text-center">
                <Button
                  className="btn btn-primary"
                  variant="primary"
                  type="submit"
                  onClick={() => navigate("/")}
                >
                  Okay
                </Button>
              </FormGroup>
            </Form>
          </Modal.Body>
        </Modal>
      ) : null}
    </div>
  );
}

export default Cart;
