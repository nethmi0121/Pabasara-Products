import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/NavBar.css"; // You can style it separately in this file

function Nav() {
    const navigate = useNavigate();

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
        <div className="navbar-container">
            <button className="navbar-btn" onClick={goToBalanceSheet}>
                Balance Sheet
            </button>
            <button className="navbar-btn" onClick={goToBankBook}>
                Bank Book
            </button>
            <button className="navbar-btn" onClick={goToPettyCash}>
                Petty Cash
            </button>
        </div>
    );
}

export default Nav;
