import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Addpay.css';

const ADD_PAYMENT_URL = "http://localhost:3000/payments/create";

function Addpay({ onPaymentAdded }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('Successful');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [userId, setUserId] = useState(''); 
  const [cardHolderName, setCardHolderName] = useState('');  // New state for card holder name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState('creditCard'); 

  const navigate = useNavigate();

  useEffect(() => {
    const generatedUserId = `user_${Math.floor(Math.random() * 1000000)}`; 
    setUserId(generatedUserId);
  }, []); 

  // Validate card number
  const validateCardNumber = (number) => {
    return number.length === 16 && /^[0-9]+$/.test(number); 
  };

  const validateExpiryDate = (expiry) => {
    const formatRegex = /^([0-9]{2})\/([0-9]{2})$/;
    if (!formatRegex.test(expiry)) {
      return { valid: false, message: "Expiry date must be in MM/YY format." };
    }
    const [inputMonth, inputYear] = expiry.split('/').map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (inputMonth < 1 || inputMonth > 12) {
      return { valid: false, message: "Invalid month in expiry date." };
    }
    if (inputYear > currentYear || (inputYear === currentYear && inputMonth >= currentMonth)) {
      return { valid: true };
    } else {
      return { valid: false, message: "Expiry date must be in the future." };
    }
  };

  const validateCVV = (cvv) => {
    return cvv.length === 3 && /^[0-9]+$/.test(cvv);
  };

  const validateAmount = (amount) => {
    return amount > 0;
  };

  // Validate the cardholder name (optional validation)
  const validateCardHolderName = (name) => {
    return name.length > 0;  // Check if the name is not empty
  };

  const validateForm = () => {
    const errors = {};
    if (!validateCardNumber(cardNumber)) errors.cardNumber = 'Card number must be 16 digits.';
    if (!validateExpiryDate(cardExpiry)) errors.cardExpiry = 'Expiry date must be in MM/YY format.';
    if (!validateCVV(cardCVV)) errors.cardCVV = 'CVV must be a 3-digit number.';
    if (!validateAmount(amount)) errors.amount = 'Amount must be greater than 0.';
    if (!currency) errors.currency = 'Currency is required.';
    if (!paymentIntentId) errors.paymentIntentId = 'Payment Intent ID is required.';
    if (!validateCardHolderName(cardHolderName)) errors.cardHolderName = 'Cardholder name is required.';  // Add validation for cardholder name

    setFormErrors(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the form errors.');
      return;
    }

    const paymentData = {
      userId, 
      cardDetails: { cardNumber, cardExpiry, cardCVV, cardHolderName },  // Include card holder name
      amount,
      currency,
      status,
      paymentIntentId,
      paymentMethod, 
    };

    try {
      setLoading(true);
      const response = await axios.post(ADD_PAYMENT_URL, paymentData);

      if (response.data.success) {
        onPaymentAdded(response.data);
        setSuccessMessage('Payment added successfully!');
        setIsModalOpen(true);
        setCardNumber('');
        setCardExpiry('');
        setCardCVV('');
        setAmount('');
        setPaymentIntentId('');
        setCardHolderName('');  // Reset card holder name
        setPaymentMethod('creditCard'); 
        setError(null);
        setFormErrors({});

        setTimeout(() => setSuccessMessage(''), 3000);

        navigate("/mainpaymentdetails");
      } else {
        setError(response.data.message || 'Failed to add payment.');
      }
    } catch (err) {
      setError('Failed to add payment: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };

  return (
    <div className="payment-form-container">
      <h1>Add Payment Details</h1>
      <form onSubmit={handleAddPayment} className="payment-form">
        <table className="payment-form-table">
          <tbody>
            <tr>
              <td><label htmlFor="paymentMethod">Payment Method</label></td>
              <td>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="creditCard">Credit Card</option>
                  <option value="debitCard">Debit Card</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="cardHolderName">Cardholder Name</label></td>
              <td>
                <input
                  type="text"
                  id="cardHolderName"
                  placeholder="Cardholder Name"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  required
                />
                {formErrors.cardHolderName && <p className="error-text">{formErrors.cardHolderName}</p>}
              </td>
            </tr>
            <tr>
              <td><label htmlFor="cardNumber">Card Number</label></td>
              <td>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
                {formErrors.cardNumber && <p className="error-text">{formErrors.cardNumber}</p>}
              </td>
            </tr>
            <tr>
              <td><label htmlFor="cardExpiry">Expiry Date (MM/YY)</label></td>
              <td>
                <input
                  type="text"
                  id="cardExpiry"
                  placeholder="Expiry Date (MM/YY)"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  required
                />
                {formErrors.cardExpiry && <p className="error-text">{formErrors.cardExpiry}</p>}
              </td>
            </tr>
            <tr>
              <td><label htmlFor="cardCVV">CVV</label></td>
              <td>
                <input
                  type="text"
                  id="cardCVV"
                  placeholder="CVV"
                  value={cardCVV}
                  onChange={(e) => setCardCVV(e.target.value)}
                  required
                />
                {formErrors.cardCVV && <p className="error-text">{formErrors.cardCVV}</p>}
              </td>
            </tr>
            <tr>
              <td><label htmlFor="amount">Amount</label></td>
              <td>
                <input
                  type="number"
                  id="amount"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                {formErrors.amount && <p className="error-text">{formErrors.amount}</p>}
              </td>
            </tr>
            <tr>
              <td><label htmlFor="currency">Currency</label></td>
              <td>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
                {formErrors.currency && <p className="error-text">{formErrors.currency}</p>}
              </td>
            </tr>
            <tr>
              <td><label htmlFor="paymentIntentId">Payment Intent ID</label></td>
              <td>
                <input
                  type="text"
                  id="paymentIntentId"
                  value={paymentIntentId}
                  onChange={(e) => setPaymentIntentId(e.target.value)}
                  required
                />
                {formErrors.paymentIntentId && <p className="error-text">{formErrors.paymentIntentId}</p>}
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" disabled={loading}>Add Payment</button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Payment Added Successfully!</h2>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Addpay;
