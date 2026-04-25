import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/login';
import Inventory from './pages/inventory';
import Orders from './pages/orders';
import Product from './pages/product';
import Categories from './pages/categories';
import heroImage from './../images/jay-wennington-N_Y88TWmGwA-unsplash.jpg';

const HeroBanner = () => (
  <section className="relative w-full h-48 md:h-56 overflow-hidden rounded-[28px] mb-6">
    <img
      src={heroImage}
      alt="Restaurant interior"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent rounded-[28px]" />
    <div className="absolute inset-0 flex flex-col justify-center px-8">
      <p className="text-sm uppercase tracking-[0.5em] text-amber-300 mb-2">DineFlow</p>
      <h2 className="text-2xl md:text-3xl font-bold text-white max-w-xl leading-tight">
        Everything your kitchen needs, all in one place.
      </h2>
    </div>
  </section>
);

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)]">
        <div className="hidden md:block w-[280px] flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 px-4 py-6 md:px-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <HeroBanner />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Product /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/suppliers" element={<ProtectedRoute><div className="p-8 text-slate-400">Suppliers page coming soon. Manage supplier relationships and deliveries here.</div></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

