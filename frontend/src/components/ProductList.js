import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Container, CardFooter, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'
  const [filter, setFilter] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showCartIcon, setShowCartIcon] = useState(false);

  const token = localStorage.getItem("token");
  console.log("token: ", token);

  const addToCart = async id => {
    await axios
      .post(
        `http://localhost:5000/api/cart/add`,
        { productId: id, quantity: 1 },
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(response => {
        console.log("cart", response.data);
        alert("successfully added to cart");
        setShowCartIcon(true);
        addCartCount();
        // setUpdateId(id);
        // setOneRecipe(response.data[0]);
        // setShow(true);
      })
      .catch(error => {
        alert("Add to cart is failed");
        console.error("error:", error);
      });
  };
  const addCartCount = () => {
    axios
      .get(`http://localhost:5000/api/cart/`, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(cartObj => {
        console.log("cartObj: ", cartObj.data.length);
        if (cartObj.data.length != 0) {
          setShowCartIcon(true);
        } else {
          setShowCartIcon(false);
        }
        setCartCount(cartObj.data.length);
      })
      .catch(error => console.log("error", error));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        addCartCount();
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="row pb-4">
        <div className="col-4 ">
          <h2 className="text-primary">Product List</h2>
        </div>

        <div className="col-4 text-center">
          <input
            type="text"
            placeholder="Search products..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="form-control"
          />
        </div>
        {showCartIcon ? (
          <div className="col-4 text-end">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/cart")}
            >
              {cartCount}
              <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </div>
        ) : null}
      </div>
      <div>
        <Row>
          {filteredProducts.map(product => (
            <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                />
                <Card.Body>
                  <Card.Title>
                    <span className="text-primary">Product Name: </span>
                    {product.name}
                  </Card.Title>
                  <Card.Text>
                    <span className="text-primary">Description: </span>
                    {product.description}
                  </Card.Text>
                  <Card.Text>
                    <span className="text-primary">Original Price: </span>
                    {product.originalPrice}
                  </Card.Text>
                  <Card.Text>
                    <span className="text-primary">Discount: </span>
                    {product.discountPrice}
                  </Card.Text>
                  <Card.Text>
                    <span className="text-primary">Selling Price: </span>
                    {product.sellingPrice}
                  </Card.Text>
                </Card.Body>
                <CardFooter className="text-center">
                  <Button
                    className="btn btn-primary"
                    onClick={() => {
                      addToCart(product._id);
                    }}
                  >
                    Add to cart
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default ProductList;
