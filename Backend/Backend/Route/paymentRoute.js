const express = require("express");
const router = express.Router();

//insert user controller
const PaymentController = require("../Controlers/paymentController");


router.post("/create",PaymentController.createPaymentIntent);
router.post("/confirm",PaymentController.confirmPayment);
router.get("/get-all",PaymentController.getAllPayment);
router.put("/update-status", PaymentController.updatePaymentStatus);
router.delete("/delete/:id", PaymentController.deletePayment);


//export
module.exports = router;

