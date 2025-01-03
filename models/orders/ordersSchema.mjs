import mongoose, { mongo } from 'mongoose';

const orderSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    items: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: mongoose.Schema.Types.Number,
            required: true,
            min: 1
        },
        price: {
            type: mongoose.Schema.Types.Number,
            required: true,
            min: 0
        }
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    payment_method: {
        type: mongoose.Schema.Types.String,
        // enum: ["Visa Card", "PayPal", "Cash"],
        required: true
    },
    shipping_price: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 0

    },
    items_price: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 0
    },
    shipping_address: {
        address: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        country: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        city: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        postal_code: {
            type: mongoose.Schema.Types.String,
            required: true
        }
    },
    timestamp: {
        type: mongoose.Schema.Types.Date, 
        default: Date.now
    },
    updatedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;