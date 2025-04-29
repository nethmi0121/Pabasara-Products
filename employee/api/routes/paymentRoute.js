import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getAllPayment,
  updatePaymentStatus,
  deletePayment
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createPaymentIntent);
router.post("/confirm", confirmPayment);
router.get("/get-all", getAllPayment);
router.put("/update-status", updatePaymentStatus);
router.delete("/delete/:id", deletePayment);

export default router;
