// mongo db password=sWVjXAS8xWM2GguR

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Route/manageroute.js");

const app = express();
const cors =require("cors") ;

// middleware
app.use(express.json());
app.use(cors());
app.use("/manager", router);

mongoose.connect(
  "mongodb+srv://admin:sWVjXAS8xWM2GguR@cluster0.1o6l8.mongodb.net/mydatabase?retryWrites=true&w=majority"
)
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log("Database connection error:", err));

