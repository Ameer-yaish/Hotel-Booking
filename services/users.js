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
const  roomModel  = require('../models/room');
const  hotelModel  = require('../models/hotel');
const  paymentModel  = require('../models/payment');
const { Console } = require('console');
const { array } = require('../middleware/upload');
const  paypal = require('paypal-rest-sdk');
const haversine = require('haversine');
const { findOne } = require('../models/hotel');
const reservationModel=require('../models/reservation')
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
 
 let user_id
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
module.exports.ownerRegister= async(req,res,next)=>{
    try{
        let{password,username,email}=req.body
        const foundEmail= await userModel.findOne({email})
        const foundName= await userModel.findOne({username})
       if(foundEmail){
         res.json({message:"email exists"})
           }

          
           else if(foundName){
            res.json({message:"user Name exists try another one"})
              }
              else{
                bcrypt.hash(password, 4,async function(err, hash) {
                    const user=new userModel({
                        ...req.body,
                        password:hash,
                        isVerified:false,
                        emailToken:crypto.randomBytes(64).toString('hex'),
                        wantToBeOwner:true
                    })
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
        user_id=User._id
        res.cookie("access_token",token).status(200).json({message:"success",userId:User._id,isAdmin:User.isAdmin,phone:User.phone,city:User.city,country:User.country,email:User.email,username:User.username,isOwner:User.isOwner,access_token:token})

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

module.exports.getUserId= async(req,res,next)=>{
    try{
        return user_id
     
    }
    catch(err){
        next(err)     }

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
       const Users = await userModel.find({isAdmin:{$eq:false},isOwner:{$eq:false}},{username:1,_id:1})
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
 
        searchText=req.query.searchText

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
module.exports.updateFavouritePlaces= async(req,res,next)=>{
    try{
        const{userId,placeId}=req.body
  
       const userWanted=await userModel.findOne({_id:userId})
   
     
       favouritePlaces=userWanted.favouritePlaces
       
       const id=favouritePlaces.some(id => id.equals(placeId));
     
       
       if(id){
       await userModel.findByIdAndUpdate(userId,{ $pull:{favouritePlaces:placeId}})

        res.status(200).json("sucssfully removed")


       }
       else{
           
       await userModel.findByIdAndUpdate(userId,{ $push:{favouritePlaces:placeId}})
        res.status(200).json("sucssfully added")
       }
       
        




      
    
    }
    
    catch(err){
        next(err)    }

}
module.exports.getFavouritePlaces= async(req,res,next)=>{
   
    try{
        let userfavouritePlaces=[]
     const User=await userModel.findOne({_id:req.params.id})
     favouritePlaces=User.favouritePlaces
           await Promise.all(favouritePlaces.map(async favouritePlace=>{
            userfavouritePlaces.push(await roomModel.findOne({_id:favouritePlace},{__v:0,updatedAt:0,createdAt:0,feedbacks:0,roomNumbers:0,bookingNumber:0,featured:0,features:0,category:0,unavailableDates:0}))   
        }))
        var filtered = userfavouritePlaces.filter(function (el) {
            return el != null;
          });
        
        res.status(200).json({favouritePlaces:filtered})
        
    }



    
    catch(err){
        next(err)    }

}



module.exports.sendEmail= async(req,res,next)=>{
   
    try{
        
        let mailOption={
            from:req.body.email,
            to:"ameeryaish47@gmail.com",
            subject:`Message from ${req.body.email}:${req.body.subject}`,
            text:req.body.message
        }

        //sending email
        transporter.sendMail(mailOption,function(err,info){
            if(err){
                res.json({message:err})
            }
            else{
                res.json({message:"email send successfully"})
            }
        })
        
       
        
    }



    
    catch(err){
        next(err)    }

}
let price;
module.exports.placePay= async(req,res,next)=>{
   
    try{
        
        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': 'AZrqqtSd2DsCY8bKwD9Y9pFPHv4lir8C8si6UgcMaiQ55DNVIm0DwI_rxcHrmAgWWj8otVudLRJiGYcM',
            'client_secret': 'EGXsOjWM2X2D9nHN06Qs4hTDeHw_b5IbICwQCI262IdFLwspzQT3cU-aYR2HRZ8dnvND0c4YThgBl2HB'
          });

          price=req.query.price
          price=((price*20)/100).toString()
          roomId=req.query.roomId
          userId=req.query.userId





          var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `https://hotel-booking-8qw1.onrender.com/api/users/success?userId=${userId}&roomId=${roomId}&price=${price}`,
                "cancel_url": "http://cancel.url"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": price,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": price
                },
                "description": "This is the payment description."
            }]
        };
        

        
        
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                for (var index = 0; index < payment.links.length; index++) {
                    //Redirect user to this endpoint for redirect url
                        if (payment.links[index].rel === 'approval_url') {
                            res.redirect(payment.links[index].href);
                        }
                    }
                    
            }
        });


       
        
    }



    
    catch(err){
        next(err)    }

}
module.exports.executePaymant= async(req,res,next)=>{
   
    try{
        
        
        var execute_payment_json = {
            "payer_id": req.query.PayerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": price
                }
            }]
        };
        
        var paymentId = req.query.paymentId;
        
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log("Get Payment Response");
                console.log(JSON.stringify(payment));
            }
        });
        
        const hotels=await hotelModel.find({})

        let hotelId
        await Promise.all(hotels.map(hotel=>{
            hotel.rooms.map(room=>{
                if(room.equals(roomId)){
                  
                  hotelId= hotel._id
                }
  
            })
  
        }))

                const hotel=await hotelModel.findById(hotelId)
     
                



        const reservation=await reservationModel.insertMany({userId:req.query.userId,roomId:req.query.roomId,amount:req.query.price,ownerId:hotel.userId})



        res.redirect("https://hotel-booking-8qw1.onrender.com/api/users/paymentSuccess")


       
        
    }



    
    catch(err){
        next(err)    }

}


module.exports.Roompay= async(req,res,next)=>{
   
    try{
        
        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': 'AZrqqtSd2DsCY8bKwD9Y9pFPHv4lir8C8si6UgcMaiQ55DNVIm0DwI_rxcHrmAgWWj8otVudLRJiGYcM',
            'client_secret': 'EGXsOjWM2X2D9nHN06Qs4hTDeHw_b5IbICwQCI262IdFLwspzQT3cU-aYR2HRZ8dnvND0c4YThgBl2HB'
          });

         let Roomprice=req.query.price
         Roomprice=((Roomprice*20)/100).toString()
          roomId=req.query.roomId
          userId=req.query.userId






          var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `https://hotel-booking-8qw1.onrender.com/api/users/savePayment?userId=${userId}&roomId=${roomId}&price=${Roomprice}`,
                "cancel_url": "http://cancel.url"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": Roomprice,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": Roomprice
                },
                "description": "This is the payment description."
            }]
        };
        

        
        
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                for (var index = 0; index < payment.links.length; index++) {
                    //Redirect user to this endpoint for redirect url
                        if (payment.links[index].rel === 'approval_url') {
                            res.redirect(payment.links[index].href);
                        }
                    }
                    
            }
        });



       
        
    }



    
    catch(err){
        next(err)    }

}

module.exports.savePayment= async(req,res,next)=>{
   
    try{
       const  {userId,roomId,paymentId,PayerID,price}=req.query
       console.log(price)
        await paymentModel.insertMany({userId,roomId,paymentId,PayerID,price})
        
        const hotels=await hotelModel.find({})

        let hotelId
        await Promise.all(hotels.map(hotel=>{
            hotel.rooms.map(room=>{
                if(room.equals(roomId)){
                  
                  hotelId= hotel._id
                }
  
            })
  
        }))

                const hotel=await hotelModel.findById(hotelId)
              



        const reservation=await reservationModel.insertMany({userId:req.query.userId,roomId:req.query.roomId,amount:req.query.price,ownerId:hotel.userId})

        res.json("if you dont attend we will deducted 20% of Room price")

       
        
    }



    
    catch(err){
        next(err)    }

}
module.exports.RoomexecutePaymant= async(req,res,next)=>{
   
    try{

        
        const {userId,roomId}=req.query
        const payment=await paymentModel.findOne({userId:userId,roomId:roomId})
       
        
        var execute_payment_json = {
            "payer_id": payment.PayerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": payment.price.toString()
                }
            }]
        };
    

        

        var paymentId = payment.paymentId;
        
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log("Get Payment Response");
                console.log(JSON.stringify(payment));
            }
        });


       await paymentModel.findByIdAndDelete(payment._id)
       res.json("payment Success")
        
    }




    
    catch(err){
        next(err)    }

}

module.exports.addAutoSearchCoordinates= async(req,res,next)=>{
    try{
        const{latitude,longitude,userId}=req.body
        const address={
            latitude:latitude,
            longitude:longitude
        }
        
      const user=await userModel.findByIdAndUpdate(userId,{address:address},{new: true})
      if(user.address){
          res.json({message:` added successfully and this the address you enter  ${user.address.latitude} and ${user.address.longitude}`})
      }
      else{
        res.json({message:`please cheak the user ID or the value of address you enter`})

      }

  
        





      
    
    }
    
    catch(err){
        next(err)    }

}

module.exports.getNearestPlaces= async(req,res,next)=>{
    try{
        const locations=[]
      const  user=await userModel.findOne({_id:req.query.userId})
       const places=await roomModel.find({'type': {$nin : "فندق"}})
       const hotels=await hotelModel.find({type:"فندق"})
       
       for(let i=0;i<places.length;i++){
        locations.push(places[i].address)
       }
       for(let i=0;i<hotels.length;i++){
           
        locations.push(hotels[i].address)
       
      }
      
    
      

        if(user.address)
        {
            const currentLocation = {
                latitude: user.address.latitude,
                longitude: user.address.longitude
              };
             
              
              
              
              // Find the nearest locations within a certain radius
              const nearestLocations = locations.filter(location => {
                
                const distance = haversine(currentLocation, location);
                return distance <= 2; // Only return locations within 1 km
              });
              const idPlaces=[]
              
              nearestLocations.forEach(location => {
                idPlaces.push(location.placeId)
              });
              
              const nearestHotels=await Promise.all(idPlaces.map(async place=>{
                  

                return await hotelModel.findOne({_id:place,category:req.query.category},{name:1,city:1,destanceFromCityCenter:1,rating:1,imgs:1,category:1})
            }))
            const nearestPlaces=await Promise.all(idPlaces.map(async place=>{
               

              return await roomModel.findOne({_id:place,category:req.query.category},{title:1,city:1,price:1,averageRating:1,imgs:1,category:1})
          }))
          var nearestHotelsFilterd = nearestHotels.filter(function (el) {
            return el != null;
          });
          var nearestPlacesFiltered = nearestPlaces.filter(function (el) {
            return el != null;
          });
           
            res.json({NearestPlaces:nearestPlacesFiltered,NearestHotels:nearestHotelsFilterd})
            



        } else{
            res.json({message:"there is no currentLocation for this user please enter one "})


        }
        
     

      
        





      
    
    }
    
    catch(err){
        next(err)    }

}


module.exports.addUserLocation= async(req,res,next)=>{
    try{
        const{latitude,longitude,userId}=req.body
        const userLocation={
            latitude:latitude,
            longitude:longitude
        }
        
      const user=await userModel.findByIdAndUpdate(userId,{userLocation:userLocation},{new: true})
      if(user.userLocation){
          res.json({message:` added successfully and this the user Location you enter  ${user.userLocation.latitude} and ${user.userLocation.longitude}`})
      }
      else{
        res.json({message:`please cheak the user ID or the value of address you enter`})

      }

  
        





      
    
    }
    
    catch(err){
        next(err)    }

}

module.exports.getUserLocation= async(req,res,next)=>{
   
    try{
       const userId=req.params.id
       const user= await userModel.findById(userId)
       if(user){
        res.status(200).json({latitude:user.userLocation.latitude,longitude:user.userLocation.longitude})

       }
       else{
        res.status(200).json({message:"user not found "})

       }
        
        
        
    }



    
    catch(err){
        next(err)    }

}




