import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Added new state for confirmation popup
const SupplierList = ({ suppliers, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  // Added new function to handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/api/product-management/supplier', {
        data: { id: supplierToDelete.id }
      });
      toast.success(response.data.message || "Supplier deleted successfully", {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onDelete(supplierToDelete._id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete supplier";
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
    setShowConfirm(false);
    setSupplierToDelete(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-amber-800 mb-6">Supplier List</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {suppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{supplier.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{supplier.email}</td>
                  <td className="px-6 py-4 text-sm text-amber-900">{supplier.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(supplier)}
                      className="text-amber-600 hover:text-amber-900 mr-4"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSupplierToDelete(supplier);
                        setShowConfirm(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Added Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-[#0000005b] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this supplier?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSupplierToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
