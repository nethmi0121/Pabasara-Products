import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt, 
  FaUpload, 
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaBox,
  FaInfoCircle,
  FaQuestionCircle,
  FaTruck,
  FaExchangeAlt,
  FaFacebook,
  FaInstagram,
  FaWhatsapp
} from 'react-icons/fa';
import './addProduct.css';

function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    ingredients: '',
    image: null,
    imagePreview: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProduct(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = 'Product name is required';
    if (!product.price || isNaN(product.price)) newErrors.price = 'Valid price is required';
    if (!product.description.trim()) newErrors.description = 'Description is required';
    if (!product.stock || isNaN(product.stock)) newErrors.stock = 'Valid stock quantity is required';
    if (!product.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Product submitted:', product);
      
      // Save to localStorage for demo
      const products = JSON.parse(localStorage.getItem('products')) || [];
      const newProduct = {
        id: Date.now().toString(),
        ...product,
        ingredients: product.ingredients.split(',').map(item => item.trim()),
        image: product.imagePreview || '/images/placeholder.jpg'
      };
      
      localStorage.setItem('products', JSON.stringify([...products, newProduct]));
      navigate('/');
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-page">
      <header className="main-header">
        <div className="top-bar">
          <div className="container">
            <div className="welcome-message">Welcome to Pabasara Sweet House!</div>
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
              <h1 className="logo-text">Pabasara<span>Sweet House</span></h1>
            </div>
            
            <div className="header-icons">
              <button className="icon-btn account-btn" onClick={() => navigate('/account')}>
                <FaUser />
                <span>Admin Panel</span>
              </button>
              <button className="icon-btn" onClick={() => navigate('/')}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="add-product-container">
        <div className="container">
          <h1 className="page-title">Add New Sweet Product</h1>
          
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="e.g. Sesame Rolls"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price (Rs)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  min="0"
                  step="10"
                  className={errors.price ? 'error' : ''}
                  placeholder="e.g. 250"
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows="3"
                className={errors.description ? 'error' : ''}
                placeholder="Describe your delicious sweet product..."
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stock">Available Quantity</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={errors.stock ? 'error' : ''}
                  placeholder="e.g. 50"
                />
                {errors.stock && <span className="error-message">{errors.stock}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="ingredients">Ingredients</label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={product.ingredients}
                  onChange={handleInputChange}
                  rows="3"
                  className={errors.ingredients ? 'error' : ''}
                  placeholder="e.g. Sesame seeds, sugar, honey, flour"
                />
                {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
              </div>
            </div>
            
            <div className="form-group image-upload-group">
              <label htmlFor="image">Product Image</label>
              <div className="image-upload-container">
                {product.imagePreview ? (
                  <div className="image-preview-container">
                    <img src={product.imagePreview} alt="Preview" className="image-preview" />
                    <button type="button" onClick={removeImage} className="btn-remove-image">
                      <FaTimes /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="upload-area">
                    <FaUpload className="upload-icon" />
                    <span>Click to upload product image</span>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                  </label>
                )}
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Product...' : 'Add Sweet Product'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-title">Shop Categories</h3>
            <ul className="footer-links">
              <li><a href="/products"><FaBox /> All Sweets</a></li>
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
              <li><a href="/shipping"><FaTruck /> Delivery Info</a></li>
              <li><a href="/returns"><FaExchangeAlt /> Returns Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Company Info</h3>
            <ul className="footer-links">
              <li><a href="/about"><FaInfoCircle /> About Us</a></li>
              <li><a href="/privacy"><FaInfoCircle /> Privacy Policy</a></li>
              <li><a href="/terms"><FaInfoCircle /> Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Stay Connected</h3>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
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

export default AddProduct;