import React from 'react';
import { Menu, Store, BarChart3, Users, Package, Settings, LogOut } from 'lucide-react';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center flex-shrink-0 px-4">
                <Store className="w-8 h-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MarketGenius 360</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ml-4 md:ml-6">
                <button className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">View notifications</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <div className="ml-3">
                  <div className="relative">
                    <button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User avatar"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 bg-white border-r border-gray-200`}>
          <div className="flex flex-col h-screen">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md group">
                <BarChart3 className="w-6 h-6 mr-3" />
                Dashboard
              </a>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                <Store className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500" />
                Stores
              </a>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                <Package className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500" />
                Products
              </a>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                <Users className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500" />
                Customers
              </a>
              <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                <Settings className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500" />
                Settings
              </a>
            </nav>
            <div className="p-4 border-t border-gray-200">
              <button className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                <LogOut className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;