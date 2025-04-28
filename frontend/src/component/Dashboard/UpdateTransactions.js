import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Dashboard.css";
import TransactionForm from "../Transaction/TransactionForm";
import TransactionList from "../Transaction/TransactionList";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/Transactions")
            .then(res => {
                setTransactions(res.data);
            })
            .catch(err => console.error("Error fetching transactions:", err));
    }, []);

    const goToBalanceSheet = () => {
        navigate("/balancesheet");
    };

    const goToBankBook = () => {
        navigate("/bankbook");
    };

    const goToPettyCash = () => {
        navigate("/pettycash");
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-wrapper">
                <h1 className="dashboard-header">Financial Dashboard</h1>
                <div className="dashboard-buttons">
                    <button className="btn-to-balancesheet" onClick={goToBalanceSheet}>
                        Balance Sheet
                    </button>
                    <button className="btn-to-bankbook" onClick={goToBankBook}>
                        Bank Book
                    </button>
                    <button className="btn-to-pettycash" onClick={goToPettyCash}>
                        Petty Cash
                    </button>
                </div>
            </div>

            <TransactionForm setTransactions={setTransactions} />
            <TransactionList transactions={transactions} setTransactions={setTransactions} />
        </div>
    );
}

export default Dashboard;
