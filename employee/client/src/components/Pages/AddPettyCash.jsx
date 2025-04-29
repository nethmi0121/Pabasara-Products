import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AddPettyCash.css"; // Create/Add this css too!

function AddPettyCash() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        receiptNumber: "",
        date: "",
        details: "",
        vnNumber: "",
        expenses: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Restrict receiptNumber and vnNumber to integers
        if ((name === "receiptNumber" || name === "vnNumber") && !/^\d*$/.test(value)) {
            return; // Prevent non-numeric input
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        // Check if the selected date is a future date
        if (formData.date > today) {
            alert("Future dates are not allowed.");
            return;
        }

        axios.post("/api/pettycash", formData)
            .then(() => navigate("/pettycash"))
            .catch(err => console.error("Error adding petty cash entry:", err));
    };

    return (
        <div className="add-pettycash-container">
            <h2>Add New Petty Cash Entry</h2>
            <form onSubmit={handleSubmit} className="add-pettycash-form">
                <input type="text" name="receiptNumber" placeholder="Receipt No" value={formData.receiptNumber} onChange={handleChange} required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="text" name="details" placeholder="Details" value={formData.details} onChange={handleChange} required />
                <input type="text" name="vnNumber" placeholder="VN Number" value={formData.vnNumber} onChange={handleChange} />
                <input type="number" name="expenses" placeholder="Expenses" value={formData.expenses} onChange={handleChange} required />
                <button type="submit">Add Entry</button>
            </form>
        </div>
    );
}

export default AddPettyCash;