const ProductCard = ({ product }) => {
  const stockColor = product.stock_qty > 10 ? 'bg-green-100 text-green-800' :
                     product.stock_qty > 0 ? 'bg-yellow-100 text-yellow-800' :
                     'bg-red-100 text-red-800';

  return (
    <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md">
      <div className="h-32 bg-gray-100 rounded flex items-center justify-center mb-4">
        <span className="text-3xl">🍽️</span>
      </div>
      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
      <p className="text-green-600 font-semibold mb-2">${product.price || 0}</p>
      <p className="text-sm text-gray-600 mb-2">Stock: <span className={`px-2 py-1 rounded text-xs ${stockColor}`}>
        {product.stock_qty || 0}
      </span></p>
      {product.category && (
        <p className="text-sm text-gray-500 mb-4">{product.category.name}</p>
      )}
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Edit
        </button>
        <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
