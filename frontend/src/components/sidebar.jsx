import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 bg-white p-2 rounded shadow z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4 transform transition-transform ${
        isOpen || window.innerWidth >= 768 ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 z-40`}>
        <h2 className="text-xl font-bold mb-6 p-2">DineFlow</h2>
        
        <nav className="space-y-2">
          <Link to="/" className="block p-3 rounded hover:bg-gray-700">🏠 Dashboard</Link>
          {token && (
            <>
              <Link to="/products" className="block p-3 rounded hover:bg-gray-700">📦 Products</Link>
              <Link to="/inventory" className="block p-3 rounded hover:bg-gray-700">📊 Inventory</Link>
              <Link to="/orders" className="block p-3 rounded hover:bg-gray-700">📋 Orders</Link>
              <Link to="/categories" className="block p-3 rounded hover:bg-gray-700">🏷️ Categories</Link>
              <Link to="/suppliers" className="block p-3 rounded hover:bg-gray-700">🚚 Suppliers</Link>
            </>
          )}
        </nav>

        {token && (
          <button 
            onClick={handleLogout}
            className="w-full mt-8 bg-red-600 p-3 rounded hover:bg-red-700"
          >
            🚪 Logout
          </button>
        )}

        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </aside>
    </>
  );
};

export default Sidebar;
