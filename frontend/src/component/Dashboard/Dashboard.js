import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Dashboard.css";  
import TransactionForm from "../Transaction/TransactionForm";
import TransactionList from "../Transaction/TransactionList";

function Dashboard() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/Transactions")
            .then(res => {
                setTransactions(res.data);
            })
            .catch(err => console.error("Error fetching transactions:", err));
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Financial Dashboard</h1>

            <TransactionForm setTransactions={setTransactions} />

            <TransactionList transactions={transactions} setTransactions={setTransactions} />
        </div>
    );
}

export default Dashboard;