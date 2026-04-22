import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">DineFlow</Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-gray-200 py-2">Dashboard</Link>
          <Link to="/products" className="text-white hover:text-gray-200 py-2">Products</Link>
          <Link to="/inventory" className="text-white hover:text-gray-200 py-2">Inventory</Link>
          <Link to="/orders" className="text-white hover:text-gray-200 py-2">Orders</Link>
        </div>

        {token ? (
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-white hover:text-gray-200 py-2">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
