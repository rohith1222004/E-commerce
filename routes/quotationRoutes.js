const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/quotationController");

router.post("/generate",invoiceController.generateInvoicePDF);

module.exports = router;

