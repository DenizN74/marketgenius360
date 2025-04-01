import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/auth/AuthForm';
import DashboardLayout from './components/layout/DashboardLayout';
import StatsCard from './components/dashboard/StatsCard';
import { Store, BarChart3, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from './lib/supabase';

function App() {
  const { user, loading } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  // Function to test and establish Supabase connection
  const connectToSupabase = async () => {
    setIsConnecting(true);
    try {
      // Test the connection by making a simple query
      const { error } = await supabase.from('stores').select('count').single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Successfully connected to Supabase!');
    } catch (error) {
      console.error('Supabase connection error:', error);
      toast.error('Failed to connect to Supabase. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show auth form for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MarketGenius 360</span>
              </div>
              <button
                onClick={connectToSupabase}
                disabled={isConnecting}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white 
                  ${isConnecting 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isConnecting ? 'Connecting...' : 'Connect to Supabase'}
              </button>
            </div>
          </div>
        </nav>
        <AuthForm />
      </div>
    );
  }

  // Show dashboard for authenticated users
  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-gray-500">Track your business performance and growth</p>
          </div>
          <button
            onClick={connectToSupabase}
            disabled={isConnecting}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white 
              ${isConnecting 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isConnecting ? 'Connecting...' : 'Connect to Supabase'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$24,567"
          change={12}
          trend="up"
        />
        <StatsCard
          title="Total Orders"
          value="846"
          change={8}
          trend="up"
        />
        <StatsCard
          title="New Customers"
          value="124"
          change={-2}
          trend="down"
        />
        <StatsCard
          title="Conversion Rate"
          value="3.2%"
          change={5}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Overview Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Revenue Overview</h3>
          <div className="flex items-center justify-center h-64 mt-4 bg-gray-50 rounded">
            <BarChart3 className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        
        {/* Recent Activity Feed */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center p-4 bg-gray-50 rounded">
                <div className="flex-shrink-0">
                  {i % 3 === 0 && <ShoppingCart className="w-6 h-6 text-indigo-600" />}
                  {i % 3 === 1 && <Users className="w-6 h-6 text-green-600" />}
                  {i % 3 === 2 && <DollarSign className="w-6 h-6 text-yellow-600" />}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {i % 3 === 0 && 'New order received'}
                    {i % 3 === 1 && 'New customer registered'}
                    {i % 3 === 2 && 'Payment processed'}
                  </p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;