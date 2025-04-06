// cartRoute.js
const express = require("express");
const router = express.Router();
const cartController = require("../Controlers/cartcontroller");

router.post("/add", cartController.addToCart);
router.get("/get/:id", cartController.getCart);
router.post("/remove/:id", cartController.removeFromCart);
router.post("/update/:id", cartController.updateQuantity);
router.post("/clear/:id", cartController.clearCart);

module.exports = router;