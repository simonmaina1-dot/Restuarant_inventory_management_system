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

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/orders', label: 'Orders' },
    { to: '/categories', label: 'Categories' },
    { to: '/suppliers', label: 'Suppliers' },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 bg-white p-2 rounded shadow z-50 text-slate-900 font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0 md:h-auto md:top-auto z-50`}
      >
        <h2 className="text-xl font-bold mb-6 p-2">DineFlow</h2>

        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block p-3 rounded hover:bg-gray-700 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {token && (
          <button
            onClick={handleLogout}
            className="w-full mt-8 bg-red-600 p-3 rounded hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        )}

        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </aside>
    </>
  );
};

export default Sidebar;

