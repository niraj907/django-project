import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children, menuItems }) => {
    // Initialize sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // lg breakpoint

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            // On switching to mobile, duplicate behavior: auto-collapse or keep state
            // Let's just update the isMobile flag for now and let css handle layout
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Mobile Backdrop - only visible when sidebar is open on mobile */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Top Navbar */}
            <Navbar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Sidebar */}
            <Sidebar
                menuItems={menuItems}
                isSidebarOpen={isSidebarOpen}
                isMobile={isMobile}
            />

            {/* Main Content */}
            <main
                className={`transition-all duration-300 ease-in-out pt-[80px] px-6 pb-6 
                    ${isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-[240px]' : 'ml-[70px]')}`}
            >
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
