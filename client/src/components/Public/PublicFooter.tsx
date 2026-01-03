import React from 'react';

const PublicFooter: React.FC = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
                <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-slate-500 font-medium">
                    <a href="#" className="hover:text-blue-600 transition-colors">About Us</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">User Guide</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                    <button className="text-xs px-3 py-1 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 transition-colors">
                        Settings
                    </button>
                    <button className="text-xs px-3 py-1 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 transition-colors">
                        Share App
                    </button>
                    <button className="text-xs px-3 py-1 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 transition-colors">
                        Rate Us
                    </button>
                </div>

                <div className="text-xs text-slate-400">
                    <p className="mb-1">App Version 2.0.1 • Last Data Update: 2 minutes ago</p>
                    <p>&copy; {new Date().getFullYear()} FloodWatch - Emergency Management System</p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
