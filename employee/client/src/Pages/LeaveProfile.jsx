import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useReactToPrint } from 'react-to-print';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LeaveProfile() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [leaves, setLeaves] = useState([]);
  const [leaveIdToDelete, setLeaveIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);
  const componentPDF = useRef();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await fetch(`/api/leave/leave_user/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leave details');
      }
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  const handleDeleteLeave = async () => {
    try {
      const res = await fetch(`/api/user/Leave_delete/${leaveIdToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== leaveIdToDelete));
      }
      setShowModal(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Employee Leave Report',
    onBeforeGetContent: () => {
      setIsGeneratingPDF(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
      alert('Leave report saved as PDF');
    }
  });

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center fw-bold text-primary mb-4">Employee Leave Details</h2>

        {/* PDF Report Section */}
        <div ref={componentPDF} className="p-4 border rounded bg-white">
          <h3 className="text-center text-dark fw-bold">Employee Leave Report</h3>
          <p className="text-center text-muted">Generated on: {new Date().toLocaleDateString()}</p>
          <hr />
          {leaves.length > 0 ? (
            <Table hoverable className="table table-bordered table-hover shadow-sm">
              <thead className="bg-dark text-white">
                <tr>
                  <th>Employee ID</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  {!isGeneratingPDF && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map(leave => (
                  <tr key={leave._id}>
                    <td>{leave.emp_id}</td>
                    <td>{leave.l_type}</td>
                    <td>{new Date(leave.s_date).toLocaleDateString()}</td>
                    <td>{new Date(leave.e_date).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    {!isGeneratingPDF && (
                      <td>
                        <Button className="btn btn-outline-danger btn-sm" onClick={() => {
                          setShowModal(true);
                          setLeaveIdToDelete(leave._id);
                        }}>
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted">No leave records found!</p>
          )}
        </div>

        {/* Generate Report Button */}
        <div className="text-center mt-4">
          <button className="btn btn-success px-4 py-2 fw-bold" onClick={generatePDF} disabled={isGeneratingPDF}>
            {isGeneratingPDF ? 'Generating PDF...' : 'Download Leave Report'}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-danger" />
            <h3 className="mb-5 text-lg font-normal text-dark">
              Are you sure you want to delete this leave record?
            </h3>
            <div className="d-flex justify-content-center gap-3">
              <Button className="btn btn-danger px-3 py-2 fw-bold" onClick={handleDeleteLeave}>
                Yes, I am sure
              </Button>
              <Button className="btn btn-secondary px-3 py-2" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}