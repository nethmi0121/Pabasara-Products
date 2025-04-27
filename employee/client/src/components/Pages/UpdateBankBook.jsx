import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/BankBook.css";

function UpdateBankBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        date: '',
        description: '',
        deposit: '',
        withdrawal: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/api/bankbook/${id}`)
            .then((res) => {
                const { date, description, deposit, withdrawal } = res.data;
                setForm({ date, description, deposit, withdrawal });
            })
            .catch((err) => console.error("Error fetching bank book entry:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate the date field to ensure no future dates are selected
        if (name === "date") {
            const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
            if (value > today) {
                alert("Future dates are not allowed.");
                return;
            }
        }

        setForm((prevForm) => ({ ...prevForm, [name]: value }));

        // Mutual exclusive fields
        if (name === "deposit" && value) {
            setForm((prevForm) => ({ ...prevForm, withdrawal: '' }));
        } else if (name === "withdrawal" && value) {
            setForm((prevForm) => ({ ...prevForm, deposit: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.deposit && !form.withdrawal) {
            alert("Please enter either a deposit or a withdrawal.");
            return;
        }

        // Ensure the date is not a future date before submitting
        const today = new Date().toISOString().split("T")[0];
        if (form.date > today) {
            alert("Future dates are not allowed.");
            return;
        }

        axios.put(`http://localhost:5000/api/bankbook/${id}`, form)
            .then(() => {
                navigate("/bankbook");
            })
            .catch((err) => console.error("Error updating bank book entry:", err));
    };

    return (
        <div className="update-bankbook-container">
            <h1 className="update-bankbook-header">Update Bank Book Entry</h1>
            <form className="update-bankbook-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date ? form.date.slice(0, 10) : ""}
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
                <button type="submit" className="update-button">Update Entry</button>
            </form>
        </div>
    );
}

export default UpdateBankBook;