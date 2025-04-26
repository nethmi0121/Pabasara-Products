import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/PettyCash.css";

function PettyCash() {
    const [entries, setEntries] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // NEW: Search Query
    const navigate = useNavigate();

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = () => {
        axios.get("http://localhost:5000/api/pettycash")
            .then((res) => setEntries(res.data))
            .catch((err) => console.error("Error fetching petty cash entries:", err));
    };

    const deleteEntry = (id) => {
        if (window.confirm("Are you sure you want to delete this petty cash entry?")) {
            axios.delete(`http://localhost:5000/api/pettycash/${id}`)
                .then(() => fetchEntries())
                .catch((err) => console.error("Error deleting petty cash entry:", err));
        }
    };

    const generateSinglePDF = (entry) => {
        const doc = new jsPDF();
    
        doc.setFontSize(20);
        doc.setTextColor(0, 128, 0); // Green color
        doc.text("Pabasara Products", 20, 20);
    
        doc.setDrawColor(0); // Black color for the border
        doc.setLineWidth(0.5); // Border thickness
        doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20); // Draw rectangle
    
        // Table Content
        autoTable(doc, {
            startY: 40, 
            head: [["Field", "Value"]],
            body: [
                ["Receipt No", entry.receiptNumber || "-"],
                ["Date", entry.date ? entry.date.slice(0, 10) : "-"],
                ["Details", entry.details || "-"],
                ["VN Number", entry.vnNumber || "-"],
                ["Expenses", entry.expenses || "-"],
            ],
            theme: "grid",
            headStyles: {
                fillColor: [0, 0, 255], 
                textColor: [255, 255, 255], 
                fontSize: 12,
            },
            bodyStyles: {
                fontSize: 10, 
            },
        });
    
        doc.save(`pettycash_entry_${entry._id}.pdf`);
    };
    

    const sendSingleWhatsAppMessage = (entry) => {
        const phoneNumber = "+94714640582"; // Replace your number
        const message = encodeURIComponent(
            `Petty Cash Entry Details:\n\nReceipt No: ${entry.receiptNumber || "-"}\nDate: ${entry.date ? entry.date.slice(0, 10) : "-"}\nDetails: ${entry.details || "-"}\nVN Number: ${entry.vnNumber || "-"}\nExpenses: ${entry.expenses || "-"}`
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    const calculateTotalExpenses = () => {
        return entries.reduce((sum, entry) => sum + (Number(entry.expenses) || 0), 0).toFixed(2);
    };

    // Filtered entries based on search
    const filteredEntries = entries.filter((entry) =>
        entry.details?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pettycash-container">
            <h1>Petty Cash</h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by details..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="button-container">
                <button className="add-button" onClick={() => navigate("/add-pettycash-entry")}>Add New Entry</button>
            </div>

            <table className="pettycash-table">
                <thead>
                    <tr>
                        <th>Receipt No</th>
                        <th>Date</th>
                        <th>Details</th>
                        <th>VN Number</th>
                        <th>Expenses</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEntries.length > 0 ? (
                        filteredEntries.map((entry) => (
                            <tr key={entry._id}>
                                <td>{entry.receiptNumber || "-"}</td>
                                <td>{entry.date ? entry.date.slice(0, 10) : "-"}</td>
                                <td>{entry.details || "-"}</td>
                                <td>{entry.vnNumber || "-"}</td>
                                <td>{entry.expenses || "-"}</td>
                                <td className="action-buttons">
                                    <button className="edit-button" onClick={() => navigate(`/update-pettycash/${entry._id}`)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteEntry(entry._id)}>Delete</button>
                                    <button className="download-entry-button" onClick={() => generateSinglePDF(entry)}>Download PDF</button>
                                    <button className="whatsapp-entry-button" onClick={() => sendSingleWhatsAppMessage(entry)}>Send WhatsApp</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>No entries found.</td>
                        </tr>
                    )}
                    {filteredEntries.length > 0 && (
                        <tr className="total-row">
                            <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Total:</td>
                            <td style={{ fontWeight: "bold" }}>{filteredEntries.reduce((sum, entry) => sum + (Number(entry.expenses) || 0), 0).toFixed(2)}</td>
                            <td></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PettyCash;
