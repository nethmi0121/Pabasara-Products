import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './managerLogin.css';

function ManagerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setLoginError('');
    
    try {
      // For demo purposes - successful login
      if (formData.email === 'manager@pabasara.com' && formData.password === 'Pabasara123') {
        localStorage.setItem('authToken', 'demo-manager-token');
        localStorage.setItem('managerEmail', formData.email);
        
        // Navigate to add product page
        navigate('/add-product');
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="manager-login-container">
      <header className="header">
        <nav className="nav">
          <div className="logo">Pabasara Products</div>
          <ul className="nav-links">
            <li><Link to="/">Back to Home</Link></li>
          </ul>
        </nav>
      </header>

      <main className="login-main">
        <div className="login-form-container">
          <div className="login-header">
            <h1>Manager Login</h1>
            <p>Access your inventory management dashboard</p>
          </div>
          
          {loginError && (
            <div className="alert alert-error">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Sign In'}
            </button>
            
            <div className="form-footer">
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>More Information</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/stores">Our Stores</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/popup">POP-up shop</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Useful Links</h3>
            <ul>
              <li><Link to="/wholesale">Wholesale sweets</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/delivery">Delivery Information</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Pabasara Products. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ManagerLogin;