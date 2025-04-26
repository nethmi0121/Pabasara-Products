import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddEmployee() {
  const [imagePercent, setImagePercent] = useState(0);
  const fileRef1 = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(undefined);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser._id,
    emp_id: "",
    name: "",
    position: "",
    p_no: "",
    u_email: "",
    address: "",
    department: "",
    hireDate: "",
    salary: "",
    allowances: "",
    deductions: "",
    bankAccount: "",
    bankName: "",
    bankBranch: "",
    statues: "Active",
    payrollStatus: "Pending"
  });

  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      () => {
        setImageError(true);
        setError('Image upload failed');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
      }
    );
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.emp_id) errors.emp_id = "Employee ID is required";
    if (!formData.name) errors.name = "Name is required";
    if (!formData.position) errors.position = "Position is required";
    if (!formData.p_no.match(/^\d{10}$/)) errors.p_no = "Phone number must be 10 digits";
    if (!formData.u_email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) errors.u_email = "Invalid email format";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.hireDate) errors.hireDate = "Hire Date is required";
    if (!formData.salary || isNaN(formData.salary) || formData.salary <= 0) errors.salary = "Salary must be a valid number greater than 0";
    if (!formData.allowances || isNaN(formData.allowances) || formData.allowances < 0) errors.allowances = "Allowances must be a valid number";
    if (!formData.deductions || isNaN(formData.deductions) || formData.deductions < 0) errors.deductions = "Deductions must be a valid number";
    if (!formData.bankAccount || formData.bankAccount.length < 8) errors.bankAccount = "Bank Account number must be at least 8 digits";
    if (!formData.bankName) errors.bankName = "Bank Name is required";
    if (!formData.bankBranch) errors.bankBranch = "Bank Branch is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    try {
      const res = await fetch('/api/auth/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create employee');
      }
      Swal.fire({ icon: "success", title: "Success", text: "Employee added successfully!" });
      navigate('/employeeProfile');
    } catch (error) {
      setError('Something went wrong!');
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg w-full" style={{ maxWidth: '90rem' }}>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-lg w-full" style={{ maxWidth: '80rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Employee Details */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-600 mb-4 text-center">Employee Details</h2>

              <label className="block mb-2">Employee ID</label>
              <input type="text" name="emp_id" value={formData.emp_id} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.emp_id && <p className="text-red-500 text-sm">{formErrors.emp_id}</p>}

              <label className="block mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}

              <label className="block mb-2">Phone Number</label>
              <input type="text" name="p_no" value={formData.p_no} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.p_no && <p className="text-red-500 text-sm">{formErrors.p_no}</p>}

              <label className="block mb-2">Email</label>
              <input type="email" name="u_email" value={formData.u_email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.u_email && <p className="text-red-500 text-sm">{formErrors.u_email}</p>}

              <label className="block mb-2">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}

              <label className="block mb-2">Job Title</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.position && <p className="text-red-500 text-sm">{formErrors.position}</p>}

              <label className="block mb-2">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.department && <p className="text-red-500 text-sm">{formErrors.department}</p>}

              <label className="block mb-2">Hire Date</label>
              <input type="date" name="hireDate" value={formData.hireDate} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.hireDate && <p className="text-red-500 text-sm">{formErrors.hireDate}</p>}
            </div>

            {/* Payroll Details */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-600 mb-4 text-center">Payroll Details</h2>

              <label className="block mb-2">Basic Salary (LKR)</label>
              <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.salary && <p className="text-red-500 text-sm">{formErrors.salary}</p>}

              <label className="block mb-2">Bonus (LKR)</label>
              <input type="number" name="allowances" value={formData.allowances} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.allowances && <p className="text-red-500 text-sm">{formErrors.allowances}</p>}

              <label className="block mb-2">Deductions (LKR)</label>
              <input type="number" name="deductions" value={formData.deductions} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.deductions && <p className="text-red-500 text-sm">{formErrors.deductions}</p>}

              <label className="block mb-2">Bank Account Number</label>
              <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.bankAccount && <p className="text-red-500 text-sm">{formErrors.bankAccount}</p>}

              <label className="block mb-2">Bank Name</label>
              <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.bankName && <p className="text-red-500 text-sm">{formErrors.bankName}</p>}

              <label className="block mb-2">Bank Branch</label>
              <input type="text" name="bankBranch" value={formData.bankBranch} onChange={handleChange} className="w-full px-4 py-2 border rounded-md mb-4" />
              {formErrors.bankBranch && <p className="text-red-500 text-sm">{formErrors.bankBranch}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-26 py-2 rounded-md hover:bg-blue-700 transition"
              style={{ maxWidth: '20rem' }}
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
