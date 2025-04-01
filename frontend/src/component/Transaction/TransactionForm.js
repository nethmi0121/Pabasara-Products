import React, { useState } from "react";
import axios from "axios";

function TransactionForm({ setTransactions }) {
    const [formData, setFormData] = useState({
        income_source: "",
        total_income: "",
        expense_type: "",
        total_expenses: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate Total Income and Total Expenses to ensure they're not negative
        if (parseFloat(formData.total_income) < 0 || parseFloat(formData.total_expenses) < 0) {
            alert("Total Income and Total Expenses cannot be negative.");
            return;
        }

        try {
            // Send the POST request to add the transaction
            await axios.post("http://localhost:5000/Transactions", formData);

            // Fetch the updated transactions list and update state
            const updatedTransactions = await axios.get("http://localhost:5000/Transactions");
            setTransactions(updatedTransactions.data);

            // Reset form fields
            setFormData({
                income_source: "",
                total_income: "",
                expense_type: "",
                total_expenses: "",
            });

        } catch (err) {
            console.error("Error submitting transaction:", err);
        }
    };

    return (
        <div className="dashboard-card">
            <h2>Add Transaction</h2>
            <form className="transaction-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="income_source"
                    placeholder="Income Source"
                    value={formData.income_source}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="total_income"
                    placeholder="Total Income"
                    value={formData.total_income}
                    onChange={handleChange}
                    required
                    min="0"  // Prevent negative values
                />
                <input
                    type="text"
                    name="expense_type"
                    placeholder="Expense Type"
                    value={formData.expense_type}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="total_expenses"
                    placeholder="Total Expenses"
                    value={formData.total_expenses}
                    onChange={handleChange}
                    required
                    min="0"  // Prevent negative values
                />
                <button className="button" type="submit">Add Transaction</button>
            </form>
        </div>
    );
}

export default TransactionForm;
