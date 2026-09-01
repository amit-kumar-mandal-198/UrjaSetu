import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AppSidebar from './AppSidebar';

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="main-content-wrapper relative flex w-full" style={{ display: 'flex', width: '100%', position: 'relative' }}>
      
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-6 right-6 z-50 no-print">
         <button 
           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
           className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
         >
           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity no-print"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div 
        className={`app-sidebar fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
        style={{ flexShrink: 0, height: '100vh', width: '280px', background: 'transparent' }}
      >
        <AppSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="main-content flex-1 min-w-0 p-4 sm:p-6 lg:p-10" style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </div>
      
    </div>
  );
};

export default AppLayout;
