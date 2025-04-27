import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/BalanceSheet.css";
import logo from '../assests/logo.png';
import Nav from "../Nav/Nav"; 

function BalanceSheet() {
    const [entries, setEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [form, setForm] = useState({
        incomeDate: '',
        incomeDesc: '',
        incomeAmount: '',
        expenseDate: '',
        expenseDesc: '',
        expenseAmount: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = () => {
        axios.get("http://localhost:5000/api/balancesheet")
            .then(res => setEntries(res.data))
            .catch(err => console.error("Error fetching balance sheet:", err));
    };

    const deleteEntry = (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            axios.delete(`http://localhost:5000/api/balancesheet/${id}`)
                .then(() => fetchEntries())
                .catch(err => console.error("Error deleting entry:", err));
        }
    };

    const handleDownloadFullSheet = () => {
        const doc = new jsPDF();
    
        // Add border
        doc.setLineWidth(0.5);
        doc.rect(5, 5, 200, 287);
    
        const img = new Image();
        img.src = logo;
        img.onload = function () {
            doc.addImage(img, 'PNG', 10, 8, 30, 20);
    
            // Set title
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 128, 0); // GREEN color for title (RGB for green)
            doc.text("PabsaraProducts", 105, 20, { align: "center" });
    
            // Prepare table data
            const tableData = entries.map(entry => ([
                entry.income?.date?.slice(0, 10) || "-",
                entry.income?.description || "-",
                entry.income?.amount || "-",
                entry.income?.total || "-",
                entry.expense?.date?.slice(0, 10) || "-",
                entry.expense?.description || "-",
                entry.expense?.amount || "-",
                entry.expense?.total || "-"
            ]));
    
            // Create the table
            autoTable(doc, {
                startY: 35,
                head: [[
                    "Income Date", "Income Desc", "Income Amount", "Income Total",
                    "Expense Date", "Expense Desc", "Expense Amount", "Expense Total"
                ]],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [0, 102, 204], // BLUE color for header (nice light blue)
                    textColor: [255, 255, 255], // white text on blue
                    halign: 'center',
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    halign: 'center',
                },
                styles: {
                    font: "helvetica",
                    fontSize: 10
                }
            });
    
            doc.save("Full_BalanceSheet.pdf");
        };
    };
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validateDate = (dateString) => {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const incomeFields = [form.incomeDate, form.incomeDesc, form.incomeAmount];
        const expenseFields = [form.expenseDate, form.expenseDesc, form.expenseAmount];

        const isIncomePartiallyFilled = incomeFields.some(field => field !== '');
        const isIncomeFullyFilled = incomeFields.every(field => field !== '');
        const isExpensePartiallyFilled = expenseFields.some(field => field !== '');
        const isExpenseFullyFilled = expenseFields.every(field => field !== '');

        if (isIncomePartiallyFilled && !isIncomeFullyFilled) {
            alert("Please complete all Income fields.");
            return;
        }
        if (isExpensePartiallyFilled && !isExpenseFullyFilled) {
            alert("Please complete all Expense fields.");
            return;
        }
        if (!isIncomePartiallyFilled && !isExpensePartiallyFilled) {
            alert("Please fill at least the Income or Expense section completely.");
            return;
        }

        if (form.incomeDate && !validateDate(form.incomeDate)) {
            alert("Income date cannot be in the future.");
            return;
        }
        if (form.expenseDate && !validateDate(form.expenseDate)) {
            alert("Expense date cannot be in the future.");
            return;
        }

        const newEntry = {
            income: isIncomeFullyFilled ? {
                date: form.incomeDate,
                description: form.incomeDesc,
                amount: parseFloat(form.incomeAmount) || 0
            } : null,
            expense: isExpenseFullyFilled ? {
                date: form.expenseDate,
                description: form.expenseDesc,
                amount: parseFloat(form.expenseAmount) || 0
            } : null
        };

        axios.post("http://localhost:5000/api/balancesheet", newEntry)
            .then(() => {
                fetchEntries();
                setForm({
                    incomeDate: '',
                    incomeDesc: '',
                    incomeAmount: '',
                    expenseDate: '',
                    expenseDesc: '',
                    expenseAmount: ''
                });
            })
            .catch(err => console.error("Error adding entry:", err));
    };

    const sendWhatsAppMessage = (entry) => {
        const phoneNumber = "+94714640582"; 
        const incomeMsg = entry.income
            ? `Income: ${entry.income.description} - ₹${entry.income.amount} on ${entry.income.date.slice(0, 10)}`
            : "";
        const expenseMsg = entry.expense
            ? `Expense: ${entry.expense.description} - ₹${entry.expense.amount} on ${entry.expense.date.slice(0, 10)}`
            : "";
        const message = `${incomeMsg}\n${expenseMsg}`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const filteredEntries = entries.filter(entry =>
        (entry.income?.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (entry.expense?.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="balancesheet-container">
            <h1 className="balancesheet-header">Balance Sheet</h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="🔎 Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Add New Entry Form */}
            <form onSubmit={handleSubmit} className="add-entry-form">
                <h3>Add New Entry</h3>

                <div className="form-group">
                    <h4>Income</h4>
                    <input type="date" name="incomeDate" value={form.incomeDate} onChange={handleChange} max={new Date().toISOString().split("T")[0]} />
                    <input type="text" name="incomeDesc" placeholder="Description" value={form.incomeDesc} onChange={handleChange} />
                    <input type="number" name="incomeAmount" placeholder="Amount" value={form.incomeAmount} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <h4>Expense</h4>
                    <input type="date" name="expenseDate" value={form.expenseDate} onChange={handleChange} max={new Date().toISOString().split("T")[0]} />
                    <input type="text" name="expenseDesc" placeholder="Description" value={form.expenseDesc} onChange={handleChange} />
                    <input type="number" name="expenseAmount" placeholder="Amount" value={form.expenseAmount} onChange={handleChange} />
                </div>

                <button type="submit">➕ Add Entry</button>
            </form>

            {/* Download Button */}
            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <button onClick={handleDownloadFullSheet} className="download-button">
                    📄 Download Balance Sheet PDF
                </button>
            </div>

            {/* Entries Table */}
            <table className="balancesheet-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEntries.map((entry) => (
                        <tr key={entry._id}>
                            <td>{entry.income?.date?.slice(0, 10) || "-"}</td>
                            <td>{entry.income?.description || "-"}</td>
                            <td>{entry.income?.amount || "-"}</td>
                            <td>{entry.income?.total || "-"}</td>
                            <td>{entry.expense?.date?.slice(0, 10) || "-"}</td>
                            <td>{entry.expense?.description || "-"}</td>
                            <td>{entry.expense?.amount || "-"}</td>
                            <td>{entry.expense?.total || "-"}</td>
                            <td>
                                <button className="edit-button" onClick={() => navigate(`/update-balance/${entry._id}`)}>✏️ Edit</button>
                                <button className="delete-button" onClick={() => deleteEntry(entry._id)}>🗑️ Delete</button>
                                <button className="whatsapp-button" onClick={() => sendWhatsAppMessage(entry)}>📱 WhatsApp</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BalanceSheet;
