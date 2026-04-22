// Product page
import { useEffect, useState } from 'react';
import ProductRoute from '../components/ProductRoute';
import { getProducts } from '../services/productServices';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const productData = await getProducts();
        setProducts(productData);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || requestError?.message || 'Unable to load products from the backend.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return <div className="rounded-[28px] bg-white p-8 text-sm text-slate-500 shadow-sm">Loading products...</div>;
  }

  if (error) {
    return <div className="rounded-[28px] bg-rose-50 p-8 text-sm text-rose-700 shadow-sm">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] bg-orange-500 p-6 text-white shadow-lg">
          <p className="text-sm text-orange-100">Bestsellers</p>
          <p className="mt-3 text-4xl font-semibold">{products.filter((item) => item.popular).length}</p>
        </article>
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Average price</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">
            ${(products.reduce((sum, item) => sum + item.price, 0) / products.length).toFixed(2)}
          </p>
        </article>
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Low product stock</p>
          <p className="mt-3 text-4xl font-semibold text-rose-600">
            {products.filter((item) => item.stock < 20).length}
          </p>
        </article>
      </section>

      <ProductRoute products={products} />
    </div>
  );
}


