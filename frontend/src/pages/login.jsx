// Login page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import heroImage from '../../images/jay-wennington-N_Y88TWmGwA-unsplash.jpg';

export default function Login() {
  const [username, setUsername] = useState('manager');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser(username, password);
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

  const featureCards = [
    {
      label: 'Live stock health',
      description: 'Real-time inventory tracking',
    },
    {
      label: 'Menu control',
      description: 'Products by category',
    },
    {
      label: 'Order tracking',
      description: 'Shift-by-shift status',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Full-width hero banner with image */}
      <section className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={heroImage}
          alt="Restaurant interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-sm uppercase tracking-[0.5em] text-amber-300 mb-3">DineFlow</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight">
            Run your restaurant from one calm, powerful dashboard.
          </h1>
        </div>
      </section>

      {/* Login form section with feature cards on the left */}
      <div className="mx-auto max-w-6xl px-4 py-12 -mt-20 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Left side: Feature highlights */}
          <div className="space-y-4 lg:pt-8">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300 mb-4">Features</p>
            {featureCards.map((card) => (
              <div
                key={card.label}
                className="rounded-3xl bg-white/5 border border-white/10 p-6"
              >
                <p className="text-lg font-semibold text-amber-200">{card.label}</p>
                <p className="text-sm text-slate-400 mt-2">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Right side: Login form */}
          <section className="rounded-[36px] bg-white p-8 text-slate-900 shadow-2xl lg:p-10">
            <p className="text-sm uppercase tracking-[0.35em] text-orange-600">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold">Sign in to continue</h2>
            <p className="mt-2 text-sm text-slate-500">
              Use one of the seeded backend users to open the operations dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-orange-500"
                  placeholder="manager"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              Seeded login: <span className="font-semibold">admin</span> with any password value.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

