import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const ProductRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return token ? <Outlet /> : null;
};

export default ProductRoute;
