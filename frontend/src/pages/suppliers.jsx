import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact_email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await api.get('/suppliers');
      setSuppliers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/suppliers/${editingId}`, formData);
      } else {
        await api.post('/suppliers', formData);
      }
      setFormData({ name: '', contact_email: '', phone: '' });
      setShowForm(false);
      setEditingId(null);
      loadSuppliers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name,
      contact_email: supplier.contact_email,
      phone: supplier.phone
    });
    setEditingId(supplier.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this supplier?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      loadSuppliers();
    } catch (err) {
      setError(err.message);
    }
  };

  const supplierColors = [
    'bg-gradient-to-r from-blue-500 to-indigo-600',
    'bg-gradient-to-r from-green-500 to-emerald-600',
    'bg-gradient-to-r from-purple-500 to-violet-600',
    'bg-gradient-to-r from-orange-500 to-amber-600',
    'bg-gradient-to-r from-teal-500 to-cyan-600',
  ];

  if (loading) return <div className="p-8 text-slate-400">Loading suppliers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-500">Manage your product suppliers</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', contact_email: '', phone: '' });
          }}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition"
        >
          {showForm ? 'Cancel' : 'Add Supplier'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit' : 'New'} Supplier</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <input
              required
              placeholder="Supplier Name *"
              className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Contact Email"
              className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
              value={formData.contact_email}
              onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
            />
            <input
              placeholder="Phone"
              className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700"
          >
            {editingId ? 'Update Supplier' : 'Create Supplier'}
          </button>
        </form>
      )}

      {error && (
        <div className="p-4 bg-rose-100 border border-rose-400 rounded-xl text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier, index) => {
          const color = supplierColors[index % supplierColors.length];
          return (
            <div key={supplier.id} className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition">
              <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                <span className="text-white font-bold text-lg">
                  {supplier.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{supplier.name}</h3>
              <p className="text-slate-500 mb-4">{supplier.contact_email || 'No email'}</p>
              <p className="text-sm text-slate-500 mb-6">{supplier.phone || 'No phone'}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {suppliers.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-400">
          <p>No suppliers found. Add your first supplier above!</p>
        </div>
      )}
    </div>
  );
}

