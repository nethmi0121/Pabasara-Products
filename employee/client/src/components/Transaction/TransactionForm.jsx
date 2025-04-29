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
        const { name, value } = e.target;

        if (name === "total_income" || name === "total_expenses") {
            // Allow only numbers and a single decimal point
            if (/^\d*\.?\d*$/.test(value) || value === "") {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(formData.total_income) < 0 || parseFloat(formData.total_expenses) < 0) {
            alert("Total Income and Total Expenses cannot be negative.");
            return;
        }

        try {
            await axios.post("http://localhost:3000/Transactions", formData);

            const updatedTransactions = await axios.get("http://localhost:3000/Transactions");
            setTransactions(updatedTransactions.data);

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
                    type="text"
                    name="total_income"
                    placeholder="Total Income"
                    value={formData.total_income}
                    onChange={handleChange}
                    required
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
                    type="text"
                    name="total_expenses"
                    placeholder="Total Expenses"
                    value={formData.total_expenses}
                    onChange={handleChange}
                    required
                />
                <button className="button" type="submit">Add Transaction</button>
            </form>
        </div>
    );
}

export default TransactionForm;