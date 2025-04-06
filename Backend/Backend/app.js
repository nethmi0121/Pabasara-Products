const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const router = require("./Route/cartRoute");
const paymentRoutes = require("./Route/paymentRoute");

const app = express(); 
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(express.json());
app.use(cors());
app.use("/cart",router);
app.use("/payments", paymentRoutes);


// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:0DHkmWShIpvcTEhX@cluster0.7ff19.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(3000);
})
.catch((err) => console.error((err)));

