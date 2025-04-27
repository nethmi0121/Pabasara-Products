import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Search, CandyCane, IceCream, Cake, Dessert, Candy, FilterX, Tag } from 'lucide-react';
import axios from 'axios';
import ProductForm from '../../components/Product/ProductForm';
import ProductList from '../../components/Product/ProductList';
import EditProductForm from '../../components/Product/EditProductForm';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Initial fetch of products
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch all categories for filters
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product-management/category');
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch products with or without search parameters
  const fetchProducts = async (searchParams = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchParams.name) {
        params.append('name', searchParams.name);
      }

      if (searchParams.categories && searchParams.categories.length > 0) {
        searchParams.categories.forEach(category => {
          params.append('categories', category);
        });
      }

      const response = await axios.get(`http://localhost:5000/api/product-management/q/product?${params.toString()}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  // Effect for real-time search when typing
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set loading state if we have search criteria
    if (searchQuery.length > 0 || selectedCategories.length > 0) {
      setIsSearching(true);
    }

    // Set a new timeout to debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts({
        name: searchQuery,
        categories: selectedCategories
      });
    }, 500); // 500ms debounce time

    // Cleanup function to clear timeout if the component unmounts or searchQuery changes again
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedCategories]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    // No need to manually call fetchProducts as the useEffect will handle it
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    // No need to manually call fetchProducts as the useEffect will handle it
  };

  const addProduct = (newProduct) => {
    // Append new product locally and let the API refresh be handled elsewhere if needed
    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setShowAddModal(false);
  };

  const deleteProduct = (id) => {
    // Optionally, you can add an API call here to delete on backend.
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleEditSubmit = (updatedProduct) => {
    setProducts(
      products.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
    );
    setShowEditModal(false);
  };

  useEffect(() => {
    if (showAddModal || showEditModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAddModal, showEditModal]);

  return (
    <div className="min-h-screen p-6 bg-[#f4f3f3] relative overflow-hidden">
      {/* Optimized visible background icons */}
      <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
        <CandyCane className="absolute top-[10%] left-[5%] w-28 h-28 text-amber-400/50" />
        <IceCream className="absolute bottom-[25%] left-[15%] w-32 h-32 text-amber-400/50" />
        <Cake className="absolute bottom-[10%] right-[5%] w-36 h-36 text-amber-400/50" />
        <Dessert className="absolute top-[20%] right-[20%] w-24 h-24 text-amber-400/50" />
        <Candy className="absolute top-[35%] right-[15%] w-28 h-28 text-amber-400/50" />
        <CandyCane className="absolute bottom-[30%] left-[25%] w-20 h-20 text-amber-400/50 transform -rotate-12" />
        <IceCream className="absolute top-[15%] right-[10%] w-24 h-24 text-amber-400/50" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-2">
            <Candy className="w-8 h-8" />
            Inventory Items
          </h1>
          <p className="text-amber-600 mt-1">Efficiently track and manage your products</p>
        </div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-md mb-6 border border-amber-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-amber-700 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Products
          </h2>

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              {isSearching && (
                <motion.div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full" />
                </motion.div>
              )}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Filter by category:
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category._id || category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCategory(category.name)}
                    className={`px-3 py-1 text-sm rounded-full transition-all ${selectedCategories.includes(category.name)
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {(searchQuery || selectedCategories.length > 0) && (
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1"
              >
                <FilterX className="w-4 h-4" />
                Clear all filters
              </motion.button>
            </div>
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/95 p-6 rounded-lg shadow-md border border-amber-100 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold text-amber-700 mb-4">Product List</h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                className="h-20 w-20 rounded-full border-t-4 border-amber-500"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.p
                className="mt-4 text-amber-600 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Loading sweet treats...
              </motion.p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <Dessert className="w-16 h-16 mx-auto text-amber-300 mb-4" />
              <h3 className="text-lg font-medium text-amber-700 mb-2">No products found</h3>
              <p className="text-amber-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <ProductList
              products={products}
              onDelete={deleteProduct}
              onEdit={handleEdit}
            />
          )}
        </motion.div>
      </div>

      {/* Modal for adding product */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              className="relative bg-white p-8 rounded-lg shadow-xl w-3/4 h-3/4 overflow-y-auto"
              initial={{ y: -100, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 100, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: 0.1,
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-amber-700">Add New Product</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-amber-100 transition-colors"
                >
                  <X className="w-6 h-6 text-amber-500" />
                </button>
              </div>

              {/* Product Form */}
              <ProductForm onSubmit={addProduct} onCancel={() => setShowAddModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for editing product */}
      <AnimatePresence>
        {showEditModal && editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              className="relative bg-white p-8 rounded-lg shadow-xl w-3/4 h-3/4 overflow-y-scroll"
              initial={{ y: -100, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 100, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: 0.1,
              }}
            >
              {/* Edit Product Form */}
              <EditProductForm
                product={editingProduct}
                onSubmit={handleEditSubmit}
                onClose={() => setShowEditModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Product;