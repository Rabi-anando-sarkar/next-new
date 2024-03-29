import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide an username"],
        unique: [true, "This username is already taken"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: [true, "This email is already taken"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
})

// next runs on edge framework thats we write it like this so that if the model is already made it will send a refrence otherwise it will make one we do this because nextjs dosnet know if schema model is laready built or not
const User = mongoose.models.users || mongoose.model("users",userSchema)

export default User