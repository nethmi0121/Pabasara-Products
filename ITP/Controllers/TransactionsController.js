const Transaction = require('../Model/TransactionsModel');
const { Parser } = require("json2csv");
const axios = require("axios");

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { income_source, total_income, expense_type, total_expenses, phoneNumber } = req.body;

        const newTransaction = new Transaction({
            income_source,
            total_income,
            expense_type,
            total_expenses,
            profit: total_income - total_expenses
        });

        const savedTransaction = await newTransaction.save();

        if (phoneNumber) {
            await axios.post("http://localhost:5000/Transactions/send-whatsapp", {
                phoneNumber,
                message: `New Transaction Added:\nIncome Source: ${income_source}\nTotal Income: $${total_income}\nExpense Type: ${expense_type}\nTotal Expenses: $${total_expenses}\nProfit: $${total_income - total_expenses}`
            });
        }

        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { ...req.body, profit: req.body.total_income - req.body.total_expenses },
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) return res.status(404).json({ message: "Transaction not found" });
        res.status(200).json({ message: "Transaction updated", data: updatedTransaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search transactions
exports.searchTransactions = async (req, res) => {
    try {
        const { search } = req.query;
        const query = search ? {
            $or: [
                { income_source: { $regex: search, $options: "i" } },
                { expense_type: { $regex: search, $options: "i" } }
            ]
        } : {};

        const transactions = await Transaction.find(query);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generate CSV Report
exports.generateReport = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        const fields = ["date", "income_source", "total_income", "expense_type", "total_expenses", "profit"];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(transactions);

        res.header("Content-Type", "text/csv");
        res.attachment("transactions_report.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send WhatsApp Message
exports.sendWhatsAppMessage = async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        if (!phoneNumber || !message) {
            return res.status(400).json({ error: "Phone number and message are required" });
        }

        // Replace with actual WhatsApp API integration
        const response = await axios.post("https://your-whatsapp-api.com/send", {
            to: phoneNumber,
            body: message
        });

        res.status(200).json({ message: "WhatsApp message sent successfully", data: response.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};