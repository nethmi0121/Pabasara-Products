import React, { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import './Payments.css';

const URL = "http://localhost:3000/payments/get-all";
const DELETE_URL = "http://localhost:3000/payments/delete";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    console.log("API Response:", response.data);
    return response.data.list || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchHandler();
      setPayments(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPayments = payments.filter(payment =>
    payment.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.paymentIntentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.amount.toString().includes(searchQuery) ||
    new Date(payment.createdAt).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const logoImg = new Image();
    logoImg.src = `${process.env.PUBLIC_URL}/Logo.jpg`; 

    logoImg.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      
       doc.setDrawColor(0);
       doc.setLineWidth(0.8);
       doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 5, 5);
 

    
     doc.addImage(logoImg, 'JPG', 12, 12, 30, 30);  

     doc.setFontSize(24);
     doc.setFont("helvetica", "bold");
     doc.setTextColor(15, 167, 134);
     doc.text("Pabasara Products", pageWidth / 2, 25, { align: 'center' });
     
     doc.setFontSize(18);
     doc.setTextColor(0, 0, 0);  // Default black color for Payment Report
     doc.text("Payment Report", pageWidth / 2, 45, { align: 'center' });
     

      const columns = ["User ID", "Amount", "Currency", "Status", "Payment ID", "Date"];
      const rows = filteredPayments.map(payment => [
        payment.userId,
        payment.amount,
        payment.currency,
        payment.status,
        payment.paymentIntentId,
        new Date(payment.createdAt).toLocaleString()
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 55,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 123, 255],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 10
        }
      });

      
      const dateStr = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${dateStr}`, 14, pageHeight - 10);
      doc.text(`Page 1`, pageWidth - 30, pageHeight - 10);

      doc.save("Pay_Report.pdf");
    };
  };

  const handleDelete = async (paymentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this payment?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${DELETE_URL}/${paymentId}`);
      if (response.data.success) {
        alert('Payment deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete payment: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert('Error deleting payment: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="payments-container">
        <Nav />
        <h1>Payment Details Display Page</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payments-container">
        <Nav />
        <h1>Payment Details Display Page</h1>
        <p>Error: {error.message || "An error occurred fetching payment details."}</p>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <Nav />
      <h1>This Is Your Payment Details</h1>

      {/* Search Bar & Generate Report Button */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by any field..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={generatePDF} className="generate-report-btn">
          Generate PDF Report
        </button>
      </div>

      {/* Payment List */}
      <div className="payment-list">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment, index) => (
            <div key={payment._id || index} className="payment-card">
              <h2>User ID: {payment.userId}</h2>
              <h2>Amount: {payment.amount}</h2>
              <h2>Currency: {payment.currency}</h2>
              <h2>Status: {payment.status}</h2>
              <h2>Payment Intent ID: {payment.paymentIntentId}</h2>
              <h2>Created At: {new Date(payment.createdAt).toLocaleString()}</h2>
              <button
                onClick={() => handleDelete(payment._id)}
                className="delete-btn"
              >
                Delete
              </button>
              <br />
            </div>
          ))
        ) : (
          <p className="no-data">No payment details available.</p>
        )}
      </div>
    </div>
  );
}

export default Payments;
