import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import Cart from "./Components/Cart/Cart";
import Addpay from "./Components/AddPayment/Addpay";
import Payments from "./Components/PaymentDetails/Payments";



function App() {
    // Define the onPaymentAdded function
    const onPaymentAdded = (paymentData) => {
        console.log('Payment added:', paymentData);
        // You can perform actions like updating state or redirecting here
    };

    return (
        <div>
            <React.Fragment>
                <Routes>
                    <Route path="/" element={<Navigate to="/maincart" />} />
                    <Route path="/maincart" element={<Cart />} />
                    <Route path="/mainpayment" element={<Addpay onPaymentAdded={onPaymentAdded} />} />
                    <Route path="/mainpaymentdetails" element={<Payments />} />
                   
                </Routes>
            </React.Fragment>
        </div>
    );
}

export default App;
