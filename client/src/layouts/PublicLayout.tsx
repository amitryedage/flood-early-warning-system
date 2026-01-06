import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/Public/PublicNavbar';
import PublicFooter from '../components/Public/PublicFooter';

const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pt-[60px]">
            <PublicNavbar />

            <main className="container mx-auto px-8 py-8 max-w-[1440px] min-h-[calc(100vh-250px)]">
                <Outlet />
            </main>

            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
