import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js'
import authroutes from './routes/auth.routes.js'
import LeaveRoutes from './routes/leave.routes.js'

import cookieParser from 'cookie-parser';

import adminroutes from './routes/admin.routes.js'
import transactionsRoutes from "./routes/TransactionsRoutes.js";
import balanceSheetRoutes from "./routes/BalanceSheetRoutes.js";
import bankBookRoutes from "./routes/BankBookRoutes.js";
import pettyCashRoutes from "./routes/PettyCashRoutes.js";
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to Mongodb')
}).catch((err)=>{
    console.log(err)
})

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('server listen on port 3000!')
});


app.use("/api/user",userRoutes)
app.use("/api/auth",authroutes)
app.use("/api/admin",adminroutes)
app.use("/api/leave",LeaveRoutes)
app.use('/Transactions', transactionsRoutes);
app.use('/api/balancesheet', balanceSheetRoutes);
app.use('/api/bankbook', bankBookRoutes);
app.use('/api/pettycash', pettyCashRoutes);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'internal server error'
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
})