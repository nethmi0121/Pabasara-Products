import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Save, Package } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const StockAddingForm = ({ onStockAdded }) => {
  // Replace sample arrays with state variables that will be filled from the API.
  const [allProducts, setAllProducts] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);

  // Existing states
  const [productSearch, setProductSearch] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [supplierSearchResults, setSupplierSearchResults] = useState([]);

  // Fetch products from API
  useEffect(() => {
    axios.get('http://localhost:5000/api/product-management/product')
      .then(response => {
        if (response.data && response.data.products) {
          setAllProducts(response.data.products);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Fetch suppliers from API
  useEffect(() => {
    axios.get('http://localhost:5000/api/product-management/supplier')
      .then(response => {
        if (response.data) {
          setAllSuppliers(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  }, []);

  console.log(allSuppliers);


  // Handle product search
  const handleProductSearch = (e) => {
    const query = e.target.value;
    setProductSearch(query);

    if (query.trim() === '') {
      setProductSearchResults([]);
      return;
    }

    const filteredProducts = allProducts
      .filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) &&
        !selectedProducts.some(p => p.id === product.id)
      );
    setProductSearchResults(filteredProducts);
  };

  // Add product to selection
  const addProduct = (product) => {
    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    setProductSearch('');
    setProductSearchResults([]);
  };

  // Remove product from selection
  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  // Update product quantity
  const updateQuantity = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map(product =>
        product.id === productId ? { ...product, quantity: parseInt(quantity) || 0 } : product
      )
    );
  };

  // Update buying price
  const updateBuyingPrice = (productId, price) => {
    setSelectedProducts(
      selectedProducts.map(product =>
        product.id === productId ? { ...product, buyPrice: parseFloat(price) || 0 } : product
      )
    );
  };

  // Update selling price
  const updateSellingPrice = (productId, price) => {
    setSelectedProducts(
      selectedProducts.map(product =>
        product.id === productId ? { ...product, sellPrice: parseFloat(price) || 0 } : product
      )
    );
  };

  // Select supplier
  const selectSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setSupplierSearch('');
    setSupplierSearchResults([]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0 || !selectedSupplier) return;

    // Build the payload as expected by the backend
    const payload = {
      supplierId: selectedSupplier._id || selectedSupplier.id,
      products: selectedProducts.map(product => ({
        id: product.id,
        quantity: product.quantity,
        price: product.buyPrice,
        manufactureDate: new Date().toISOString(), // using current date for manufactureDate
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // default expiration: one year later
        sellingPrice: product.sellPrice,
        textReview: "",
        customer: null
      }))
    };

    axios.post('http://localhost:5000/api/product-management/stock', payload)
      .then(response => {
        toast.success(response.data.message || "Stock created successfully", {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        // Optionally update the parent component with the new stock.
        if (response.data.stock) {
          onStockAdded(response.data.stock);
        }
        // Reset form
        setSelectedProducts([]);
        setSelectedSupplier(null);
        setProductSearch('');
        setSupplierSearch('');
        window.location.reload();
      })
      .catch(error => {
        toast.error(error.response?.data?.message || "Failed to create stock", {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      });
  };

  return (
    <div className="bg-white/95 rounded-lg shadow p-6 border border-amber-100 backdrop-blur-sm mb-8">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold text-amber-800 mb-2 flex items-center gap-2">
          <Package className="w-6 h-6" />
          Add New Stock
        </h2>
        <p className="text-amber-600">Add new products to your inventory</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Product Search Section */}
        <div className="mb-6">
          <label className="block text-amber-700 font-semibold mb-2">
            Search and Add Products
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-amber-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-amber-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Search for products..."
              value={productSearch}
              onChange={handleProductSearch}
            />
          </div>

          {/* Search Results Dropdown */}
          {productSearchResults.length > 0 && (
            <div className="mt-2 border border-amber-200 rounded-md shadow-sm bg-white max-h-60 overflow-auto">
              {productSearchResults.map(product => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-amber-50 cursor-pointer flex justify-between items-center"
                  onClick={() => addProduct(product)}
                >
                  <span className="text-amber-800">{product.name}</span>
                  <button
                    type="button"
                    className="p-1 text-amber-500 hover:text-amber-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      addProduct(product);
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Products Table */}
        {selectedProducts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-amber-700">Selected Products</h3>
            <div className="overflow-x-auto border border-amber-200 rounded-md">
              <table className="min-w-full divide-y divide-amber-200">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Buy Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Sell Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-200">
                  {selectedProducts.map(product => (
                    <tr key={product.id} className="hover:bg-amber-50">
                      <td className="px-6 py-4 whitespace-nowrap text-amber-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-1 text-amber-800">Rs.</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-24 border border-amber-300 rounded px-2 py-1 text-amber-800"
                            value={product.buyPrice}
                            onChange={(e) => updateBuyingPrice(product.id, e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-1 text-amber-800">Rs.</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-24 border border-amber-300 rounded px-2 py-1 text-amber-800"
                            value={product.sellPrice}
                            onChange={(e) => updateSellingPrice(product.id, e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          className="w-16 border border-amber-300 rounded px-2 py-1 text-amber-800"
                          value={product.quantity}
                          onChange={(e) => updateQuantity(product.id, e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeProduct(product.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Supplier Search Section */}
        <div className="mb-6">
          <label className="block text-amber-700 font-semibold mb-2">
            Select Supplier
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-amber-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-amber-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Search for suppliers..."
              value={supplierSearch}
              onChange={(e) => {
                const query = e.target.value;
                setSupplierSearch(query);

                if (query.trim() === '') {
                  setSupplierSearchResults([]);
                  return;
                }

                const filteredSuppliers = allSuppliers
                  .filter(supplier =>
                    supplier.name.toLowerCase().includes(query.toLowerCase())
                  );
                setSupplierSearchResults(filteredSuppliers);
              }}
            />
          </div>

          {/* Supplier Search Results */}
          {supplierSearchResults.length > 0 && (
            <div className="mt-2 border border-amber-200 rounded-md shadow-sm bg-white max-h-40 overflow-auto">
              {supplierSearchResults.map(supplier => (
                <div
                  key={supplier.id}
                  className="p-2 hover:bg-amber-50 cursor-pointer text-amber-800"
                  onClick={() => selectSupplier(supplier)}
                >
                  {supplier.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Supplier */}
        {selectedSupplier && (
          <div className="mb-6 p-4 border border-green-200 rounded-md bg-green-50">
            <h3 className="text-md font-semibold mb-1 text-green-800">Selected Supplier:</h3>
            <p className="text-green-700">{selectedSupplier.name}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
            disabled={selectedProducts.length === 0 || !selectedSupplier}
          >
            <Save className="mr-2 h-5 w-5" />
            Save Stock
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockAddingForm;
