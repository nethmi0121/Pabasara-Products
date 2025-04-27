import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/UpdatePettyCash.css"; // You can copy and modify UpdateBankBook.css

function UpdatePettyCash() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        receiptNumber: "",
        date: "",
        details: "",
        vnNumber: "",
        expenses: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/api/pettycash/${id}`)
            .then(res => setFormData(res.data))
            .catch(err => console.error("Error fetching petty cash entry:", err));
    }, [id]);

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
        axios.put(`http://localhost:5000/api/pettycash/${id}`, formData)
            .then(() => navigate("/pettycash"))
            .catch(err => console.error("Error updating petty cash entry:", err));
    };

    return (
        <div className="update-pettycash-container">
            <h2>Update Petty Cash Entry</h2>
            <form onSubmit={handleSubmit} className="update-pettycash-form">
                <input type="text" name="receiptNumber" placeholder="Receipt No" value={formData.receiptNumber} onChange={handleChange} required />
                <input type="date" name="date" value={formData.date ? formData.date.slice(0, 10) : ""} onChange={handleChange} required />
                <input type="text" name="details" placeholder="Details" value={formData.details} onChange={handleChange} required />
                <input type="text" name="vnNumber" placeholder="VN Number" value={formData.vnNumber} onChange={handleChange} />
                <input type="number" name="expenses" placeholder="Expenses" value={formData.expenses} onChange={handleChange} required />
                <button type="submit">Update Entry</button>
            </form>
        </div>
    );
}

export default UpdatePettyCash;