import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    FaTrash, FaShoppingBag, FaArrowLeft, FaPlus, FaMinus,
    FaShoppingCart, FaHome, FaEnvelope, FaPhone,
    FaFacebook, FaInstagram, FaWhatsapp, FaUser,
    FaSearch, FaHeart, FaBell, FaBox, FaInfoCircle,
    FaCreditCard, FaTruck, FaExchangeAlt, FaQuestionCircle
} from 'react-icons/fa';
import './Cart.css';

function Cart() {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Load cart from localStorage
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);
    }, []);

    const handleRemoveItem = (productId) => {
        const updatedCart = cart.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    const handleQuantityChange = (productId, change) => {
        const updatedCart = cart.map(item => {
            if (item.productId === productId) {
                const newQuantity = item.quantity + change;
                return {
                    ...item,
                    quantity: newQuantity >= 1 ? newQuantity : 1
                };
            }
            return item;
        });
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    const handleClearCart = () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            localStorage.removeItem('cart');
            setCart([]);
        }
    };

    const handleCheckout = () => {
        navigate('/mainpayment');
    };

    const continueShopping = () => {
        navigate('/');
    };

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.productDetails.price * item.quantity), 0);
    const shipping = subtotal * 0.05;
    const tax = subtotal * 0.12;
    const total = subtotal + shipping + tax;

    return (
        <div className="cart-page">
            {/* Header with Updated Color Scheme */}
            <header className="main-header">
                <div className="top-bar">
                    <div className="container">
                        <div className="welcome-message">Welcome to Pabasara Shop!</div>
                        <div className="top-links">
                            <a href="tel:+94761234567"><FaPhone /> +94 76 123 4567</a>
                            <a href="mailto:support@pabasarashop.com"><FaEnvelope /> support@pabasarashop.com</a>
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
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search sweets, snacks..."
                                aria-label="Search products"
                            />
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
                            <button className="cart-btn" onClick={() => navigate('/maincart')}>
                                <FaShoppingCart />
                                <span className="cart-count">{cart.length}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Cart Content */}
            <main className="cart-container">
                <div className="container">
                    <div className="cart-header">
                        <div className="cart-icon-title">
                            <FaShoppingCart className="cart-main-icon" />
                            <h1 className="cart-title">Your Shopping Cart</h1>
                        </div>
                        <p className="cart-item-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
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
                    ) : cart.length === 0 ? (
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
                                {cart.map(item => (
                                    <div key={item.productId} className="cart-item">
                                        <div className="item-image">
                                            <img src={item.productDetails.image || 'https://via.placeholder.com/100'} alt={item.productDetails.name} />
                                        </div>
                                        <div className="item-details">
                                            <h3 className="item-name">{item.productDetails.name}</h3>
                                            <p className="item-price">Rs.{item.productDetails.price.toFixed(2)}</p>
                                            <p className="item-description">{item.productDetails.description}</p>
                                        </div>
                                        <div className="item-quantity">
                                            <button
                                                onClick={() => handleQuantityChange(item.productId, -1)}
                                                className="quantity-btn minus"
                                                disabled={item.quantity <= 1}
                                            >
                                                <FaMinus />
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.productId, 1)}
                                                className="quantity-btn plus"
                                                disabled={item.quantity >= 10}
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                        <div className="item-total">
                                            Rs.{(item.productDetails.price * item.quantity).toFixed(2)}
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
                                    <span>Rs.{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>Rs.{shipping.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax</span>
                                    <span>Rs.{tax.toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>Rs.{total.toFixed(2)}</span>
                                </div>
                                <div className="cart-actions">
                                    <button onClick={handleClearCart} className="clear-cart">
                                        <FaTrash /> Clear Cart
                                    </button>
                                    <button onClick={handleCheckout} className="checkout-btn">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

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
                            <a href="#" aria-label="Instagram"><FaInstagram /></a>
                            <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
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
                    <p>&copy; {new Date().getFullYear()} Pabasara Sweet House. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Cart;