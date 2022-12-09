const jwt=require('jsonwebtoken')
const { createError } = require('./error')
const userModel=require('../models/user')
const bcrypt=require('bcrypt')
const { UserOTPVerification } = require('../models/UserOTPVerification')
module.exports.verifyToken=(req,res,next)=>{
const token= req.cookies.access_token
if(!token){
    return next (createError(401,'You are not authenticated'))
}
jwt.verify(token,'ameer',(err,decoded)=>{
    if(err) return next(createError(403,'Token is not valid!'))
    req.user=decoded;
  
    next()

    
})

}

module.exports.verifyUser=(req,res,next)=>{
   
        if(req.user.id===req.params.id||req.user.isAdmin){
            next()
        }
        else {
            return next (createError(403,"you are not authorized!"))
        }
    











    // verifyToken(req,res,next,()=>{
    //     if(req.user.id===req.params.id||req.user.isAdmin){
    //         next()
    //     }
    //     else {
    //         return next (createError(403,"you are not authorized!"))
    //     }
    // })

}

module.exports.verifyAdmin=(req,res,next)=>{
    
        
            if(req.user.isAdmin){
                next()
            }
            else {
                return next (createError(403,"you are not authorized!"))
            }
        


    // verifyToken(req,res,next,()=>{
    // console.log(req.user.isAdmin)
    //     if(req.user.isAdmin){
    //         next()
    //     }
    //     else {
    //         return next (createError(403,"you are not authorized!"))
    //     }
    // })
}

module.exports.EmailIsVerified= async(req,res,next)=>{
try{
    const user=await userModel.findOne({email:req.body.email})
   if(user){
    if(user.isVerified){
        next()
    }
    else{
        res.json({message:'Please check your email to verify your account'})
    }
   }
   else{
    res.json({message:'email not found'})
   }
    
}
catch(err){
    res.json({message:err})
}


}
module.exports.verifyOTP=async(req,res,next)=>{
try{
let {userId,otp}=req.body
if(!userId || !otp){
    throw Error("Empty otp details are not allowed")

}
else{
    const UserOTPVerificationRecords=await UserOTPVerification.find({
        userId
    })
    if(UserOTPVerificationRecords.length <= 0){
        throw new Error("Account doesn't exist  please check the email you have Entered ")
    } else {
        const {expiresAt}=UserOTPVerificationRecords[0]
        const hashedOTP=UserOTPVerificationRecords[0].otp
        if(expiresAt <Date.now()){
            await UserOTPVerification.deleteMany({userId})
            throw new Error("code has expired, please request again")
        } else{

            const validOTP= await bcrypt.compare(otp,hashedOTP)
            if(!validOTP){
               
                throw new Error(" Invalid code passed Check your inbox")
                
            } else{
                await userModel.updateOne({_id:userId},{resetVerified:true})
                
                await UserOTPVerification.deleteMany({userId})
                next()
            }
        }
    }
}
}
catch(err){
res.json({error:err.message})
}



}