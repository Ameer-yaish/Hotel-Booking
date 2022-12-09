const userModel=require('../models/user')
const bcrypt = require('bcrypt');
const { createError } = require('../utils/error');
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const nodemailer=require('nodemailer');
const { model } = require('mongoose');
const { UserOTPVerification } = require('../models/UserOTPVerification');
const categoriesModel = require('../models/categories');
const topDestinationModel = require('../models/topDestination');
const  helpTopicModel  = require('../models/helpTopic');
const  conversationModel  = require('../models/conversation');
const  messageModel  = require('../models/message');

const transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'ameeryaish47@gmail.com',
        pass:"zaypeprjporibuxm"
    },
    tls:{
        rejectUnauthorized:false
    }
})

module.exports.register= async(req,res,next)=>{
    try{
        let{password,username,email}=req.body
        const foundEmail= await userModel.findOne({email})
        const foundName= await userModel.findOne({username})
       if(foundEmail){
         res.json({error:"email exists"})
           }

          
           else if(foundName){
            res.json({error:"user Name exists try another one"})
              }
              else{
                bcrypt.hash(password, 4,async function(err, hash) {
                    const user=new userModel({
                        ...req.body,
                        password:hash,
                        isVerified:false,
                        emailToken:crypto.randomBytes(64).toString('hex')})
                        const newUser=await user.save()

                        
                    let mailOption={
                        from:"ameeryaish47@gmail.com",
                        to:email,
                        subject:'ameer  -verify your email',
                        html:`<h2>${username} Thanks for registering on our site</h2>
                        <h4>Please verify your mail to continue...</h4>
                        <a href="http://${req.headers.host}/api/users/verify-email?token=${user.emailToken}">Verifiy your email</a>
                        ` 
                    }

                    //sending email
                    transporter.sendMail(mailOption,function(err,info){
                        if(err){
                            res.json({message:err})
                        }
                        else{
                            res.json({message:"Verification email is sent to your gmail account"})
                        }
                    })
                });
                

              }
     
       
    }
    catch(err){
        next(err)    }

}
module.exports.verifyEmail= async(req,res,next)=>{
    try{
        const token=req.query.token
        
        const user=await userModel.findOne({emailToken:token})
        
        if(user){
            user.emailToken=null
            user.isVerified=true
            await user.save()
         res.redirect('/api/users/emailVerifiedPage')   
        }
        
    }
    catch(err){
        res.json({message:err})
    }
}
module.exports.login= async(req,res,next)=>{
    try{
        let{password,email}=req.body
     
        const User=await userModel.findOne({email})
       
     if(User){
       if(email==User.email){
       const correctPassword=await bcrypt.compare(password, User.password);
       if(correctPassword){

        const token=jwt.sign({id:User._id,isAdmin:User.isAdmin},'ameer')
        const {password,isAdmin}=User._doc
        res.cookie("access_token",token).status(200).json({message:"success",userid:User._id})

       }
       else{
        next(createError(404,"password incorrect"))
       }


       }
    else if(email!=User.email){
        next(createError(404,"email not found"))
    }
    }
       
      
       
       
    }
    catch(err){
        next(createError(404,"email not found"))    }

}



module.exports.updateUser= async(req,res,next)=>{
    try{
        //this {new} will make the find byId..method return the updated value
        if(req.files){
            let path=''
            req.files.forEach(function(files,index,arr){
                path=path+files.path+','
            })
            path=path.substring(0,path.lastIndexOf(","))
            req.body.img=path
        } 
       const updatedUser= await userModel.findByIdAndUpdate(req.params.id,{$set:req.body},{new :true} )
    
       
     
        res.status(200).json({message:'user updated '})
        
    }
    catch(err){
        res.status(500).json(err)
    }

}
module.exports.deleteUser= async(req,res,next)=>{
    try{
        await userModel.findByIdAndDelete(req.params.id )
        res.status(200).json({message:'user deleted'})
        next()
    }
    catch(err){
        next(err)     }

}

module.exports.getUserInformation= async(req,res,next)=>{
    try{
       
       const choosenUser = await userModel.findById(req.params.id ,{img:1,categories:1,phone:1,city:1,country:1,email:1,username:1,})
      
        res.status(200).json({message:choosenUser})
        next()
       
    
       
    }
    catch(err){
        next(err)     }

}
module.exports.getUsers= async(req,res,next)=>{
    try{
       const Users = await userModel.find({})
        res.status(200).json({message:Users})
        next()
    }
    catch(err){
        next(err)    }

}


module.exports.resetPassword= async(req,res,next)=>{
    try{
        let{userId,newPassword}=req.body
         const User=await userModel.findById({_id:userId})
         if(User.resetVerified){
            bcrypt.hash(newPassword, 4,async function(err, hash) {
                await userModel.updateOne({_id:userId},{password:hash})
                res.status(200).json({message:"Reset Password successfully"})
            })
           
         }
         else{
            res.json({message:"please cheak your email and enter the correct 4 number"})
         }
       

    }
    catch(err){
        next(err)    }

}



module.exports.addUserCategories= async(req,res,next)=>{
    const categories=req.query.categories.split(",")
  
    try{
       
        const updatedUser= await userModel.findByIdAndUpdate(req.params.id,{$set:{categories:categories}},{new :true} )
     
        res.status(200).json({message:"add successfully"})
        next()
    }
    catch(err){

        next(err)    }

}


module.exports.getUserCategories= async(req,res,next)=>{
   
    try{
     const User=await userModel.findOne({_id:req.params.id})
        categories=User.categories
        const userCategories = await Promise.all(categories.map(category=>{
            return categoriesModel.findOne({name:category}) }))
        
        res.status(200).json({userCategories:userCategories})
        
    }
    catch(err){
        next(err)    }

}

module.exports.sendOTPVerificationEmail=async(req,res,next)=>{
        try{
            let{email}=req.body
           const user= await userModel.findOne({email})
           const _id=user._id
       const otp=`${Math.floor(1000+Math.random()*9000)}`
     const mailOption={
        from:'ameeryaish47@gmail.com',
        to:email,
        subject:"reset your password",
        html:`<p>Enter<b> ${otp} </b>in the app to reset your password <p>This code <b>expires in 1 hour</b></p></p>`
     }
     //hash the otp 
     const saltRounds=4
     const hashedOTP=await bcrypt.hash(otp,saltRounds)
     const newOTPVerification=await new UserOTPVerification({
        userId:_id,
        otp:hashedOTP,
        createdAt:Date.now(),
        expiresAt:Date.now()+3600000
     })
    await newOTPVerification.save()
    await transporter.sendMail(mailOption)
    res.json({
        status:"PENDING",
        message:"Verification otp email sent",
        data:{
            userId:_id,
            email:email
        }

    })

       
    }
    catch(err){
res.json({error:err.message})
          }

}

module.exports.addTopDestination= async(req,res,next)=>{
    try{        const topDestination=new topDestinationModel({
                  ...req.body
                   
                   
               })
           

            //    if(req.file){
            //     topDestination.imgs=req.file.path  
                if(req.files){
                    let path=''
                    req.files.forEach(function(files,index,arr){
                        path=path+files.path+','
                    })
                    path=path.substring(0,path.lastIndexOf(","))
                    topDestination.imgs=path
                }     
            
            topDestination.save()
               res.status(200).json({message:"successfully uploaded"})
           
        
           
           
           
       }
       catch(err){
           next(err)    }

}


module.exports.changePassword= async(req,res,next)=>{
    try{
        let{userId,oldPassword,newPassword,rePassword}=req.body
        if(newPassword===rePassword){
            const User=await userModel.findById({_id:userId})
            const correctPassword=await bcrypt.compare(oldPassword, User.password);
            if(correctPassword){
               bcrypt.hash(newPassword, 4,async function(err, hash) {
                   await userModel.updateOne({_id:userId},{password:hash})
                   res.status(200).json({message:"Reset Password successfully"})
               })
              
            }
            else{
               res.json({message:"the old password is not correct"})
            }

        }
        else{res.json({error:"the rePassword is not correct"})}
       
       

    }
    catch(err){
        next(err)    }

}

module.exports.helpQuestionSearch= async(req,res,next)=>{
    try{
 
        searchText=req.body.searchText

       const helpTopic = await helpTopicModel.find({
       "$or":[
           {topic:{$regex:searchText}} ,           
           {helpQuestions: {$elemMatch: {question:{$regex:searchText}}}}
        
       ]
        
       },{__v:0,updatedAt:0,createdAt:0})
       
        res.status(200).json({message:helpTopic})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.conversation= async(req,res,next)=>{
    try{
        const newConversation=new conversationModel({
            members:[req.body.senderId,req.body.receiverId],
        })
        const savedConversation =await newConversation.save()
        

 
        
        res.status(200).json(savedConversation)
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.getUserConversations= async(req,res,next)=>{
    try{
        const conversation=await conversationModel.find({
            members:{$in:[req.params.userId]}
        })

 
        
        res.status(200).json(conversation)
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.newMessage= async(req,res,next)=>{
    try{
        const newMessage=new messageModel(req.body)
        const savedMessage =await newMessage.save()
        

 
        
        res.status(200).json(savedMessage)
        next()
    }
    catch(err){
        next(err)    }

}

module.exports.getMessages= async(req,res,next)=>{
    try{
        const messages= await messageModel.find({
            conversationId:req.params.conversationId
        })
        res.status(200).json(messages)
        next()
    }
    
    catch(err){
        next(err)    }

}
