import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { useAuthStore } from "../store/authStore";
import EditProfile from "../model/EditProfile";
import Setting from "../model/Setting";
import DeleteAccount from "../model/DeleteAccount";

const Header = ({ setSidebarOpen }) => {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("User:", user);
  }, [isAuthenticated, user]);

  const [openModal, setOpenModal] = useState(null); // "edit", "setting", or null
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setOpenModal("edit");
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    setOpenModal("setting");
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    setOpenModal("delete");
    setIsDropdownOpen(false);
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          className="md:hidden text-gray-500 hover:text-gray-600"
          onClick={() => setSidebarOpen(true)}
        >
          <HiMenu className="h-6 w-6" />
        </button>

        {/* Dashboard Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

  {/* <button className='bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 mx-4 rounded-md shadow-sm transition duration-300'>
        + Add Category
      </button> */}


        {/* User Dropdown */}
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
              type="button"
              className="rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              id="user-menu-button"
              onClick={toggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <div
                className="border-2 border-gray-300 rounded-full w-10 h-10 flex items-center justify-center 
                text-sm font-medium hover:bg-blue-100 hover:border-blue-400 cursor-pointer transition-all duration-200"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-md ring-1 ring-black/5"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <a
                  onClick={handleEdit}
                  className="block px-4 py-2 text-sm text-gray-700 m-1 cursor-pointer 
                  hover:rounded-sm hover:bg-gray-100 transition-all duration-300 font-medium"
                  role="menuitem"
                >
                  Edit Profile
                </a>

                <a
                  onClick={handleSettings}
                  className="block px-4 py-2 text-sm text-gray-700 m-1 cursor-pointer 
                  hover:rounded-sm hover:bg-gray-100 transition-all duration-300 font-medium"
                  role="menuitem"
                >
                  Settings
                </a>

                <a
                  onClick={handleDelete}
                  className="block px-4 py-2 text-sm text-gray-700 m-1 cursor-pointer 
                  hover:rounded-sm hover:bg-gray-100 transition-all duration-300 font-medium"
                  role="menuitem"
                >
                Delete account
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {openModal === "edit" && <EditProfile   user={user}  onClose={() => setOpenModal(null)} />}
      {openModal === "setting" && <Setting onClose={() => setOpenModal(null)} />}
      {openModal === "delete" && <DeleteAccount onClose={() => setOpenModal(null)} />}
    </header>
  );
};

export default Header;
