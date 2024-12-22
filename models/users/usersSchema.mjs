import mongoose, { Schema } from "mongoose";


const UsersSchema = new Schema({
    user_id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
    email : {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    name: {
        type: mongoose.Schema.Types.String,
    required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    
    role: {
        type: mongoose.Schema.Types.String,
        required: true,
        enum: ["user", "seller", "admin"],
        default: "user"
    }
})

const usersModel = mongoose.model("Users", UsersSchema)

export default usersModel