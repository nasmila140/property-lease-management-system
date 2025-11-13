import { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Search } from 'lucide-react';
import { supabase, Property, Payment } from './lib/supabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PropertySearch from './components/PropertySearch';
import PropertyDetails from './components/PropertyDetails';

type View = 'dashboard' | 'search';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<Payment[]>([]);

  useEffect(() => {
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setSelectedProperty(null);
    setSelectedPayments([]);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handlePropertySelect = (property: Property, payments: Payment[]) => {
    setSelectedProperty(property);
    setSelectedPayments(payments);
  };

  const handleBackToSearch = () => {
    setSelectedProperty(null);
    setSelectedPayments([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">Property Lease Manager</h1>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    handleBackToSearch();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    setCurrentView('search');
                    handleBackToSearch();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'search'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Search className="w-5 h-5" />
                  Search Property
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : (
          <div className="space-y-6">
            <PropertySearch onPropertySelect={handlePropertySelect} />

            {selectedProperty && (
              <div>
                <button
                  onClick={handleBackToSearch}
                  className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  ← Back to Search
                </button>
                <PropertyDetails property={selectedProperty} payments={selectedPayments} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
