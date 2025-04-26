import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import autoTable from 'jspdf-autotable';
import "../css/BankBook.css"; // Make sure CSS exists

function BankBook() {
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = () => {
        axios.get("http://localhost:5000/api/bankbook")
            .then((res) => setEntries(res.data))
            .catch((err) => console.error("Error fetching bank book entries:", err));
    };

    const deleteEntry = (id) => {
        if (window.confirm("Are you sure you want to delete this bank book entry?")) {
            axios.delete(`http://localhost:5000/api/bankbook/${id}`)
                .then(() => fetchEntries())
                .catch((err) => console.error("Error deleting bank book entry:", err));
        }
    };

    // Generate PDF for a single entry
    const generateSinglePDF = (entry) => {
        const doc = new jsPDF();
        doc.text("Bank Book Entry", 20, 20);
        autoTable(doc, {
            startY: 30,
            head: [["Field", "Value"]],
            body: [
                ["Date", entry.date ? entry.date.slice(0, 10) : "-"],
                ["Description", entry.description || "-"],
                ["Deposit", entry.deposit || "-"],
                ["Withdrawal", entry.withdrawal || "-"],
                ["Balance", entry.balance || "-"],
            ],
            theme: "grid",
        });
        doc.save(`bankbook_entry_${entry._id}.pdf`);
    };
    

    // Send WhatsApp message for a single entry
    const sendSingleWhatsAppMessage = (entry) => {
        const phoneNumber = "+94714640582"; // Replace with your number
        const message = encodeURIComponent(
            `Bank Book Entry Details:\n\nDate: ${entry.date ? entry.date.slice(0, 10) : "-"}\nDescription: ${entry.description || "-"}\nDeposit: ${entry.deposit || "-"}\nWithdrawal: ${entry.withdrawal || "-"}\nBalance: ${entry.balance || "-"}`
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    return (
        <div className="bankbook-container">
            <h1>Bank Book</h1>
            <div className="button-container">
                <button className="add-button" onClick={() => navigate("/add-bank-entry")}>Add New Entry</button>
            </div>
            <table className="bankbook-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Deposit</th>
                        <th>Withdrawal</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.length > 0 ? (
                        entries.map((entry) => (
                            <tr key={entry._id}>
                                <td>{entry.date ? entry.date.slice(0, 10) : "-"}</td>
                                <td>{entry.description || "-"}</td>
                                <td>{entry.deposit || "-"}</td>
                                <td>{entry.withdrawal || "-"}</td>
                                <td>{entry.balance || "-"}</td>
                                <td className="action-buttons">
                                    <button
                                        className="edit-button"
                                        onClick={() => navigate(`/update-bankbook/${entry._id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => deleteEntry(entry._id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="download-entry-button"
                                        onClick={() => generateSinglePDF(entry)}
                                    >
                                        Download PDF
                                    </button>
                                    <button
                                        className="whatsapp-entry-button"
                                        onClick={() => sendSingleWhatsAppMessage(entry)}
                                    >
                                        Send WhatsApp
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>No entries found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default BankBook;
