import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types;

const transactionSchema = new mongoose.Schema({
    isPaid: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        required: true  // required: true means that this field is required
    },
    razorPay:{
        orderId: String,
        paymentId: String,
        razorPaySignature: String
    }
});


export default mongoose.model("Transaction", transactionSchema);
