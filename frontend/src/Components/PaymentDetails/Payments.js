import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { 
  FaShoppingCart, 
  FaUser, 
  FaPhone, 
  FaEnvelope,
  FaBox,
  FaInfoCircle,
  FaQuestionCircle,
  FaTruck,
  FaExchangeAlt,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaStar,
  FaArrowLeft,
  FaSearch,
  FaHeart,
  FaBell,
  FaTrash, 
  FaFilePdf, 
  FaMoneyBillWave
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Payments.css';

const URL = "http://localhost:3000/payments/get-all";
const DELETE_URL = "http://localhost:3000/payments/delete";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data.list || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchHandler();
      setPayments(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPayments = payments.filter(payment =>
    payment.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.paymentIntentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.amount.toString().includes(searchQuery) ||
    new Date(payment.createdAt).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const logoImg = new Image();
    logoImg.src = `${process.env.PUBLIC_URL}/Logo.jpg`;

    logoImg.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setDrawColor(0);
      doc.setLineWidth(0.8);
      doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 5, 5);

      doc.addImage(logoImg, 'JPG', 12, 12, 30, 30);

      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 167, 134);
      doc.text("Pabasara Products", pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text("Payment Report", pageWidth / 2, 45, { align: 'center' });

      const columns = ["User ID", "Amount", "Currency", "Status", "Payment ID", "Date"];
      const rows = filteredPayments.map(payment => [
        payment.userId,
        payment.amount,
        payment.currency,
        payment.status,
        payment.paymentIntentId,
        new Date(payment.createdAt).toLocaleString()
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 55,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 123, 255],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 10
        }
      });

      const dateStr = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${dateStr}`, 14, pageHeight - 10);
      doc.text(`Page 1`, pageWidth - 30, pageHeight - 10);

      doc.save("Pay_Report.pdf");
    };
  };

  const sendWhatsAppMessage = (payment) => {
    const message = `📊 *Payment Details* 📊\n\n` +
    `*User ID:* ${payment.userId}\n` +
    `*Amount:* ${payment.amount} ${payment.currency}\n` +
    `*Status:* ${payment.status}\n` +
    `*Payment ID:* ${payment.paymentIntentId}\n` +
    `*Date:* ${new Date(payment.createdAt).toLocaleString()}\n\n` +
    `Thank you for your payment!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`);
  };

  const handleDelete = async (paymentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this payment?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${DELETE_URL}/${paymentId}`);
      if (response.data.success) {
        alert('Payment deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete payment: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert('Error deleting payment: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="payments-page">
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
                <button className="cart-btn" onClick={() => navigate('/cart')}>
                  <FaShoppingCart />
                  <span className="cart-count">0</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="payments-container">
          <div className="payments-content">
            <h1 className="payments-title">Payment Details</h1>
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading payment details...</p>
            </div>
          </div>
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

  if (error) {
    return (
      <div className="payments-page">
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
                  <span className="cart-count">0</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="payments-container">
          <div className="payments-content">
            <h1 className="payments-title">Payment Details</h1>
            <div className="error-message">
              <p>Error: {error.message || "An error occurred fetching payment details."}</p>
            </div>
          </div>
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

  return (
    <div className="payments-page">
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
                <span className="cart-count">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="payments-container">
        <div className="payments-content">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> Back to Dashboard
          </button>

          <h1 className="payments-title">Payment Details</h1>
          
          <div className="search-report-container">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-bar"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <FaSearch className="search-icon" />
            </div>
            
            <button onClick={generatePDF} className="generate-report-btn">
              <FaFilePdf /> Generate Report
            </button>
          </div>

          <div className="payment-list">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <div key={payment._id || index} className="payment-card">
                  <div className="payment-header">
                    <h3>Payment #{index + 1}</h3>
                    <span className={`status-badge ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </div>
                  
                  <div className="payment-details">
                    <div className="detail-row">
                      <span className="detail-label">User ID:</span>
                      <span className="detail-value">{payment.userId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">{payment.amount} {payment.currency}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Payment ID:</span>
                      <span className="detail-value payment-id">{payment.paymentIntentId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{new Date(payment.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="payment-actions">
                    <button
                      onClick={() => sendWhatsAppMessage(payment)}
                      className="whatsapp-btn"
                    >
                      <div className="whatsapp-btn-content">
                        <FaWhatsapp className="whatsapp-icon" />
                        <span>Share via WhatsApp</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDelete(payment._id)}
                      className="delete-btn"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-payments">
                <FaMoneyBillWave className="no-payments-icon" />
                <p>No payment records found</p>
                {searchQuery && <button onClick={() => setSearchQuery('')} className="clear-search-btn">Clear search</button>}
              </div>
            )}
          </div>
        </div>
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

export default Payments;