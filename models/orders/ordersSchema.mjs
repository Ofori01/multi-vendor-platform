import mongoose, { Schema } from "mongoose";

const OrdersSchema = new Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId, 
        auto: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "users"
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "products"
    },
    quantity: {
        type: mongoose.Schema.Types.Number, 
        required: true,
        min: 1
    },
    total_price: {
        type: mongoose.Schema.Types.Number, 
        required: true,
        min: 0
    },
    order_status: {
        type: mongoose.Schema.Types.String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
        default: "Pending"
    },
    payment_status: {
        type: mongoose.Schema.Types.String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending"
    },
    shipping_address: {
        type: mongoose.Schema.Types.String, 
        required: true
    },
    timestamp: {
        type: mongoose.Schema.Types.Date, 
        default: Date.now
    },
    updatedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
}, { timestamps: true }); 

const OrdersModel = mongoose.model("Orders", OrdersSchema);

export default OrdersModel;
