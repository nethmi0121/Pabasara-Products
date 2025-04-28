import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Cart from "./Components/Cart/Cart";
import Addpay from "./Components/AddPayment/Addpay";
import Payments from "./Components/PaymentDetails/Payments";
import ProductDetails from "./Components/productDetails/productDetails";
import Home from "./Components/home/home";

function App() {
  const onPaymentAdded = (paymentData) => {
    console.log('Payment added:', paymentData);
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maincart" element={<Cart />} />
        <Route path="/mainpayment" element={<Addpay onPaymentAdded={onPaymentAdded} />} />
        <Route path="/mainpaymentdetails" element={<Payments />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

export default App;