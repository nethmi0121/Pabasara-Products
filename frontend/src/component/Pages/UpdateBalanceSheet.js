import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateBalanceSheet() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        incomeDate: '',
        incomeDesc: '',
        incomeAmount: '',
        expenseDate: '',
        expenseDesc: '',
        expenseAmount: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/api/balancesheet/${id}`)
            .then(res => {
                const entry = res.data;
                setForm({
                    incomeDate: entry.income?.date?.slice(0, 10) || '',
                    incomeDesc: entry.income?.description || '',
                    incomeAmount: entry.income?.amount || '',
                    expenseDate: entry.expense?.date?.slice(0, 10) || '',
                    expenseDesc: entry.expense?.description || '',
                    expenseAmount: entry.expense?.amount || ''
                });
            })
            .catch(err => console.error("Error fetching entry:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        // Check if the income or expense date is in the future
        if (form.incomeDate > today || form.expenseDate > today) {
            alert("Future dates are not allowed.");
            return;
        }

        const updatedData = {
            income: {
                date: form.incomeDate,
                description: form.incomeDesc,
                amount: parseFloat(form.incomeAmount)
            },
            expense: {
                date: form.expenseDate,
                description: form.expenseDesc,
                amount: parseFloat(form.expenseAmount)
            }
        };

        axios.put(`http://localhost:5000/api/balancesheet/${id}`, updatedData)
            .then(() => {
                navigate("/");
            })
            .catch(err => console.error("Error updating entry:", err));
    };

    return (
        <div className="update-form">
            <h2>Update Balance Sheet Entry</h2>
            <form onSubmit={handleSubmit}>
                <h3>Income</h3>
                <input type="date" name="incomeDate" value={form.incomeDate} onChange={handleChange} />
                <input type="text" name="incomeDesc" placeholder="Description" value={form.incomeDesc} onChange={handleChange} />
                <input type="number" name="incomeAmount" placeholder="Amount" value={form.incomeAmount} onChange={handleChange} />

                <h3>Expense</h3>
                <input type="date" name="expenseDate" value={form.expenseDate} onChange={handleChange} />
                <input type="text" name="expenseDesc" placeholder="Description" value={form.expenseDesc} onChange={handleChange} />
                <input type="number" name="expenseAmount" placeholder="Amount" value={form.expenseAmount} onChange={handleChange} />

                <button type="submit">Update Entry</button>
            </form>
        </div>
    );
}

export default UpdateBalanceSheet;
