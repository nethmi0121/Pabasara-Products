import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaUser, 
  FaPhone, 
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaBox,
  FaInfoCircle,
  FaQuestionCircle,
  FaTruck,
  FaExchangeAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaHeart,
  FaBell
} from 'react-icons/fa';
import './home.css';

// Image imports
import heroBg from '../images/hero-bg.jpg';
import sesameRoll from '../images/sesame-roll.jpg';
import peanutBall from '../images/peanut-ball.jpg';
import sesameBall from '../images/sesame-ball.jpg';
import rulanRoll from '../images/rulan-roll.jpg';
import peanutBar from '../images/peanut-bar.jpg';
import bites from '../images/bites.jpg';
import image1 from '../images/image1.jpg';
import image2 from '../images/image2.jpg';
import image3 from '../images/image3.jpg';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Mock data
  const mockProducts = [
    {
      id: '1',
      name: 'Sesame Roll',
      price: 200,
      description: 'Sweet, chewy treat made from roasted sesame seeds',
      stock: 50,
      image: sesameRoll,
      category: 'traditional',
      ingredients: ['Sesame seeds', 'Jaggery', 'Rice flour'],
    },
    {
      id: '2',
      name: 'Peanut Ball',
      price: 180,
      description: 'Soft, chewy peanut snacks',
      stock: 30,
      image: peanutBall,
      category: 'traditional',
      ingredients: ['Peanuts', 'Jaggery', 'Coconut'],
    },
    {
      id: '3',
      name: 'Sesame Ball',
      price: 220,
      description: 'Crunchy sesame treats',
      stock: 25,
      image: sesameBall,
      category: 'traditional',
      ingredients: ['Sesame seeds', 'Honey', 'Rice flour'],
    },
    {
      id: '4',
      name: 'Rulan Roll',
      price: 190,
      description: 'Rice flour and coconut rolls',
      stock: 40,
      image: rulanRoll,
      category: 'traditional',
      ingredients: ['Rice flour', 'Coconut', 'Sugar'],
    },
    {
      id: '5',
      name: 'Peanut Bar',
      price: 210,
      description: 'Crunchy peanut bars',
      stock: 35,
      image: peanutBar,
      category: 'modern',
      ingredients: ['Peanuts', 'Sugar', 'Butter'],
    },
    {
      id: '6',
      name: 'Bites',
      price: 170,
      description: 'Savory rice flour snacks',
      stock: 45,
      image: bites,
      category: 'modern',
      ingredients: ['Rice flour', 'Spices', 'Oil'],
    }
  ];

  // Carousel images
  const carouselImages = [
    { id: 1, src: peanutBall, alt: 'Traditional sweet making process' },
    { id: 2, src: bites, alt: 'Our sweet shop interior' },
    { id: 3, src: image3, alt: 'Family enjoying our sweets' }
  ];

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProducts(mockProducts);
        // Store in localStorage for ProductDetails to access
        localStorage.setItem('products', JSON.stringify(mockProducts));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading our delicious sweets...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="home-page">
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
                <span className="cart-count">{products.length > 0 ? products.length : 0}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of your component remains the same... */}
      <main className="home-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Authentic Sri Lankan Sweets</h1>
            <p>Handcrafted with traditional recipes passed down through generations</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/products')}
            >
              Shop Now
            </button>
          </div>
        </section>

        <section className="featured-products">
          <h2 className="section-title">Our Signature Sweets</h2>
          <p className="section-subtitle">Handmade with love and premium ingredients</p>
          
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <p className="product-price">Rs. {product.price.toFixed(2)}</p>
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(product)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-content">
            <h2>Our Sweet Tradition</h2>
            <p>
              Since 2012, Pabasara Sweet House has been crafting authentic Sri Lankan sweets using 
              traditional recipes and the finest ingredients. Each sweet is made with care to bring 
              you the true taste of Sri Lankan heritage.
            </p>
            
            <div className="carousel-container">
              <div className="carousel" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {carouselImages.map((image) => (
                  <div 
                    key={image.id}
                    className="carousel-slide"
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="carousel-image"
                    />
                  </div>
                ))}
              </div>
              
              <button className="carousel-btn prev" onClick={prevSlide}>
                <FaChevronLeft />
              </button>
              <button className="carousel-btn next" onClick={nextSlide}>
                <FaChevronRight />
              </button>
              
              <div className="carousel-indicators">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
            
            <button 
              className="btn-outline"
              onClick={() => navigate('/about')}
            >
              Learn More About Us
            </button>
          </div>
        </section>
      </main>

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

export default Home;