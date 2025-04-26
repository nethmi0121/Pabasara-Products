import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AddBankBook.css";

function AddBankBook() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        date: '',
        description: '',
        deposit: '',
        withdrawal: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "deposit") {
            setForm((prevForm) => ({ ...prevForm, deposit: value, withdrawal: '' }));
        } else if (name === "withdrawal") {
            setForm((prevForm) => ({ ...prevForm, withdrawal: value, deposit: '' }));
        } else {
            setForm((prevForm) => ({ ...prevForm, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        // Check if the selected date is a future date
        if (form.date > today) {
            alert("Future dates are not allowed.");
            return;
        }

        if (!form.deposit && !form.withdrawal) {
            alert("Please enter either a deposit or a withdrawal.");
            return;
        }

        axios.post("http://localhost:5000/api/bankbook", form)
            .then(() => {
                navigate("/bankbook");
            })
            .catch((err) => console.error("Error adding bank book entry:", err));
    };

    return (
        <div className="add-bankbook-container">
            <h1 className="add-bankbook-header">Add Bank Book Entry</h1>
            <form className="add-bankbook-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Deposit:</label>
                    <input
                        type="number"
                        name="deposit"
                        placeholder="Deposit"
                        value={form.deposit}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Withdrawal:</label>
                    <input
                        type="number"
                        name="withdrawal"
                        placeholder="Withdrawal"
                        value={form.withdrawal}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="add-button">Add Entry</button>
            </form>
        </div>
    );
}

export default AddBankBook;
