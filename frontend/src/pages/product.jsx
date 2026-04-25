// Product page
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/productCard';
import { getProducts } from '../services/productServices';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

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

  const filteredProducts = categoryFilter
    ? products.filter((p) => String(p.category_id) === categoryFilter)
    : products;

  const activeCategoryName = categoryFilter
    ? products.find((p) => String(p.category_id) === categoryFilter)?.category?.name || 'Selected category'
    : null;

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
          <p className="text-sm text-orange-100">Total products</p>
          <p className="mt-3 text-4xl font-semibold">{filteredProducts.length}</p>
        </article>
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Average price</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">
            ${filteredProducts.length ? (filteredProducts.reduce((sum, item) => sum + item.price, 0) / filteredProducts.length).toFixed(2) : '0.00'}
          </p>
        </article>
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Low product stock</p>
          <p className="mt-3 text-4xl font-semibold text-rose-600">
            {filteredProducts.filter((item) => (item.stock || 0) < 20).length}
          </p>
        </article>
      </section>

      {activeCategoryName && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">
            Products in {activeCategoryName}
          </h2>
          <button
            onClick={() => setSearchParams({})}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
          >
            Show all products
          </button>
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-stone-200 bg-white p-8 text-center text-sm text-slate-500">
          No products found in this category.
        </div>
      )}
    </div>
  );
}

