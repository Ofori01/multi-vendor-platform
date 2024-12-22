import mongoose, { Schema } from "mongoose";

const ProductsSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User or Seller collection
        required: true,
        ref: "users"
    },
    title: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: true,
        maxlength: 1000 // Limiting description length
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 0 // Price cannot be negative
    },
    image_url: {
        type: mongoose.Schema.Types.String,
    },
    stock_quantity: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 0, 
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        enum: ["Electronics", "Clothing", "Books", "Home & Kitchen", "Beauty & Health", "Sports & Outdoors", "Toys & Games", "Others"],
        default: "Others"
    },

    isAvailable: {
        type: mongoose.Schema.Types.Boolean,
        default: true
    },
    ratings: {
        type: mongoose.Schema.Types.Number, // Average rating
        min: 0,
        max: 5,
        default: 0
    },
    
    createdAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    updatedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
}, { timestamps: true });

const ProductModel = mongoose.model("Products", ProductsSchema);

export default ProductModel;
