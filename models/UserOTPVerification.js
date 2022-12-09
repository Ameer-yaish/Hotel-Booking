const mongoose=require("mongoose")


const UserOTPVerificationSchema=mongoose.Schema({
    userId:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date,
    
})

module.exports.UserOTPVerification=mongoose.model("UserOTPVerification",UserOTPVerificationSchema)