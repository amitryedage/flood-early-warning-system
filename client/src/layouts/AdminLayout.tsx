import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/Admin/Navbar';
import AdminSidebar from '../components/Admin/Sidebar';

const AdminLayout: React.FC = () => {
    return (
        <div className="h-screen overflow-hidden bg-gray-50 relative text-slate-900">
            {/* 1. Fixed Top Navbar (z-50) */}
            <AdminNavbar />

            {/* 2. Fixed Sidebar (z-40) */}
            <AdminSidebar />

            {/* 3. Main Content Area */}
            {/* Height is full screen, but we manage scroll internally using overflow-y-auto */}
            <main className="h-full pt-[70px] pl-[280px] overflow-y-auto transition-all duration-300">
                <div className="p-0 min-h-full flex flex-col">
                    {/* The War Room dashboard or other admin pages render here */}
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay (Optional for future) */}
            {/* <div className="fixed inset-0 bg-black/50 z-30 lg:hidden"></div> */}
        </div>
    );
};

export default AdminLayout;
