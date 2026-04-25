import { useState } from 'react';

const OrderTable = ({ data }) => {
  const [search, setSearch] = useState('');

  const filteredOrders = (data || []).filter(order =>
    order.id.toString().includes(search) ||
    (order.customer_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      
      <input
        type="text"
        placeholder="Search orders..."
        className="w-full p-3 border rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="p-3">#{order.id}</td>
              <td className="p-3">{order.customer_name || 'N/A'}</td>
              <td className="p-3 font-semibold">${order.total_amount || order.total || 0}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === 'completed' ? 'bg-green-100' :
                  order.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;

