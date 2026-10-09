import express from "express"
import { createOrder } from "../controllers/billing.controller.js"

const router = express().router()

router.post("/create", createOrder)
router.post("/verify", verifyPayment)

export default router