import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/UpdateTransaction.css";

function UpdateTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState({
        income_source: "",
        total_income: "",
        expense_type: "",
        total_expenses: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/Transactions/${id}`)
            .then(res => setTransaction(res.data))
            .catch(err => console.error("Error fetching transaction:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if ((name === "total_income" || name === "total_expenses") && (!/^\d*\.?\d*$/.test(value) || value < 0)) {
            return; 
        }
        
        setTransaction({ ...transaction, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/Transactions/${id}`, transaction);
            navigate("/"); 
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    return (
        <div className="update-page">
            <div className="update-container">
                <h2>Update Transaction</h2>
                <form className="update-form" onSubmit={handleSubmit}>
                    <input type="text" name="income_source" placeholder="Income Source" value={transaction.income_source} onChange={handleChange} required />
                    <input type="text" name="total_income" placeholder="Income $" value={transaction.total_income} onChange={handleChange} required />
                    <input type="text" name="expense_type" placeholder="Expense Type" value={transaction.expense_type} onChange={handleChange} required />
                    <input type="text" name="total_expenses" placeholder="Expense $" value={transaction.total_expenses} onChange={handleChange} required />
                    <button className="update-button" type="submit">Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateTransaction;
