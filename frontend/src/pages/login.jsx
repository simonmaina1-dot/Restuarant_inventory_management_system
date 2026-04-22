// Login page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('manager@restaurant.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate('/');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Unable to sign in with the backend right now.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f59e0b,_#7c2d12_42%,_#111827_100%)] p-4 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[36px] border border-white/10 bg-white/8 p-8 backdrop-blur lg:p-12">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-200">DineFlow</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">
            Run your restaurant from one calm, powerful dashboard.
          </h1>
          <p className="mt-5 max-w-xl text-sm text-stone-200">
            Coordinate menu products, track inventory movement, and keep service teams aligned through a focused operations workspace.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-black/15 p-4">
              <p className="text-sm text-amber-100">Inventory view</p>
              <p className="mt-2 text-2xl font-semibold">Live stock health</p>
            </div>
            <div className="rounded-3xl bg-black/15 p-4">
              <p className="text-sm text-amber-100">Menu control</p>
              <p className="mt-2 text-2xl font-semibold">Products by category</p>
            </div>
            <div className="rounded-3xl bg-black/15 p-4">
              <p className="text-sm text-amber-100">Order tracking</p>
              <p className="mt-2 text-2xl font-semibold">Shift-by-shift status</p>
            </div>
          </div>
        </section>

        <section className="rounded-[36px] bg-white p-8 text-slate-900 shadow-2xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-orange-600">Welcome back</p>
          <h2 className="mt-3 text-3xl font-semibold">Sign in to continue</h2>
          <p className="mt-2 text-sm text-slate-500">Use one of the seeded backend users to open the operations dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-orange-500"
                placeholder="admin@restaurant.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-orange-500"
                placeholder="password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Opening dashboard...' : 'Enter dashboard'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-orange-50 p-4 text-sm text-slate-600">
            Seeded login: <span className="font-semibold">admin@restaurant.com</span> with any password value.
          </div>
        </section>
      </div>
    </div>
  );
}


