import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { changePassword } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const openModal = () => {
    setShowModal(true);
    setPasswordMessage('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters.');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowModal(false), 1500);
    } catch (error) {
      setPasswordMessage(
        error?.message || 'Failed to change password. Please try again.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <nav className="bg-blue-600 p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">DineFlow</Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-white hover:text-gray-200 py-2">Dashboard</Link>
            <Link to="/products" className="text-white hover:text-gray-200 py-2">Products</Link>
            <Link to="/inventory" className="text-white hover:text-gray-200 py-2">Inventory</Link>
            <Link to="/orders" className="text-white hover:text-gray-200 py-2">Orders</Link>
          </div>

          {token ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={openModal}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 font-medium"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-200 py-2">Login</Link>
          )}
        </div>
      </nav>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Change Password</h2>

            {passwordMessage && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${passwordMessage.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {passwordMessage}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Current Password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-blue-500"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-blue-500"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Confirm New Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-blue-500"
                  required
                />
              </label>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-stone-300 px-4 py-3 text-slate-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

