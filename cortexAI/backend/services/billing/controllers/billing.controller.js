import razorpay from "../config/razorpay";

export const crateOrder = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]
        const { plan } = req.body.plan
        const selectedPlan = PLANS[plan]

        if (!selectedPlan) {
            return res.status(400).json({ message: "invalid plan" })
        }

        // Razorpay 
        const order = await razorpay.orders.create({
            amount: selectedPlan.price * 100, // razorpay 100 is 1 rupee
            currency: "INR",
            payment_capture: 1,
            receipt: `receipt-${Date.now()}`
        })

        //payment
        await payment.create({
            userId,
            orderId: order.id,
            amount: selectedPlan.amount,
            credits: selectedPlan.credits,
            plan: selectedPlan.id,
            currency: order.currency,
            status: "CREATED",
            paymentProvider: "RAZORPAY"
        })

        //response
        return res.status(201).json({
            success: true,
            message: "order created successfully",
            orderId: order.id,
            plan: selectedPlan
        })

    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error });
    }
};
// verifyPayment 
export const verifyPayment = async () => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body
        const generateSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`.toString()).digest("hex")

        if (generateSignature !== razorpaySignature) {
            return res.status(400).json({ message: "Payment varification failed" })
        }

        const payment = await PaymentAddress.findOne({
            orderId: razorpayOrderId,
        })
        if (!payment) {
            return res.status(400).json({ message: "Payment not found" })
        }

        payment.status = "PAID"
        payment.paymentId = razorpayPaymentId
        await payment.save()

        //use the axios to fetch the api data
        await axios.post(`${process.env.AUTH_SERVICE}/update-plan`, {
            userId: payment.userId,
            plan: payment.plan,
            credits: payment.credits
        })

        return res.status(200).json({ message: "Payment varification successful" })

    } catch (error) {
        return res.status(500).json({ message: "Payment varification failed", error })
    }
}