import React, { useEffect, useState } from "react";
import axios from "axios";
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { 
  FaTrash, FaShoppingBag, FaArrowLeft, FaPlus, FaMinus, 
  FaShoppingCart, FaHome, FaEnvelope, FaPhone, 
  FaFacebook, FaTwitter, FaInstagram, FaUser,
  FaSearch, FaHeart, FaBell, FaBox, FaInfoCircle, 
  FaCreditCard, FaTruck, FaExchangeAlt, FaQuestionCircle
} from 'react-icons/fa';

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = "63f1c5d4d9c52a1f69b5f123";
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      setLoading(true);
      axios.get(`http://localhost:3000/cart/get/${userId}`)
        .then(response => {
          if (response.data && response.data.cart) {
            setCart(response.data.cart);
          } else {
            setError("Your cart is empty");
          }
          setLoading(false);
        })
        .catch(error => {
          setError("Error fetching cart. Please try again later.");
          setLoading(false);
          console.error("Error fetching cart:", error);
        });
    } else {
      setError("Please login to view your cart");
      setLoading(false);
    }
  }, [userId]);

  const handleRemoveItem = (productId) => {
    axios.post(`http://localhost:3000/cart/remove/${userId}`, { productId })
      .then(response => {
        if (response.data && response.data.cart) {
          setCart(response.data.cart);
        } else {
          setError("Error updating cart.");
        }
      })
      .catch(error => {
        setError("Error removing item.");
        console.error("Error removing item:", error);
      });
  };

  const handleQuantityChange = (productId, change) => {
    const item = cart.items.find(i => i.productId === productId);
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) return;
    
    axios.post(`http://localhost:3000/cart/update/${userId}`, { productId, quantity: newQuantity })
      .then(response => {
        if (response.data && response.data.cart) {
          setCart(response.data.cart);
        } else {
          setError("Error updating cart.");
        }
      })
      .catch(error => {
        setError("Error updating quantity.");
        console.error("Error updating quantity:", error);
      });
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      axios.post(`http://localhost:3000/cart/clear/${userId}`)
        .then(response => {
          if (response.data) {
            setCart(null);
          } else {
            setError("Error clearing cart.");
          }
        })
        .catch(error => {
          setError("Error clearing cart.");
          console.error("Error clearing cart:", error);
        });
    }
  };

  const handleCheckout = () => {
    navigate('/mainpayment');
  };

  const continueShopping = () => {
    navigate('/products');
  };

  return (
    <div className="cart-page">
      {/* Header with Updated Color Scheme */}
      <header className="main-header">
        <div className="top-bar">
          <div className="container">
            <div className="welcome-message">Welcome to Pabasara Shop!</div>
            <div className="top-links">
              <a href="#"><FaPhone /> +94 76 123 4567</a>
              <a href="#"><FaEnvelope /> support@pabasarashop.com</a>
            </div>
          </div>
        </div>
        
        <div className="main-nav">
          <div className="container">
            <div className="logo-container" onClick={() => navigate('/')}>
              <FaShoppingCart className="logo-icon" />
              <h1 className="logo-text">Pabasara<span>Products</span></h1>
            </div>
            
            <div className="search-bar">
              <input type="text" placeholder="Search products..." />
              <button className="search-btn"><FaSearch /></button>
            </div>
            
            <div className="header-icons">
              <button className="icon-btn" onClick={() => navigate('/wishlist')}>
                <FaHeart />
                <span className="badge">3</span>
              </button>
              <button className="icon-btn" onClick={() => navigate('/notifications')}>
                <FaBell />
                <span className="badge">5</span>
              </button>
              <button className="icon-btn account-btn" onClick={() => navigate('/account')}>
                <FaUser />
                <span>My Account</span>
              </button>
              <button className="cart-btn" onClick={() => navigate('/cart')}>
                <FaShoppingCart />
                {cart && <span className="cart-count">{cart.items.length}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <div className="cart-container">
        <div className="cart-header">
          <div className="cart-icon-title">
            <FaShoppingCart className="cart-main-icon" />
            <h1 className="cart-title">Your Shopping Cart</h1>
          </div>
          <p className="cart-item-count">{cart?.items?.length || 0} {cart?.items?.length === 1 ? 'item' : 'items'}</p>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your cart...</p>
          </div>
        ) : error ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FaShoppingBag size={48} />
            </div>
            <h3>{error}</h3>
            <button onClick={continueShopping} className="continue-shopping-btn">
              <FaArrowLeft /> Continue Shopping
            </button>
          </div>
        ) : cart?.items?.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FaShoppingBag size={48} />
            </div>
            <h3>Your cart is empty</h3>
            <button onClick={continueShopping} className="continue-shopping-btn">
              <FaArrowLeft /> Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart?.items?.map(item => (
                <div key={item.productId} className="cart-item">
                  <div className="item-image">
                    <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name || `Product ${item.productId}`}</h3>
                    <p className="item-price">Rs.{item.price?.toFixed(2)}</p>
                  </div>
                  <div className="item-quantity">
                    <button 
                      onClick={() => handleQuantityChange(item.productId, -1)}
                      className="quantity-btn"
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.productId, 1)}
                      className="quantity-btn"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="item-total">
                    Rs.{(item.price * item.quantity)?.toFixed(2)}
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.productId)}
                    className="remove-item-btn"
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs.{cart?.total?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Rs.{(cart?.total * 0.05)?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>Rs.{(cart?.total * 0.12)?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>Rs.{((cart?.total || 0) * 1.17)?.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <button onClick={handleClearCart} className="clear-cart">
                  <FaTrash /> Clear Cart
                </button>
                <button onClick={handleCheckout} className="checkout">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-title">Shop Categories</h3>
            <ul className="footer-links">
              <li><a href="/products"><FaBox /> All Products</a></li>
              <li><a href="/new-arrivals"><FaBox /> New Arrivals</a></li>
              <li><a href="/best-sellers"><FaBox /> Best Sellers</a></li>
              <li><a href="/deals"><FaBox /> Special Offers</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Customer Support</h3>
            <ul className="footer-links">
              <li><a href="/contact"><FaInfoCircle /> Contact Us</a></li>
              <li><a href="/faq"><FaQuestionCircle /> FAQ</a></li>
              <li><a href="/shipping"><FaTruck /> Shipping Info</a></li>
              <li><a href="/returns"><FaExchangeAlt /> Returns Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Company Info</h3>
            <ul className="footer-links">
              <li><a href="/about"><FaInfoCircle /> About Us</a></li>
              <li><a href="/privacy"><FaInfoCircle /> Privacy Policy</a></li>
              <li><a href="/terms"><FaInfoCircle /> Terms & Conditions</a></li>
              <li><a href="/blog"><FaInfoCircle /> Our Blog</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Stay Connected</h3>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
            <div className="newsletter">
              <h4>Subscribe for Updates</h4>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  aria-label="Email for newsletter"
                />
                <button>Subscribe</button>
              </div>
            </div>
            <div className="footer-contact">
              <p><FaPhone /> +94 76 123 4567</p>
              <p><FaEnvelope /> support@pabasarashop.com</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Pabasara Shop. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Cart;