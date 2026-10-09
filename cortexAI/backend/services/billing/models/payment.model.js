import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    orderId: {
        type: String,
        require: true
    },
    paymentId: String,
    amount: String,
    Currency: {
        type: String,
        default: 'INR'
    },
    credits: {
        type: Number,
        default: ''
    },
    plan: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    }

}, {
    timestamps: true
})

const Payment = mongoose.model("Payment", paymentSchema)
export default Payment