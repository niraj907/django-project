import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './Sidebar';
import Header from './Header';


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;