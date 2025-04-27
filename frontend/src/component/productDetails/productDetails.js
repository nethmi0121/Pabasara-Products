import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  FaBell
} from 'react-icons/fa';
import './productDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [product, setProduct] = useState(state?.product || null);
  const [loading, setLoading] = useState(!state?.product);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (product) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const foundProduct = products.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          const related = products.filter(
            p => p.id !== id && p.category === foundProduct.category
          ).slice(0, 4);
          setRelatedProducts(related);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, product]);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + amount)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: id,
        quantity,
        addedAt: new Date().toISOString(),
        productDetails: {
          name: product.name,
          price: product.price,
          image: product.image
        }
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  const productImages = [
    product.image,
    product.image,
    product.image
  ];

  return (
    <div className="product-details-page">
      {/* Updated Header */}
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

      <main className="product-details-container">
        <div className="container">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft /> Back to Products
          </button>

          <div className="product-content">
            <div className="product-images">
              <div className="main-image-container">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name} 
                  className="main-image"
                />
              </div>
              <div className="thumbnail-container">
                {productImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-meta">
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < 4 ? 'filled' : 'empty'} />
                    ))}
                  </div>
                  <span className="review-count">(24 reviews)</span>
                </div>
                
                <div className="product-price">Rs. {product.price.toFixed(2)}</div>
                
                <div className="stock-status">
                  {product.stock > 0 ? (
                    <span className="in-stock">{product.stock} in stock</span>
                  ) : (
                    <span className="out-of-stock">Out of stock</span>
                  )}
                </div>
              </div>

              <p className="product-description">{product.description}</p>

              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-control">
                  <button 
                    className="quantity-btn minus"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    className="quantity-btn plus"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product || product.stock <= 0}
              >
                Add to Cart
              </button>

              <div className="product-details-section">
                <h3>Ingredients</h3>
                <ul className="ingredients-list">
                  {product.ingredients && product.ingredients.length > 0 ? (
                    product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))
                  ) : (
                    <li>No ingredients listed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="related-products">
              <h2 className="section-title">You May Also Like</h2>
              <div className="related-products-grid">
                {relatedProducts.map(relatedProduct => (
                  <div 
                    key={relatedProduct.id} 
                    className="related-product-card"
                    onClick={() => navigate(`/product/${relatedProduct.id}`, { state: { product: relatedProduct } })}
                  >
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name} 
                      className="related-product-image"
                    />
                    <h3>{relatedProduct.name}</h3>
                    <div className="related-product-price">Rs. {relatedProduct.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Updated Footer */}
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
              <a href="#" aria-label="Twitter"><FaInstagram /></a>
              <a href="#" aria-label="Instagram"><FaWhatsapp /></a>
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

export default ProductDetails;