import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Zap, User, Settings, MessageSquare, Trash2 } from '../../assets/constants/icons';
import { useAuthStore } from '../store/authStore';
import Confirm from '../model/Confirm';
import { toast } from 'sonner';
import { logoutModalData } from '../../assets/constants/confirmdata';
import { Button } from '../ui/button';
import EditProfile from "../model/EditProfile";
import Setting from "../model/Setting";
import DeleteAccount from "../model/DeleteAccount";

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);

    const handleLogoutClick = () => {
        setIsUserDropdownOpen(false);
        setShowLogoutModal(true);
    };

    const handleSettings = () => {
        setIsUserDropdownOpen(false);
        setOpenModal("setting");
    };

    const handleEditProfile = () => {
        setIsUserDropdownOpen(false);
        setOpenModal("editProfile");
    };

    const handleDelete = () => {
        setIsUserDropdownOpen(false);
        setOpenModal("delete");
    };


    const confirmLogout = () => {
        logout();
        navigate('/');
        toast.success("Logged out successfully");
        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const toggleDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        if (isUserDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserDropdownOpen]);

    return (
        <>
            <header className="h-[60px] bg-white border-b border-gray-100 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50 shadow-sm shadow-gray-50">
                {/* Left Side: Toggle + Brand */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <Menu size={22} />
                    </Button>

                    <div
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2.5 group cursor-pointer">
                        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-110 transition-all duration-300">
                            <Zap size={20} className="text-white fill-white/20" />
                        </div>
                        <span className="text-xl font-extrabold text-gray-800 tracking-tight whitespace-nowrap">
                            Expense<span className="text-indigo-600">Tracker</span>
                        </span>
                    </div>
                </div>

                {/* Right Side: User Profile + Logout */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end leading-tight">
                        <span className="text-sm font-bold text-gray-800 capitalize leading-none mb-1">{user?.name}</span>
                        <span className="text-[10px] font-bold text-indigo-600/70 uppercase tracking-wider">{user?.role || 'User'}</span>
                    </div>

                    {/* User Icon & Dropdown */}
                    <div className="relative" ref={userDropdownRef}>
                        <button
                            type="button"
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-50 cursor-pointer overflow-hidden shadow-sm"
                            onClick={toggleDropdown}
                        >
                            {user?.name ? (
                                <span className="text-sm font-black uppercase text-indigo-600">{user.name.charAt(0)}</span>
                            ) : (
                                <User size={20} />
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 z-[60] border border-gray-50 animate-in fade-in zoom-in duration-200 overflow-hidden">
                                {/* User Info Header */}
                                <div className="px-4 py-3 bg-gray-50/50 rounded-xl mb-2 border border-gray-50">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                                    <p className="text-sm font-extrabold text-gray-800 truncate">{user?.email}</p>
                                </div>

                                {/* Menu Items */}
                                <div className="space-y-1">
                                    <Button
                                        variant="ghost"
                                        onClick={handleDelete}
                                        className="w-full justify-start gap-4 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50/30 rounded-xl transition-all duration-200 group"
                                    >
                                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-red-50 transition-colors">
                                            <Trash2 size={16} />
                                        </div>
                                        Delete Account
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        onClick={handleEditProfile}
                                        className="w-full justify-start gap-4 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30 rounded-xl transition-all duration-200 group"
                                    >
                                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                            <User size={16} />
                                        </div>
                                        Edit Profile
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        onClick={handleSettings}
                                        className="w-full justify-start gap-4 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30 rounded-xl transition-all duration-200 group"
                                    >
                                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                            <Settings size={16} />
                                        </div>
                                        Settings
                                    </Button>



                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-4 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/30 rounded-xl transition-all duration-200 group"
                                    >
                                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                                            <MessageSquare size={16} />
                                        </div>
                                        Support
                                    </Button>

                                    <div className="h-px bg-gray-100/50 my-1 mx-2" />

                                    <Button
                                        variant="ghost"
                                        onClick={handleLogoutClick}
                                        className="w-full justify-start gap-4 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                                    >
                                        <div className="p-1.5 bg-red-50/50 rounded-lg group-hover:bg-red-100 transition-colors">
                                            <LogOut size={16} className="text-red-500" />
                                        </div>
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <Confirm
                    onClose={cancelLogout}
                    onConfirm={confirmLogout}
                    title={logoutModalData.title}
                    message={logoutModalData.message}
                    buttonText={logoutModalData.buttonText}
                    Icon={logoutModalData.Icon}
                    buttonColor={logoutModalData.buttonColor}
                    iconBgColor={logoutModalData.iconBgColor}
                    iconColor={logoutModalData.iconColor}
                />
            )}

            {openModal === "setting" && (
                <Setting onClose={() => setOpenModal(null)} />
            )}

            {openModal === "delete" && (
                <DeleteAccount onClose={() => setOpenModal(null)} />
            )}

            {openModal === "editProfile" && (
                <EditProfile user={user} onClose={() => setOpenModal(null)} />
            )}
        </>
    );
};

export default Navbar;
