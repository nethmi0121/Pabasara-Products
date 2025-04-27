import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SupplierForm = ({ supplier, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    supplier
      ? { ...supplier, phoneNumber: supplier.phoneNumber || supplier.phone }
      : {
        name: '',
        phoneNumber: '',
        email: '',
        address: ''
      }
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // New state to keep the form open after submission
  const [keepOpen] = useState(true);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!/^[A-Za-z\s]+$/.test(value)) error = 'Only letters and spaces are allowed';
        break;
      case 'phoneNumber':
        if (!/^\d{0,10}$/.test(value)) error = 'Phone number must be 10 digits, starting with 0';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'address':
        if (value.trim() === '') error = 'Address is required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Input validation while typing
    if (name === 'name' && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === 'phoneNumber' && !/^\d{0,10}$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    // Additional validation for required fields
    if (!formData.name) validationErrors.name = 'Name is required';
    if (!formData.phoneNumber) validationErrors.phoneNumber = 'Phone number is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.address) validationErrors.address = 'Address is required';

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      try {
        let response;
        if (supplier) {
          // Update supplier using axios.put (include supplier id)
          response = await axios.put('http://localhost:5000/api/product-management/supplier', {
            ...formData,
            id: supplier._id || supplier.id
          });
          toast.success('Supplier updated successfully!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          // Add supplier using axios.post
          response = await axios.post('http://localhost:5000/api/product-management/supplier', formData);
          toast.success('Supplier added successfully!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        // Only call onSubmit if keepOpen is false.
        if (!keepOpen) {
          onSubmit(response.data.supplier);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to add supplier';
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
        });
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="p-6 w-full">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-amber-800 mb-6">
        {supplier ? 'Edit Supplier' : 'Add New Supplier'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              required
              placeholder="Eg: 0712345678"
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300"
              maxLength="10"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-amber-600 text-white rounded-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-700'}`}
          >
            {isSubmitting ? 'Submitting...' : supplier ? 'Update' : 'Add Supplier'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierForm;
