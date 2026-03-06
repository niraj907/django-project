import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ menuItems, isSidebarOpen, isMobile }) => {
    const location = useLocation();

    const sidebarClass = `fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-white border-r border-gray-100 flex flex-col z-40 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-[240px] translate-x-0 shadow-xl' : (isMobile ? '-translate-x-full w-[240px]' : 'w-[70px] translate-x-0')}`;

    // Text Visibility
    // Visible if Open
    // Hidden if Closed (Desktop)
    const showLabels = isSidebarOpen;

    return (
        <aside className={sidebarClass}>
            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={!showLabels ? item.label : ''}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative whitespace-nowrap
                                ${isActive
                                    ? 'text-indigo-600 bg-indigo-50/80'
                                    : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
                                }
                                ${!showLabels ? 'justify-center' : ''}
                            `}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <span className={`absolute bg-indigo-600 rounded-r-full transition-all duration-300
                                    ${!showLabels ? 'left-0 top-1/2 -translate-y-1/2 w-1 h-6' : 'right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-l-full'}`}
                                />
                            )}

                            <Icon
                                size={22}
                                className={`transition-colors duration-200 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}`}
                            />

                            {/* Label */}
                            <span
                                className={`transition-all duration-300 origin-left overflow-hidden block
                                ${showLabels ? 'w-auto opacity-100 scale-100' : 'w-0 opacity-0 scale-0'}`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
