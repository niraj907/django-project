import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "@/assets/logo.png"
import ConfirmLogout from '../model/ConfirmLogout';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      current: location.pathname === '/dashboard',
    },
    {
      name: 'Projects',
      path: '/dashboard/projects',
      current: location.pathname === '/dashboard/projects',
    },
    {
      name: 'Form',
      path: '/dashboard/multi-form',
      current: location.pathname === '/dashboard/multi-form',
    },
   

     {
      name: 'Manage',
      path: '/dashboard/manage',
      current: location.pathname === '/dashboard/manage',
    },
  ];



  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed z-60 inset-y-0 left-0  w-64 bg-white shadow-lg transform transition duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full fixed w-full">
          <div className="flex items-center justify-between px-4 py-5">
<div
  className="text-3xl font-bold text-indigo-600 cursor-pointer font-poppins tracking-wide"
  onClick={() => navigate('/dashboard')}
>
  <img 
    src={logo} 
    alt="Logo" 
    className="w-16 h-16 object-contain" 
  />
</div>


            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 text-base font-medium rounded-md ${
                  item.current
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <div
              className="flex gap-2 text-gray-500 p-3 rounded-lg transition-colors text-[1rem] cursor-pointer hover:bg-gray-100"
             onClick={() => setShowModal(true)}
            >
              <LogOut size={20} />
              <p className="text-base font-medium">Logout</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ConfirmLogout
          onClose={() => setShowModal(false)}
          // onConfirm={handleLogout}
          message="Are you sure you want to log out?"
        />
      )}

    </>
  );
};

export default Sidebar;  
     