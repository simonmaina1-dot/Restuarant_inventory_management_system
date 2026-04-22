import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/sidebar'
import { getDashboardSummary } from '../services/dashboardService'
>>>>>>> origin/donald

const quickActions = [
  'Add a new product',
  'Record stock in',
  'Create supplier note',
  'Review pending orders',
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        setLoading(true)
        const data = await getDashboardSummary()

        if (active) {
          setSummary(data)
          setError('')
        }
      } catch (requestError) {
        if (active) {
          setError('Unable to reach the backend. Start the Flask server and refresh.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const metrics = [
    {
      label: 'Revenue',
      value: formatCurrency(summary?.metrics?.revenue),
      change: `${summary?.metrics?.pending_orders ?? 0} pending`,
      tone: 'text-emerald-300',
    },
    {
      label: 'Orders served',
      value: String(summary?.metrics?.orders_served ?? 0),
      change: `${summary?.recent_orders?.length ?? 0} recent`,
      tone: 'text-sky-300',
    },
    {
      label: 'Low stock items',
      value: String(summary?.metrics?.low_stock_items ?? 0).padStart(2, '0'),
      change: 'Needs attention',
      tone: 'text-rose-300',
    },
    {
      label: 'Products tracked',
      value: String(summary?.metrics?.total_products ?? 0),
      change: formatCurrency(summary?.metrics?.inventory_value),
      tone: 'text-amber-300',
    },
  ]

  const inventoryAlerts = summary?.inventory_alerts ?? []
  const recentOrders = summary?.recent_orders ?? []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="dashboard-shell mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[280px_minmax(0,1fr)] md:px-6">
        <Sidebar />

        <main className="space-y-6">
          <Navbar />

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="metric-card rounded-[28px] p-5">
                <p className="text-sm text-slate-300">{metric.label}</p>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-semibold text-white">{metric.value}</h2>
                  <span className={`text-sm font-medium ${metric.tone}`}>{metric.change}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <article className="glass-panel rounded-[30px] p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Shift overview
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Service pace is steady this evening
                  </h3>
                </div>
                <p className="max-w-sm text-sm text-slate-300">
                  {loading
                    ? 'Loading live kitchen and inventory data from the backend.'
                    : error ||
                      'Live data is connected. Keep an eye on restock alerts and recent orders.'}
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-950/70 p-5">
                  <p className="text-sm text-slate-400">Average order value</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {formatCurrency(
                      (summary?.metrics?.revenue || 0) /
                        Math.max(summary?.metrics?.orders_served || 0, 1),
                    )}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/70 p-5">
                  <p className="text-sm text-slate-400">Orders pending</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {summary?.metrics?.pending_orders ?? 0}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/70 p-5">
                  <p className="text-sm text-slate-400">Inventory value</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {formatCurrency(summary?.metrics?.inventory_value)}
                  </p>
                </div>
              </div>
            </article>

            <article className="glass-panel rounded-[30px] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quick actions</p>
              <div className="mt-5 grid gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-medium text-slate-100 transition hover:border-amber-300/40 hover:bg-amber-300/10"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="glass-panel rounded-[30px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Inventory alerts
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Restock watchlist</h3>
                </div>
                <span className="rounded-full bg-rose-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                  Attention
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {inventoryAlerts.length > 0 ? (
                  inventoryAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-white">{alert.item}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {alert.amount} left, reorder at {alert.reorder_level}
                        </p>
                      </div>
                      <span className="rounded-full bg-rose-400/15 px-3 py-1 text-xs font-semibold text-rose-200">
                        {alert.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
                    {loading ? 'Checking stock levels...' : 'No low-stock items found.'}
                  </div>
                )}
              </div>
            </article>

            <article className="glass-panel rounded-[30px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Recent orders
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Front-of-house activity</h3>
                </div>
                <span className="text-sm text-slate-400">Updated just now</span>
              </div>

              <div className="mt-5 space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {order.label} <span className="text-slate-400">{order.table}</span>
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {order.state}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
                    {loading ? 'Loading recent orders...' : 'No orders found in the database yet.'}
                  </div>
                )}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
>>>>>>> origin/donald
=======
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/sidebar'
import InventoryTable from '../components/inventoryTable';
import OrderTable from '../components/OrderTable';
import { getDashboardSummary } from '../services/dashboardService'
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

const quickActions = [
  'Add a new product',
  'Record stock in',
  'Create supplier note',
  'Review pending orders',
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function Dashboard() {
  const [data, setData] = useState({
    categories: [],
    inventory: [],
    orders: [],
    products: [],
    summary: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [categories, inventory, orders, products, summary] = await Promise.all([
          getCategories(),
          getInventory(),
          getOrders(),
          getProducts(),
          getDashboardSummary(),
        ]);

        if (active) {
          setData({ categories, inventory, orders, products, summary });
          setError('');
        }
      } catch (requestError) {
        if (active) {
          setError(requestError?.response?.data?.message || requestError?.message || 'Unable to load dashboard data from the backend. Start the Flask server and refresh.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="dashboard-shell mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[280px_minmax(0,1fr)] md:px-6">
          <Sidebar />
          <main className="space-y-6">
            <Navbar />
            <div className="metric-card rounded-[28px] p-8 text-sm text-slate-400">Loading dashboard...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="dashboard-shell mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[280px_minmax(0,1fr)] md:px-6">
          <Sidebar />
          <main className="space-y-6">
            <Navbar />
            <div className="metric-card rounded-[28px] bg-rose-500/10 p-8 text-sm text-rose-300 border border-rose-500/20">{error}</div>
          </main>
        </div>
      </div>
    );
  }

  const totalSales = data.orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockCount = data.inventory.filter((item) => item.stock <= item.reorder_level).length;
  const completedOrders = data.orders.filter((order) => order.status === 'Completed').length;
  const popularProducts = data.products.filter((product) => product.popular);
  const riskItem = data.inventory.find((item) => item.stock <= item.reorder_level);

  const statCards = [
    { label: 'Active products', value: data.products.length, accent: 'text-orange-600', note: 'Loaded from the product catalog' },
    { label: 'Low-stock ingredients', value: lowStockCount, accent: 'text-rose-600', note: 'Below the backend reorder threshold' },
    { label: 'Revenue in orders', value: `KES${totalSales.toFixed(2)}`, accent: 'text-emerald-600', note: 'Calculated from seeded order totals' },
    { label: 'Completed orders', value: completedOrders, accent: 'text-sky-600', note: 'Finished orders in the current dataset' },
  ];

  const metrics = [
    {
      label: 'Revenue',
      value: formatCurrency(data.summary?.metrics?.revenue),
      change: `${data.summary?.metrics?.pending_orders ?? 0} pending`,
      tone: 'text-emerald-300',
    },
    {
      label: 'Orders served',
      value: String(data.summary?.metrics?.orders_served ?? 0),
      change: `${data.summary?.recent_orders?.length ?? 0} recent`,
      tone: 'text-sky-300',
    },
    {
      label: 'Low stock items',
      value: String(data.summary?.metrics?.low_stock_items ?? 0).padStart(2, '0'),
      change: 'Needs attention',
      tone: 'text-rose-300',
    },
    {
      label: 'Products tracked',
      value: String(data.summary?.metrics?.total_products ?? 0),
      change: formatCurrency(data.summary?.metrics?.inventory_value),
      tone: 'text-amber-300',
    },
  ];

  const inventoryAlerts = data.summary?.inventory_alerts ?? [];
  const recentOrders = data.summary?.recent_orders ?? [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="dashboard-shell mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[280px_minmax(0,1fr)] md:px-6">
        <Sidebar />

        <main className="space-y-6">
          <Navbar />

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="metric-card rounded-[28px] p-5">
                <p className="text-sm text-slate-300">{metric.label}</p>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-semibold text-white">{metric.value}</h2>
                  <span className={`text-sm font-medium ${metric.tone}`}>{metric.change}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="overflow-hidden rounded-[32px] bg-[#1f3b33] p-7 text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Service pulse</p>
              <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight">
                Keep the dining room moving with live visibility across stock, menu items, and orders.
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-stone-200">
                Live data connected from backend API. Dashboard combines legacy table views with modern summary metrics.
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

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="space-y-4 rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Inventory watchlist</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ingredients in motion</h2>
              </div>
              <InventoryTable data={data.inventory.slice(0, 6)} />
            </article>

            <article className="glass-panel rounded-[30px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Inventory alerts</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Restock watchlist</h3>
                </div>
                <span className="rounded-full bg-rose-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                  {lowStockCount} items
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {inventoryAlerts.length > 0 ? (
                  inventoryAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                      <div>
                        <p className="font-medium text-white">{alert.item}</p>
                        <p className="mt-1 text-sm text-slate-400">{alert.amount} left, reorder at {alert.reorder_level}</p>
                      </div>
                      <span className="rounded-full bg-rose-400/15 px-3 py-1 text-xs font-semibold text-rose-200">{alert.status}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
                    No low-stock items found.
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="space-y-4 rounded-[32px] border border-stone-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-600">Order activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent orders</h2>
              </div>
              <OrderTable data={data.orders} />
            </article>

            <article className="glass-panel rounded-[30px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent orders</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Front-of-house activity</h3>
                </div>
                <span className="text-sm text-slate-400">Updated just now</span>
              </div>
              <div className="mt-5 space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                      <div>
                        <p className="font-medium text-white">{order.label} <span className="text-slate-400">{order.table}</span></p>
                        <p className="mt-1 text-sm text-slate-400">{formatCurrency(order.total)}</p>
                      </div>
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">{order.state}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
                    No orders found in the database yet.
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <article key={card.label} className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className={`mt-3 text-4xl font-semibold ${card.accent}`}>{card.value}</p>
                <p className="mt-2 text-sm text-slate-400">{card.note}</p>
              </article>
            ))}
          </section>

          <section className="glass-panel rounded-[30px] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quick actions</p>
            <div className="mt-5 grid gap-3">
              {quickActions.map((action) => (
                <button key={action} type="button" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-medium text-slate-100 transition hover:border-amber-300/40 hover:bg-amber-300/10">
                  {action}
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

=======
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/sidebar'
import { getDashboardSummary } from '../services/dashboardService'
>>>>>>> origin/donald

const quickActions = [
  'Add a new product',
  'Record stock in',
  'Create supplier note',
  'Review pending orders',
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        setLoading(true)
        const data = await getDashboardSummary()

        if (active) {
          setSummary(data)
          setError('')
        }
      } catch (requestError) {
        if (active) {
          setError('Unable to reach the backend. Start the Flask server and refresh.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const metrics = [
    {
      label: 'Revenue',
      value: formatCurrency(summary?.metrics?.revenue),
      change: `${summary?.metrics?.pending_orders ?? 0} pending`,
      tone: 'text-emerald-300',
    },
    {
      label: 'Orders served',
      value: String(summary?.metrics?.orders_served ?? 0),
      change: `${summary?.recent_orders?.length ?? 0} recent`,
      tone: 'text-sky-300',
    },
    {
      label: 'Low stock items',
      value: String(summary?.metrics?.low_stock_items ?? 0).padStart(2, '0'),
      change: 'Needs attention',
      tone: 'text-rose-300',
    },
    {
      label: 'Products tracked',
      value: String(summary?.metrics?.total_products ?? 0),
      change: formatCurrency(summary?.metrics?.inventory_value),
      tone: 'text-amber-300',
    },
  ]

  const inventoryAlerts = summary?.inventory_alerts ?? []
  const recentOrders = summary?.recent_orders ?? []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="dashboard-shell mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[280px_minmax(0,1fr)] md:px-6">
        <Sidebar />

        <main className="space-y-6">
          <Navbar />

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="metric-card rounded-[28px] p-5">
                <p className="text-sm text-slate-300">{metric.label}</p>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <h2 className="text-3xl font-semibold text-white">{metric.value}</h2>
                  <span className={`text-sm font-medium ${metric.tone}`}>{metric.change}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <article className="glass-panel rounded-[30px] p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Shift overview
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Service pace is steady this evening
                  </h3>
                </div>
                <p className="max-w-sm text-sm text-slate-300">
                  {loading
                    ? 'Loading live kitchen and inventory data from the backend.'
                    : error ||
                      'Live data is connected. Keep an eye on restock alerts and recent orders.'}
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-950/70 p-5">
                  <p className="text-sm text-slate-400">Average order value</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {formatCurrency(
                      (summary?.metrics?.revenue || 0) /
                        Math.max(summary?.metrics?.orders_served || 0, 1),
                    )}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/70 p-5">
                  <p className="text-sm text-slate-400">Orders pending</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {summary?.metrics?.pending_orders ?? 0}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/70 p-5">
                  <p className="text-sm text-slate-400">Inventory value</p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {formatCurrency(summary?.metrics?.inventory_value)}
                  </p>
                </div>
              </div>
            </article>

            <article className="glass-panel rounded-[30px] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quick actions</p>
              <div className="mt-5 grid gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-medium text-slate-100 transition hover:border-amber-300/40 hover:bg-amber-300/10"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="glass-panel rounded-[30px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Inventory alerts
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Restock watchlist</h3>
                </div>
                <span className="rounded-full bg-rose-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                  Attention
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {inventoryAlerts.length > 0 ? (
                  inventoryAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-white">{alert.item}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {alert.amount} left, reorder at {alert.reorder_level}
                        </p>
                      </div>
                      <span className="rounded-full bg-rose-400/15 px-3 py-1 text-xs font-semibold text-rose-200">
                        {alert.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
                    {loading ? 'Checking stock levels...' : 'No low-stock items found.'}
                  </div>
                )}
              </div>
            </article>

            <article className="glass-panel rounded-[30px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Recent orders
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Front-of-house activity</h3>
                </div>
                <span className="text-sm text-slate-400">Updated just now</span>
              </div>

              <div className="mt-5 space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {order.label} <span className="text-slate-400">{order.table}</span>
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {order.state}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
                    {loading ? 'Loading recent orders...' : 'No orders found in the database yet.'}
                  </div>
                )}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
