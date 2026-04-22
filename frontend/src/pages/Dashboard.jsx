// Dashboard page
import { useEffect, useState } from 'react';
import InventoryTable from '../components/inventoryTable';
import OrderTable from '../components/OrderTable';
import { getCategories, getInventory, getOrders, getProducts } from '../services/productServices';

const categoryAccents = [
  'from-orange-400 to-red-500',
  'from-lime-400 to-emerald-500',
  'from-sky-400 to-cyan-500',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-fuchsia-500',
  'from-teal-400 to-emerald-500',
];

export default function Dashboard() {
  const [data, setData] = useState({
    categories: [],
    inventory: [],
    orders: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [categories, inventory, orders, products] = await Promise.all([
          getCategories(),
          getInventory(),
          getOrders(),
          getProducts(),
        ]);

        setData({ categories, inventory, orders, products });
      } catch (requestError) {
        setError(requestError?.response?.data?.message || requestError?.message || 'Unable to load dashboard data from the backend.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="rounded-[28px] bg-white p-8 text-sm text-slate-500 shadow-sm">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="rounded-[28px] bg-rose-50 p-8 text-sm text-rose-700 shadow-sm">{error}</div>;
  }

  const totalSales = data.orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockCount = data.inventory.filter((item) => item.stock <= item.reorder_level).length;
  const completedOrders = data.orders.filter((order) => order.status === 'Completed').length;
  const popularProducts = data.products.filter((product) => product.popular);
  const riskItem = data.inventory.find((item) => item.stock <= item.reorder_level);

  const statCards = [
    { label: 'Active products', value: data.products.length, accent: 'text-orange-600', note: 'Loaded from the product catalog' },
    { label: 'Low-stock ingredients', value: lowStockCount, accent: 'text-rose-600', note: 'Below the backend reorder threshold' },
    { label: 'Revenue in orders', value: `$${totalSales.toFixed(2)}`, accent: 'text-emerald-600', note: 'Calculated from seeded order totals' },
    { label: 'Completed orders', value: completedOrders, accent: 'text-sky-600', note: 'Finished orders in the current dataset' },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-[32px] bg-[#1f3b33] p-7 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Service pulse</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight">
            Keep the dining room moving with live visibility across stock, menu items, and orders.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-stone-200">
            Everything on this screen now comes from the backend seed dataset, so your dashboard reflects the same products, categories, and orders defined by the project backend.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-stone-200">Most ordered</p>
              <p className="mt-2 text-2xl font-semibold">{popularProducts[0]?.name || 'No data'}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-stone-200">Critical supply</p>
              <p className="mt-2 text-2xl font-semibold">{riskItem?.name || 'Stable stock'}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-stone-200">Open order flow</p>
              <p className="mt-2 text-2xl font-semibold">
                {data.orders.filter((order) => order.status !== 'Completed').length} active
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Category mix</p>
          <div className="mt-6 space-y-4">
            {data.categories.map((category, index) => (
              <div key={category.id}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{category.name}</span>
                  <span className="text-slate-400">{category.items} items</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${categoryAccents[index % categoryAccents.length]}`}
                    style={{ width: `${Math.min(category.items * 15, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {statCards.map((card) => (
          <article key={card.label} className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`mt-3 text-4xl font-semibold ${card.accent}`}>{card.value}</p>
            <p className="mt-2 text-sm text-slate-400">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Inventory watchlist</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ingredients in motion</h2>
          </div>
          <InventoryTable data={data.inventory.slice(0, 6)} />
        </div>

        <div className="space-y-4 rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Quick actions</p>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-stone-100 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Restock alert</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{lowStockCount} items need attention</h3>
              <p className="mt-2 text-sm text-slate-500">Use the inventory page to review supplier and unit information from the backend.</p>
            </div>
            <div className="rounded-3xl bg-orange-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-500">Prep cue</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{popularProducts[0]?.name || 'Top product'} is leading sales</h3>
              <p className="mt-2 text-sm text-slate-500">Popular products are inferred from the order items in `seed_data.sql`.</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Team performance</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{completedOrders} orders are already complete</h3>
              <p className="mt-2 text-sm text-slate-500">Order status and totals are now coming from the backend instead of local mock arrays.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Order activity</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent orders</h2>
        </div>
        <OrderTable data={data.orders} />
      </section>
    </div>
  );
}


