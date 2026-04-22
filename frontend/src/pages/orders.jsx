// Orders page
import { useEffect, useState } from 'react';
import OrderTable from '../components/OrderTable';
import { getOrders } from '../services/productServices';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrders() {
      try {
        const orderData = await getOrders();
        setOrders(orderData);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || requestError?.message || 'Unable to load orders from the backend.');
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return <div className="rounded-[28px] bg-white p-8 text-sm text-slate-500 shadow-sm">Loading orders...</div>;
  }

  if (error) {
    return <div className="rounded-[28px] bg-rose-50 p-8 text-sm text-rose-700 shadow-sm">{error}</div>;
  }

  const preparingCount = orders.filter((order) => order.status === 'Pending').length;
  const readyCount = orders.filter((order) => order.status === 'Cancelled').length;
  const completedCount = orders.filter((order) => order.status === 'Completed').length;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Service flow</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">Orders</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Follow live ticket data from the backend seed records, including waiter ownership and item summaries.
          </p>
        </div>
        <div className="rounded-[28px] bg-[#1f3b33] px-5 py-4 text-white shadow-lg">
          <p className="text-sm text-stone-300">Open order load</p>
          <p className="mt-2 text-3xl font-semibold">{preparingCount + readyCount} active orders</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-3 text-4xl font-semibold text-amber-600">{preparingCount}</p>
        </article>
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Cancelled</p>
          <p className="mt-3 text-4xl font-semibold text-slate-600">{readyCount}</p>
        </article>
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-3 text-4xl font-semibold text-emerald-600">{completedCount}</p>
        </article>
      </section>

      <section className="space-y-4 rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Live order board</h2>
          <p className="mt-2 text-sm text-slate-500">This table is populated from orders and order items in the backend seed file.</p>
        </div>
        <OrderTable data={orders} />
      </section>
    </div>
  );
}


