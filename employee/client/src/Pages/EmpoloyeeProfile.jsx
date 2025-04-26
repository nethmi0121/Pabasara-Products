import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/emp.css'
export default function EmployeeProfile() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);
  const componentPDF = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/auth/user/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`/api/user/user_delete/${orderIdToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderIdToDelete));
      }
      setShowModal(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Employee List Report',
    onBeforeGetContent: async () => {
      setIsGeneratingPDF(true);
      await fetchOrders(); // Ensure latest data before generating the report
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
      alert('Employee List Report has been saved as PDF.');
    }
  });

  return (
    <div className="container mt-5">
    <h2 className="text-center fw-bold text-primary mb-4">Employee Details</h2>
  
    {/* Report Content */}
    <div ref={componentPDF} className="p-4 border rounded shadow bg-white">
      <h3 className="text-center fw-bold text-dark mb-2">Employee Payroll Report</h3>
      <p className="text-center text-secondary mb-4">Generated on: {new Date().toLocaleDateString()}</p>
  
      {orders.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 border border-2 border-primary rounded bg-light shadow-sm payroll-slip">
              <div className="text-center mb-3">
                <h5 className="fw-bold text-uppercase text-dark">Payslip for {order.name}</h5>
                <p className="text-muted mb-1">Employee ID: <strong>{order.emp_id}</strong></p>
                <p className="text-muted">Position: <strong>{order.position}</strong></p>
              </div>
  
              <hr className="my-3" />
  
              <div className="row mb-2">
                <div className="col-md-6"><strong>Phone:</strong> {order.p_no}</div>
                <div className="col-md-6"><strong>Address:</strong> {order.address}</div>
              </div>
  
              <div className="row mb-3">
                <div className="col-md-6"><strong>Status:</strong> {order.statues}</div>
                <div className="col-md-6"><strong>Generated:</strong> {new Date().toLocaleDateString()}</div>
              </div>
  
              <div className="bg-white p-3 rounded border mb-3">
                <h6 className="fw-bold text-decoration-underline mb-2">Earnings & Deductions</h6>
                <div className="row mb-2">
                  <div className="col-md-4"><strong>Basic Salary:</strong> Rs. {order.salary}</div>
                  <div className="col-md-4"><strong>Allowances:</strong> Rs. {order.allowances}</div>
                  <div className="col-md-4"><strong>Deductions:</strong> Rs. {order.deductions}</div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <strong>Net Pay:</strong>{' '}
                    <span className="text-success fw-bold">
                      Rs. {Number(order.salary) + Number(order.allowances) - Number(order.deductions)}
                    </span>
                  </div>
                </div>
              </div>
  
              <div className="bg-white p-3 rounded border">
                <h6 className="fw-bold text-decoration-underline mb-2">Bank Details</h6>
                <div className="row">
                  <div className="col-md-4"><strong>Account Number:</strong> {order.bankAccount}</div>
                  <div className="col-md-4"><strong>Bank Name:</strong> {order.bankName}</div>
                  <div className="col-md-4"><strong>Branch:</strong> {order.bankBranch}</div>
                </div>
              </div>
  
              {!isGeneratingPDF && (
                <div className="mt-4 d-flex justify-content-end gap-2">
                  <Link to={`/update-item/${order._id}`} className="btn btn-outline-success btn-sm px-3">
                    Edit
                  </Link>
                  <Button className="btn btn-outline-danger btn-sm px-3" onClick={() => {
                    setShowModal(true);
                    setOrderIdToDelete(order._id);
                  }}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">No employees found!</p>
      )}
    </div>
  
    {/* Generate Report Button */}
    <div className="text-center mt-4">
      <button className="btn btn-primary px-4 py-2" onClick={generatePDF} disabled={isGeneratingPDF}>
        {isGeneratingPDF ? 'Generating PDF...' : 'Generate Report'}
      </button>
    </div>
  
    {/* Delete Confirmation Modal */}
    <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
          <h3 className="mb-5 text-lg font-normal text-gray-500">
            Are you sure you want to delete this employee?
          </h3>
          <div className="d-flex justify-content-center gap-3">
            <Button className="btn btn-danger" onClick={handleDeleteOrder}>
              Yes, I am sure
            </Button>
            <Button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>
  
  );
}