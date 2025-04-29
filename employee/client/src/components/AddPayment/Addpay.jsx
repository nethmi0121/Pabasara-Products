import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FaCreditCard, FaLock, FaCalendarAlt, FaUser, FaCheckCircle,
  FaShoppingCart, FaHome, FaEnvelope, FaPhone, 
  FaFacebook, FaTwitter, FaInstagram, FaUser as FaUserAccount,
  FaSearch, FaHeart, FaBell, FaBox, FaInfoCircle, 
  FaTruck, FaExchangeAlt, FaQuestionCircle, FaTrash,
  FaShoppingBag, FaArrowLeft, FaPlus, FaMinus
} from 'react-icons/fa';
import './Addpay.css';

const ADD_PAYMENT_URL = "/api/payments/create";

function Addpay({ onPaymentAdded }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('Successful');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [userId, setUserId] = useState(''); 
  const [cardHolderName, setCardHolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardType, setCardType] = useState('unknown');

  const navigate = useNavigate();

  useEffect(() => {
    const generatedUserId = `user_${Math.floor(Math.random() * 1000000)}`; 
    setUserId(generatedUserId);
  }, []);

  useEffect(() => {
    if (/^4/.test(cardNumber)) {
      setCardType('visa');
    } else if (/^5[1-5]/.test(cardNumber)) {
      setCardType('mastercard');
    } else if (/^3[47]/.test(cardNumber)) {
      setCardType('amex');
    } else if (/^6(?:011|5)/.test(cardNumber)) {
      setCardType('discover');
    } else {
      setCardType('unknown');
    }
  }, [cardNumber]);

  const validateCardNumber = (number) => {
    return number.length === 16 && /^[0-9]+$/.test(number); 
  };

  const validateExpiryDate = (expiry) => {
    const formatRegex = /^([0-9]{2})\/([0-9]{2})$/;
    if (!formatRegex.test(expiry)) {
      return { valid: false, message: "Expiry date must be in MM/YY format." };
    }
    const [inputMonth, inputYear] = expiry.split('/').map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (inputMonth < 1 || inputMonth > 12) {
      return { valid: false, message: "Invalid month in expiry date." };
    }
    if (inputYear > currentYear || (inputYear === currentYear && inputMonth >= currentMonth)) {
      return { valid: true };
    } else {
      return { valid: false, message: "This card has expired." };
    }
  };

  const validateCVV = (cvv) => {
    return cvv.length === (cardType === 'amex' ? 4 : 3) && /^[0-9]+$/.test(cvv);
  };

  const validateAmount = (amount) => {
    return amount > 0;
  };

  const validateCardHolderName = (name) => {
    return name.length > 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i=0, len=match.length; i<len; i+=4) {
      parts.push(match.substring(i, i+4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return value;
  };

  const validateForm = () => {
    const errors = {};
    if (!validateCardNumber(cardNumber.replace(/\s/g, ''))) errors.cardNumber = 'Card number must be 16 digits.';
    const expiryValidation = validateExpiryDate(cardExpiry);
    if (!expiryValidation.valid) errors.cardExpiry = expiryValidation.message || 'Invalid expiry date.';
    if (!validateCVV(cardCVV)) errors.cardCVV = cardType === 'amex' ? 'CVV must be a 4-digit number.' : 'CVV must be a 3-digit number.';
    if (!validateAmount(amount)) errors.amount = 'Amount must be greater than 0.';
    if (!currency) errors.currency = 'Currency is required.';
    if (!paymentIntentId) errors.paymentIntentId = 'Payment Intent ID is required.';
    if (!validateCardHolderName(cardHolderName)) errors.cardHolderName = 'Cardholder name is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the form errors.');
      return;
    }

    const paymentData = {
      userId, 
      cardDetails: { 
        cardNumber: cardNumber.replace(/\s/g, ''), 
        cardExpiry, 
        cardCVV, 
        cardHolderName,
        cardType
      },
      amount,
      currency,
      status,
      paymentIntentId,
      paymentMethod, 
    };

    try {
      setLoading(true);
      const response = await axios.post(ADD_PAYMENT_URL, paymentData);

      if (response.data.success) {
        onPaymentAdded(response.data);
        setSuccessMessage('Payment added successfully!');
        setIsModalOpen(true);
        setCardNumber('');
        setCardExpiry('');
        setCardCVV('');
        setAmount('');
        setPaymentIntentId('');
        setCardHolderName('');
        setPaymentMethod('creditCard'); 
        setError(null);
        setFormErrors({});

        setTimeout(() => setSuccessMessage(''), 3000);
        setTimeout(() => navigate("/mainpaymentdetails"), 2000);
      } else {
        setError(response.data.message || 'Failed to add payment.');
      }
    } catch (err) {
      setError('Failed to add payment: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };

  return (
    <div className="addpay-page">
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
                <FaUserAccount />
                <span>My Account</span>
              </button>
              <button className="cart-btn" onClick={() => navigate('/cart')}>
                <FaShoppingCart />
                <span className="cart-count">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="professional-payment-container">
        <motion.div 
          className="payment-form-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="payment-header">
            <h1>Payment Information</h1>
            <div className="divider"></div>
          </div>

          <div className="card-display-section">
            <div className={`card-preview ${cardType}`}>
              <div className="card-header">
                <div className="card-type-logo"></div>
                <div className="card-chip"></div>
              </div>
              <div className="card-number-display">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="card-footer">
                <div className="card-holder-info">
                  <div className="label">Card Holder</div>
                  <div className="value">{cardHolderName || 'YOUR NAME'}</div>
                </div>
                <div className="card-expiry-info">
                  <div className="label">Expires</div>
                  <div className="value">{cardExpiry || '••/••'}</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleAddPayment} className="payment-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardHolderName">
                  <FaUser className="input-icon" /> Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  placeholder="Full name as on card"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  required
                />
                {formErrors.cardHolderName && <span className="error-message">{formErrors.cardHolderName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardNumber">
                  <FaCreditCard className="input-icon" /> Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  required
                />
                {formErrors.cardNumber && <span className="error-message">{formErrors.cardNumber}</span>}
              </div>
            </div>

            <div className="form-row dual-inputs">
              <div className="form-group">
                <label htmlFor="cardExpiry">
                  <FaCalendarAlt className="input-icon" /> Expiry Date
                </label>
                <input
                  type="text"
                  id="cardExpiry"
                  placeholder="MM/YY"
                  value={formatExpiryDate(cardExpiry)}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  maxLength={5}
                  required
                />
                {formErrors.cardExpiry && <span className="error-message">{formErrors.cardExpiry}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cardCVV">
                  <FaLock className="input-icon" /> CVV
                </label>
                <input
                  type="text"
                  id="cardCVV"
                  placeholder={cardType === 'amex' ? '1234' : '123'}
                  value={cardCVV}
                  onChange={(e) => setCardCVV(e.target.value)}
                  maxLength={cardType === 'amex' ? 4 : 3}
                  required
                />
                {formErrors.cardCVV && <span className="error-message">{formErrors.cardCVV}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group amount-input">
                <label>Amount</label>
                <div className="amount-wrapper">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                  <input
                    type="number"
                    id="amount"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                {formErrors.amount && <span className="error-message">{formErrors.amount}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="paymentIntentId">Payment Intent ID</label>
                <input
                  type="text"
                  id="paymentIntentId"
                  placeholder="pi_123456789"
                  value={paymentIntentId}
                  onChange={(e) => setPaymentIntentId(e.target.value)}
                  required
                />
                {formErrors.paymentIntentId && <span className="error-message">{formErrors.paymentIntentId}</span>}
              </div>
            </div>

            <motion.button 
              type="submit" 
              className="submit-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <FaCheckCircle /> Confirm Payment
                </>
              )}
            </motion.button>
          </form>

          {error && (
            <motion.div 
              className="error-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <motion.div 
              className="success-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-icon">
                <FaCheckCircle />
              </div>
              <h2>Payment Successful</h2>
              <p>Your transaction has been processed successfully.</p>
              
              <div className="payment-details">
                <div className="detail-row">
                  <span>Amount:</span>
                  <span>{currency} {amount}</span>
                </div>
                <div className="detail-row">
                  <span>Card:</span>
                  <span>•••• •••• •••• {cardNumber.slice(-4)}</span>
                </div>
              </div>
              
              <button className="modal-close-button" onClick={closeModal}>
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </div>

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

export default Addpay;