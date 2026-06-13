const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth")
const orderController = require("../contrllers/orderController")

router.post("/orders", authMiddleware,orderController.createOrder )
router.get("/orders", authMiddleware, orderController.getOrder)

module.exports = router