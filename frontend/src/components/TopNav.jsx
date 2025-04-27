import { Bell } from "lucide-react";

const TopNav = () => {
  return (
    <header className="bg-[#101828] flex items-center justify-end p-4 border-b border-gray-300">
      {/* Right Section: Notifications & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Order Notifications */}
        <button
          className="relative p-2 rounded-full hover:bg-amber-100 transition-colors"
          aria-label="Order Notifications"
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile (Initials) */}
        <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full text-white text-lg font-bold cursor-pointer hover:bg-amber-700 transition-colors">
          SS
        </div>
      </div>
    </header>
  );
};

export default TopNav;