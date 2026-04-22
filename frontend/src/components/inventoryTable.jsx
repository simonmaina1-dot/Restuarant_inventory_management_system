import { useState, useEffect } from 'react';
import api from '../services/api.js';

const InventoryTable = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = api.get('/inventory');
      setItems((await response).data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.product_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-3 border rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{item.product_name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    item.stock_qty > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {item.stock_qty}
                  </span>
                </td>
                <td className="p-3">{item.supplier_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryTable;
