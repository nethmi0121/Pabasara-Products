import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Truck, CandyCane, IceCream, Cake, Dessert, Loader, Search, X } from 'lucide-react';
import SupplierForm from '../../components/Supplier/SupplierForm';
import SupplierList from '../../components/Supplier/SupplierList';
import axios from 'axios';

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Function to fetch suppliers with optional search parameters
    const fetchSuppliers = async (searchParams = {}) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();

            if (searchParams.name) {
                params.append('name', searchParams.name);
            }

            const response = await axios.get(`/api/product-management/q/supplier?${params.toString()}`);

            // Map the backend data to match your supplier object structure
            const fetchedSuppliers = response.data.suppliers.map(supplier => ({
                id: supplier.id || supplier._id,
                name: supplier.name,
                phone: supplier.contact || supplier.contact?.phone,
                email: supplier.email || supplier.contact?.email,
                address: supplier.address
            }));

            setSuppliers(fetchedSuppliers);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        } finally {
            setIsLoading(false);
            setIsSearching(false);
        }
    };

    // Initial fetch of suppliers
    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Effect for real-time search when typing
    useEffect(() => {
        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set loading state if we have search criteria
        if (searchQuery.length > 0) {
            setIsSearching(true);
        }

        // Set a new timeout to debounce the search
        searchTimeoutRef.current = setTimeout(() => {
            fetchSuppliers({
                name: searchQuery
            });
        }, 500); // 500ms debounce time

        // Cleanup function to clear timeout if the component unmounts or searchQuery changes again
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const handleAddSupplier = (supplier) => {
        if (editingSupplier) {
            setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? supplier : s));
        } else {
            setSuppliers([...suppliers, { ...supplier, id: Date.now() }]);
        }
        setShowModal(false);
        setEditingSupplier(null);
    };

    const handleDeleteSupplier = (id) => {
        setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    };

    const openEditModal = (supplier) => {
        setEditingSupplier(supplier);
        setShowModal(true);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-[#f4f3f3] p-6 relative overflow-hidden">
            {/* Background Sweet Icons */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10">
                <CandyCane className="absolute top-20 left-10 w-32 h-32 text-amber-500" />
                <IceCream className="absolute bottom-40 left-1/4 w-36 h-36 text-amber-500" />
                <Cake className="absolute bottom-20 right-10 w-40 h-40 text-amber-500" />
                <Dessert className="absolute top-1/4 right-1/3 w-24 h-24 text-amber-500 transform rotate-12" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-2">
                        <Truck className="w-8 h-8" />
                        Supplier Management
                    </h1>
                    <p className="text-amber-600 mt-1">Our trusted partners in sweet success</p>
                </div>

                {/* Search Bar */}
                <motion.div
                    className="mb-6 bg-white p-4 rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-amber-500" />
                        </div>

                        <input
                            type="text"
                            placeholder="Search suppliers by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />

                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X className="h-5 w-5 text-amber-500 hover:text-amber-700" />
                            </button>
                        )}

                        {isSearching && (
                            <div className="absolute inset-y-0 right-10 flex items-center">
                                <motion.div
                                    className="h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        )}
                    </div>
                </motion.div>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                    >
                        <Plus size={18} className="mr-2" />
                        Add New Supplier
                    </button>
                </div>

                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center">
                        <Loader className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                        <p className="text-amber-700 font-medium">Loading supplier data...</p>
                    </div>
                ) : suppliers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center">
                        <Truck className="w-12 h-12 text-amber-300 mb-4" />
                        <p className="text-amber-700 font-medium mb-2">No suppliers found</p>
                        <p className="text-amber-500 text-center">Try adjusting your search or add a new supplier</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SupplierList
                            suppliers={suppliers}
                            onEdit={openEditModal}
                            onDelete={handleDeleteSupplier}
                        />
                    </motion.div>
                )}

                {/* Modal Popup without Background Animation */}
                {showModal && (
                    <div className="fixed inset-0 bg-[#00000095] flex items-center justify-center p-4 z-50 w-screen">
                        <motion.div className="w-full flex items-center justify-center">
                            <div className="bg-white rounded-xl shadow-lg w-3/4">
                                <SupplierForm
                                    supplier={editingSupplier}
                                    onSubmit={handleAddSupplier}
                                    onCancel={() => {
                                        setShowModal(false);
                                        setEditingSupplier(null);
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Supplier;