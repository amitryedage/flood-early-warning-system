import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/Public/PublicNavbar';
import PublicFooter from '../components/Public/PublicFooter';

const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-[60px]">
            <PublicNavbar />

            <main className="container mx-auto px-4 py-6 max-w-7xl min-h-[calc(100vh-250px)]">
                <Outlet />
            </main>

            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
