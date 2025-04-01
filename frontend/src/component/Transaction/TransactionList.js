import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";  
import autoTable from "jspdf-autotable"; 

function TransactionList({ transactions, setTransactions }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get("http://localhost:5000/Transactions");
                setTransactions(response.data);
                setFilteredTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchTransactions();
    }, [setTransactions]);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredTransactions(transactions);
        } else {
            setFilteredTransactions(
                transactions.filter(
                    (transaction) =>
                        transaction.income_source.toLowerCase().includes(search.toLowerCase()) ||
                        transaction.expense_type.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, transactions]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/Transactions/${id}`);
            const response = await axios.get("http://localhost:5000/Transactions");
            setTransactions(response.data);
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    const handleDownloadPDF = (transaction) => {
        const doc = new jsPDF();
        doc.text("Transaction Details", 14, 20);
    
        autoTable(doc, {  // <-- Use autoTable correctly
            startY: 30,
            head: [["Field", "Value"]],
            body: [
                ["Date", new Date(transaction.date).toLocaleDateString()],
                ["Income Source", transaction.income_source],
                ["Total Income (LKR)", `₨ ${transaction.total_income.toLocaleString()}`], // Changed currency to LKR
                ["Expense Type", transaction.expense_type],
                ["Total Expenses (LKR)", `₨ ${transaction.total_expenses.toLocaleString()}`], // Changed currency to LKR
                ["Profit (LKR)", `₨ ${transaction.profit.toLocaleString()}`], // Changed currency to LKR
            ],
        });
    
        doc.save(`Transaction_${transaction._id}.pdf`);
    };
    

    return (
        <div className="dashboard-card">
            <h2>Transaction List</h2>

            <div className="search-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by Income Source or Expense Type"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Income Source</th>
                        <th>Total Income (LKR)</th> {/* Changed currency to LKR */}
                        <th>Expense Type</th>
                        <th>Total Expenses (LKR)</th> {/* Changed currency to LKR */}
                        <th>Profit (LKR)</th> {/* Changed currency to LKR */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td>{transaction.income_source}</td>
                            <td>₨ {transaction.total_income.toLocaleString()}</td> {/* Changed currency to LKR */}
                            <td>{transaction.expense_type}</td>
                            <td>₨ {transaction.total_expenses.toLocaleString()}</td> {/* Changed currency to LKR */}
                            <td>₨ {transaction.profit.toLocaleString()}</td> {/* Changed currency to LKR */}
                            <td>
                                <button className="update-button" onClick={() => navigate(`/update/${transaction._id}`)}>Update</button>
                                <button className="delete-button" onClick={() => handleDelete(transaction._id)}>Delete</button>
                                <button className="download-button" onClick={() => handleDownloadPDF(transaction)}>Download</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionList;
