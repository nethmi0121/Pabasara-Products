import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./component/Dashboard/Dashboard";
import UpdateTransaction from "./component/Dashboard/UpdateTransactions"; // Import UpdateTransaction page

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/update/:id" element={<UpdateTransaction />} /> {/* Add route for updating */}
            </Routes>
        </div>
    );
}

export default App;
