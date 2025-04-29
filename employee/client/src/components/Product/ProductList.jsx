import { useState } from 'react';
import { Edit, Trash2, IceCream, Cake, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductList = ({ products, setProducts, onEdit, fetchProducts }) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const initiateDelete = (product) => {
        setProductToDelete(product);
        setIsConfirmingDelete(true);
    };

    const cancelDelete = () => {
        setIsConfirmingDelete(false);
        setProductToDelete(null);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await axios.delete(`/api/product-management/product`, {
                data: { id: productToDelete.id }
            });

            // Remove the product from the local state
            const updatedProducts = products.filter(product => product.id !== productToDelete.id);

            // If setProducts is provided, use it to update the parent component's state
            if (setProducts) {
                setProducts(updatedProducts);
            }
            // Otherwise, if fetchProducts is provided, use it to refresh the data
            else if (fetchProducts) {
                fetchProducts();
            }

            toast.success('Product deleted successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error(`Failed to delete product: ${error.response?.data?.message || 'Unknown error'}`, {
                position: 'top-right',
                autoClose: 3000,
            });
            console.error('Delete error:', error);
        } finally {
            setIsConfirmingDelete(false);
            setProductToDelete(null);
        }
    };

    return (
        <div className="relative">
            <ToastContainer />

            {/* Delete Confirmation Dialog */}
            {isConfirmingDelete && productToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full animate-fade-in transform transition-all duration-300 ease-in-out">
                        <div className="bg-orange-50 p-5 flex items-center border-b border-orange-100">
                            <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
                            <h3 className="text-lg font-semibold text-orange-800">Confirm Deletion</h3>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete <span className="font-semibold text-orange-700">{productToDelete.name}</span>?
                                This action cannot be undone.
                            </p>

                            <div className="flex items-center justify-between mt-6">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="overflow-x-auto">
                {products.length === 0 ? (
                    <div className="text-center py-8 bg-orange-50 rounded-lg">
                        <IceCream className="mx-auto h-12 w-12 text-orange-300" />
                        <p className="mt-2 text-orange-600">No products added yet.</p>
                        <p className="text-orange-400 text-sm">Add your first sweet product!</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-orange-200">
                        <thead className="bg-orange-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-orange-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-orange-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {product.images && product.images.length > 0 ? (
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img
                                                    className="h-10 w-10 rounded-full object-cover border border-orange-200"
                                                    src={`http://localhost:3000/uploads/${product.images[0]}`}
                                                    alt={product.name}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-orange-100 rounded-full border border-orange-200">
                                                <Cake className="w-5 h-5 text-orange-400" />
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-orange-900">
                                                {product.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                                    {product.categories && product.categories.length > 0
                                        ? product.categories.join(', ')
                                        : 'No category'}
                                </td>
                                <td className="px-6 py-4 text-sm text-orange-500 max-w-xs truncate">
                                    {product.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="text-orange-600 hover:text-orange-900 mr-4"
                                        aria-label="Edit product"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => initiateDelete(product)}
                                        className="text-red-600 hover:text-red-900"
                                        aria-label="Delete product"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProductList;