// Categories page
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/productServices';

const categoryAccents = [
  'from-orange-400 to-red-500',
  'from-lime-400 to-emerald-500',
  'from-sky-400 to-cyan-500',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-blue-400 to-indigo-500',
  'from-teal-400 to-green-500',
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            'Unable to load categories from the backend.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-sm text-slate-500 shadow-sm">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] bg-rose-50 p-8 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-orange-600">
          Menu organization
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Categories</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">
          Click any category to view the products listed under it.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => {
          const accent = categoryAccents[index % categoryAccents.length];

          return (
            <article
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`rounded-[30px] bg-gradient-to-br ${accent} p-[1px] shadow-lg cursor-pointer hover:shadow-xl transition`}
            >
              <div className="h-full rounded-[30px] bg-white/95 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-slate-900 shadow-sm">
                    {category.name.charAt(0)}
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    {category.items} items
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-slate-900">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {category.description}
                </p>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

