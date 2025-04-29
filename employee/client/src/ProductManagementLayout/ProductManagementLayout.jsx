import { Outlet } from "react-router-dom";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Fixed Sidebar */}
            <div className="flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Fixed Top Navigation */}
                <div className="flex-shrink-0">
                    <TopNav />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;