import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Package, Boxes, Truck, MessageSquare, Home, LogOut, Cake, DownloadCloud } from "lucide-react";


const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("User logged out");
        navigate("/login");
    };

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
            {/* Enhanced Logo Section with Custom Font */}
            <div className="cursor-pointer px-4 py-4 border-gray-700 h-18 flex items-center justify-center">
                <div className="flex flex-col items-center">
          <span className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent tracking-tight leading-none font-[Poppins]">
            Pabasara
          </span>
                    <div className="flex items-center mt-1 justify-center w-full">
                        <Cake className="w-3.5 h-3.5 text-amber-400 mr-1" />
                        <span className="text-xs font-medium text-amber-300 tracking-[0.2em] uppercase">
              Products
            </span>
                    </div>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex flex-col px-2 space-y-1 flex-grow mt-2">
                <NavItem to="/product-management/dashboard" icon={<Home size={18} />} label="Dashboard" />
                <NavItem to="/product-management/products" icon={<Package size={18} />} label="Products" />
                <NavItem to="/product-management/stock" icon={<Boxes size={18} />} label="Stock" />
                <NavItem to="/product-management/supplier" icon={<Truck size={18} />} label="Supplier" />
                <NavItem to="/product-management/feedback" icon={<MessageSquare size={18} />} label="Feedback" />
                <NavItem to="/product-management/reports" icon={<DownloadCloud size={18} />} label="Reports" />
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-all text-red-400 hover:text-red-300"
                >
                    <LogOut size={18} />
                    <span className="ml-3">Logout</span>
                </button>
            </div>

            {/* Font Import in Style Tag */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
      `}</style>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-all relative ${isActive
                    ? "text-amber-400 font-medium"
                    : "hover:bg-gray-700 text-gray-300"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-amber-500 rounded-r"></div>
                    )}
                    <div className="flex items-center">
                        {icon}
                        <span className="ml-3">{label}</span>
                    </div>
                </>
            )}
        </NavLink>
    );
};

export default Sidebar;