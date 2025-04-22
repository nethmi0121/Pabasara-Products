const Transaction = require('../Model/TransactionsModel');

//Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { income_source, total_income, expense_type, total_expenses } = req.body;

        const newTransaction = new Transaction({ 
            income_source, 
            total_income, 
            expense_type, 
            total_expenses 
        });

        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully", data: newTransaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Update a transaction
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

//Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
