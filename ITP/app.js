const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const transactionRoutes = require('./Routes/TransactionsRoutes');
const balanceSheetRoutes = require('./Routes/BalanceSheetRoutes');
const bankBookRoutes = require('./Routes/BankBookRoutes');
const pettyCashRoutes = require('./Routes/PettyCashRoutes'); // <-- NEW Import

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use('/Transactions', transactionRoutes);
app.use('/api/balancesheet', balanceSheetRoutes);
app.use('/api/bankbook', bankBookRoutes);
app.use('/api/pettycash', pettyCashRoutes); // <-- NEW Route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
