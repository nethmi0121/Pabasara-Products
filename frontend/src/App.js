import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './component/Dashboard/Dashboard';
import UpdateTransaction from './component/Dashboard/UpdateTransactions';
import BalanceSheet from './component/Pages/BalanceSheet';
import UpdateBalanceSheet from './component/Pages/UpdateBalanceSheet';
import BankBook from './component/Pages/BankBook'; 
import AddBankBook from "./component/Pages/AddBankBook"; 
import UpdateBankBook from './component/Pages/UpdateBankBook';
import PettyCash from './component/Pages/PettyCash';
import UpdatePettyCash from './component/Pages/UpdatePettyCash';
import AddPettyCash from './component/Pages/AddPettyCash';
import Nav from './component/Nav/Nav';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/update-transaction/:id" element={<UpdateTransaction />} />
                <Route path="/balancesheet" element={<BalanceSheet />} />
                <Route path="/update-balance/:id" element={<UpdateBalanceSheet />} />
                <Route path="/bankbook" element={<BankBook />} />
                <Route path="/update-bankbook/:id" element={<UpdateBankBook />} />
                <Route path="/add-bank-entry" element={<AddBankBook />} />
                
                {/* New Routes */}
                <Route path="/pettycash" element={<PettyCash />} />
                <Route path="/update-pettycash/:id" element={<UpdatePettyCash />} />
                <Route path="/add-pettycash-entry" element={<AddPettyCash />} />
            </Routes>     
        </div>
    );
}

export default App; // <-- ADD THIS LINE!!
