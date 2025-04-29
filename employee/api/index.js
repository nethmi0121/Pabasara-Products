import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/admin.routes.js';
import transactionsRoutes from './routes/TransactionsRoutes.js';
import balanceSheetRoutes from './routes/BalanceSheetRoutes.js';
import bankBookRoutes from './routes/BankBookRoutes.js';
import pettyCashRoutes from './routes/PettyCashRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import productManagementRoutes from './routes/productManagementRoutes/ProductManagementRoutes.js';
import stripe from 'stripe';

dotenv.config();

// Initialize Stripe with the secret key
const Stripe = stripe(process.env.STRIPE_SECRET_KEY);
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/Transactions', transactionsRoutes);
app.use('/api/balancesheet', balanceSheetRoutes);
app.use('/api/bankbook', bankBookRoutes);
app.use('/api/pettycash', pettyCashRoutes);
app.use('/api/product-management', productManagementRoutes);

// Serve static files for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, './src/uploads')));


app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  }));


// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

// Start the server
const startServer = () => {
    app.listen(3000, () => {
        console.log('Server listening on port 3000!');
    });
};

// Call startServer to start the server when the module is run directly
startServer();

// Export the app and startServer function for use in other modules
export { app, startServer };