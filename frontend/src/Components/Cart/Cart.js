import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import './Cart.css';
import { useNavigate } from 'react-router-dom'; 

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const userId = "63f1c5d4d9c52a1f69b5f123";
  const navigate = useNavigate(); 

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3000/cart/get/${userId}`)
        .then(response => {
          if (response.data && response.data.cart) {
            setCart(response.data.cart);
          } else {
            setError("Invalid cart data received.");
            console.error("Invalid cart data:", response.data);
          }
        })
        .catch(error => {
          setError("Error fetching cart.");
          console.error("Error fetching cart:", error);
        });
    } else {
      setError("User ID is missing.");
    }
  }, [userId]);

  const handleRemoveItem = (productId) => {
    axios.post(`http://localhost:3000/cart/remove/${userId}`, { productId })
      .then(response => {
        if (response.data && response.data.cart) {
          setCart(response.data.cart);
        } else {
          setError("Error updating cart.");
          console.error("Invalid remove data:", response.data);
        }
      })
      .catch(error => {
        setError("Error removing item.");
        console.error("Error removing item:", error);
      });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    axios.post(`http://localhost:3000/cart/update/${userId}`, { productId, quantity: newQuantity })
      .then(response => {
        if (response.data && response.data.cart) {
          setCart(response.data.cart);
        } else {
          setError("Error updating cart.");
          console.error("Invalid quantity data:", response.data);
        }
      })
      .catch(error => {
        setError("Error updating quantity.");
        console.error("Error updating quantity:", error);
      });
  };

  const handleClearCart = () => {
    axios.post(`http://localhost:3000/cart/clear/${userId}`)
      .then(response => {
        if (response.data) {
          setCart(null);
        } else {
          setError("Error clearing cart.")
          console.error("Invalid clear data:", response)
        }
      })
      .catch(error => {
        setError("Error clearing cart.");
        console.error("Error clearing cart:", error);
      });
  };

  const handleCheckout = () => {
    navigate('/mainpayment'); // Navigate to the Addpay page
  };

  return (
    <div>
      <Nav />
      <div className="cart-container">
        <h1>Your Cart ({cart?.items.length || 0} items)</h1>

        {error && <div className="error-message">{error}</div>}

        <table>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart?.items.map(item => (
              <tr key={item.productId}>
                <td>{item.productId}</td>
                <td>Rs.{item.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                  />
                </td>
                <td>Rs.{(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-summary">
          <p>Subtotal: Rs.{cart?.total?.toFixed(2) || "0.00"}</p>
        </div>

        <button onClick={handleClearCart} className="clear-cart">Clear Cart</button>
        <button onClick={handleCheckout} className="checkout">Checkout</button>
      </div>
    </div>
  );
}

export default Cart;