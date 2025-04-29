import Transaction from '../models/TransactionsModel.js';

// @desc    Create a new transaction
export const createTransaction = async (req, res) => {
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

// @desc    Get all transactions
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get a single transaction by ID
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update a transaction
export const updateTransaction = async (req, res) => {
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

// @desc    Delete a transaction
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
