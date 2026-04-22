// Inventory page
import { useEffect, useState } from 'react';
import InventoryTable from '../components/inventoryTable';
import { getInventory } from '../services/productServices';

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInventory() {
      try {
        const inventory = await getInventory();
        setInventoryItems(inventory);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || requestError?.message || 'Unable to load inventory data from the backend.');
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  if (loading) {
    return <div className="rounded-[28px] bg-white p-8 text-sm text-slate-500 shadow-sm">Loading inventory...</div>;
  }

  if (error) {
    return <div className="rounded-[28px] bg-rose-50 p-8 text-sm text-rose-700 shadow-sm">{error}</div>;
  }

  const lowStockItems = inventoryItems.filter((item) => item.stock <= item.reorder_level);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Stock control</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">Inventory management</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Monitor ingredient levels, suppliers, and reorder thresholds directly from the backend inventory dataset.
          </p>
        </div>
        <div className="rounded-[28px] border border-stone-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">Items needing attention</p>
          <p className="mt-2 text-3xl font-semibold text-rose-600">{lowStockItems.length}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] bg-slate-900 p-6 text-white shadow-lg">
          <p className="text-sm text-slate-300">Total stock lines</p>
          <p className="mt-3 text-4xl font-semibold">{inventoryItems.length}</p>
        </article>
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Main supplier on page</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{inventoryItems[0]?.supplier || 'No supplier'}</p>
        </article>
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Most at risk</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{lowStockItems[0]?.name || 'All good'}</p>
        </article>
      </section>

      <section className="space-y-4 rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Current inventory</h2>
          <p className="mt-2 text-sm text-slate-500">Each line reflects a seeded inventory record joined with product, category, and supplier data.</p>
        </div>
        <InventoryTable data={inventoryItems} />
      </section>
    </div>
  );
}


