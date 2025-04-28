import React from "react";
import "../css/NavBar.css"; // or create Footer.css separately if you prefer

function Footer() {
    return (
        <footer className="navbar-footer">
            <div className="footer-sections">
                <div className="footer-section">
                    <h3>Shop Categories</h3>
                    <ul>
                        <li>All Products</li>
                        <li>New Arrivals</li>
                        <li>Best Sellers</li>
                        <li>Special Offers</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Customer Support</h3>
                    <ul>
                        <li>Contact Us</li>
                        <li>FAQ</li>
                        <li>Shipping Info</li>
                        <li>Returns Policy</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Company Info</h3>
                    <ul>
                        <li>About Us</li>
                        <li>Privacy Policy</li>
                        <li>Terms & Conditions</li>
                        <li>Our Blog</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Stay Connected</h3>
                    <div className="newsletter">
                        <input type="email" placeholder="Your email address" />
                        <button>Subscribe</button>
                    </div>
                </div>
            </div>

            <div className="footer-contact">
                <p>+94 76 123 4567</p>
                <p>support@pabasarashop.com</p>
            </div>

            <div className="footer-copyright">
                <p>&copy; {new Date().getFullYear()} Pabasara Shop. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
