import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Package, CreditCard, FileText } from "lucide-react"; // Icons

function Nav() {
    return (
        <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">



                {/* Navigation Links */}
                <ul className="flex space-x-6 text-lg">
                    <li>
                        <Link
                            to="/mainproduct"
                            className="flex items-center space-x-2 text-white hover:text-yellow-300 transition duration-300"
                        >
                            <Package size={20} />
                            <span>Products</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/maincart"
                            className="flex items-center space-x-2 text-white hover:text-yellow-300 transition duration-300"
                        >
                            <ShoppingCart size={20} />
                            <span>Cart</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/mainpayment"
                            className="flex items-center space-x-2 text-white hover:text-yellow-300 transition duration-300"
                        >
                            <CreditCard size={20} />
                            <span>Add Payment</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/mainpaymentdetails"
                            className="flex items-center space-x-2 text-white hover:text-yellow-300 transition duration-300"
                        >
                            <FileText size={20} />
                            <span>Payment Details</span>
                        </Link>
                    </li>


                </ul>
            </div>
        </nav>
    );
}

export default Nav;