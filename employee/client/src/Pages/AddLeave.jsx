import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddLeave() {
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
    l_type: "",
    s_date: "",
    e_date: "",
    reason: "",
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
      (error) => {
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
    let today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    if (!formData.emp_id.trim()) {
      errors.emp_id = "Employee ID is required";
    }

    if (!formData.l_type.trim()) {
      errors.l_type = "Leave type is required";
    }

    if (!formData.s_date) {
      errors.s_date = "Start date is required";
    } else if (formData.s_date < today) {
      errors.s_date = "Start date must be in the future";
    }

    if (!formData.e_date) {
      errors.e_date = "End date is required";
    } else if (formData.e_date <= formData.s_date) {
      errors.e_date = "End date must be after start date";
    }

    if (!formData.reason.trim()) {
      errors.reason = "Reason is required";
    } else if (formData.reason.length < 10) {
      errors.reason = "Reason must be at least 10 characters long";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    try {
      const res = await fetch('/api/leave/leave_store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create leave request');
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Leave request added successfully!",
      });

      navigate('/employeeProfile');
    } catch (error) {
      setError('Something went wrong!');
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Add Leave</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Employee ID</label>
            <input
              type="text"
              className={`form-control ${formErrors.emp_id && 'is-invalid'}`}
              value={formData.emp_id}
              onChange={(e) => setFormData({ ...formData, emp_id: e.target.value })}
            />
            {formErrors.emp_id && <div className="invalid-feedback">{formErrors.emp_id}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Leave Type</label>
            <input
              type="text"
              className={`form-control ${formErrors.l_type && 'is-invalid'}`}
              value={formData.l_type}
              onChange={(e) => setFormData({ ...formData, l_type: e.target.value })}
            />
            {formErrors.l_type && <div className="invalid-feedback">{formErrors.l_type}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className={`form-control ${formErrors.s_date && 'is-invalid'}`}
              value={formData.s_date}
              onChange={(e) => setFormData({ ...formData, s_date: e.target.value })}
            />
            {formErrors.s_date && <div className="invalid-feedback">{formErrors.s_date}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className={`form-control ${formErrors.e_date && 'is-invalid'}`}
              value={formData.e_date}
              onChange={(e) => setFormData({ ...formData, e_date: e.target.value })}
            />
            {formErrors.e_date && <div className="invalid-feedback">{formErrors.e_date}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Reason</label>
            <input
              type="text"
              className={`form-control ${formErrors.reason && 'is-invalid'}`}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
            {formErrors.reason && <div className="invalid-feedback">{formErrors.reason}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
