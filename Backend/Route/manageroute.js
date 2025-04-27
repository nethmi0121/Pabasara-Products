const express = require ("express");
const router = express.Router();
// insert Model
const manager = require("../model/managermodel.js");
// insert manager contraller 
const managerController = require ("../controllers/managercontroller.js");

router.get("/", managerController.getAllmanager);
router.post("/", managerController.addproduct);
router.get("/:id", managerController.getById);
router.put("/:id", managerController.updateproduct);
router.delete("/:id", managerController.deleteproducts);


//exports
module.exports = router;



