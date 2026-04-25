import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/sidebar'
import { getDashboardSummary } from '../services/dashboardService'

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
    <div className="space-y-6">

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
                    onClick={() => alert(`Quick action: ${action}`)}
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
    </div>
  )
}

export default Dashboard

