// Categories page
import { useEffect, useState } from 'react';
import { getCategories } from '../services/productServices';

const categoryDecor = [
  { accent: 'from-orange-400 to-red-500' },
  { accent: 'from-lime-400 to-emerald-500' },
  { accent: 'from-sky-400 to-cyan-500' },
  { accent: 'from-pink-400 to-rose-500' },
  { accent: 'from-amber-400 to-orange-500' },
  { accent: 'from-blue-400 to-indigo-500' },
  { accent: 'from-teal-400 to-green-500'},
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || requestError?.message || 'Unable to load categories from the backend.');
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return <div className="rounded-[28px] bg-white p-8 text-sm text-slate-500 shadow-sm">Loading categories...</div>;
  }

  if (error) {
    return <div className="rounded-[28px] bg-rose-50 p-8 text-sm text-rose-700 shadow-sm">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Menu organization</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Categories</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">
          These groups are now sourced from the backend seed file and include live item counts from the product catalog.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => {
          const decor = categoryDecor[index % categoryDecor.length];

          return (
            <article
              key={category.id}
              className={`rounded-[30px] bg-gradient-to-br ${decor.accent} p-[1px] shadow-lg`}
            >
              <div className="h-full rounded-[30px] bg-white/95 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                    {decor.icon}
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    {category.items} items
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-slate-900">{category.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{category.description}</p>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}


