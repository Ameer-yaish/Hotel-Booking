const hotelModel = require('../models/hotel')
const { createError } = require('../utils/error')
const Room=require('../models/room')
const userModel = require('../models/user')
const hotelTypes = require('../models/hotelTypes')
const cityModel = require('../models/city')
const categoriesModel = require('../models/categories')
const featuresModel = require('../models/feature')
const feedbackModel = require('../models/feedbackNotification')
const reservationModel = require('../models/reservation')

module.exports.getAllCities= async(req,res,next)=>{
    try{

        const cities= await cityModel.find({},{name:1})

    
       
        res.status(200).json({message:cities})
        next()
    }
    catch(err){
        next(err)     }

}
module.exports.getSeriesNames= async(req,res,next)=>{
    try{
        const ownerId=req.params.id
     

        let ownerSeries= await hotelModel.find({userId:ownerId},{name:1,type:1})
             
        ownerSeries=  ownerSeries.map(series=>{
                if(series.type!="فندق"){
                    return series
                }
            })
            var filtered = ownerSeries.filter(function (el) {
                return el != null;
              });
         if(filtered.length){
            res.status(200).json({message:filtered})
            next()
         }
             
        
        else{
            res.status(200).json({error:"you dont have any series please add one"})

        }
        
    }
    catch(err){
        next(err)     }

}

module.exports.getAllFeatures= async(req,res,next)=>{
    try{

        const featured= await featuresModel.find({},{name:1})

    
       
        res.status(200).json({message:featured})
        next()
    }
    catch(err){
        next(err)     }

}
module.exports.getHotelsName= async(req,res,next)=>{
    try{
        const ownerId=req.params.id
     

        let ownerHotels= await hotelModel.find({userId:ownerId,type:"فندق"},{name:1,type:1})
        
        if(ownerHotels.length){

            ownerHotels= ownerHotels.map(hotel=>{
                if(hotel.type=="فندق"){
                    return hotel
                }
            })
         
    
        
           
            res.status(200).json({message:ownerHotels})
            next()
        }
        else{
            res.status(200).json({error:"you dont have any series please add one"})

        }
        
    }
    catch(err){
        next(err)     }

}
module.exports.getHotelsAndSeries= async(req,res,next)=>{
    try{
        const ownerId=req.params.id

        const ownerhotelsAndSeries= await hotelModel.find({userId:ownerId},{rating:1,imgs:1,city:1,type:1,name:1,})
        if(ownerhotelsAndSeries.length){
            res.status(200).json({message:ownerhotelsAndSeries})
            next()
        }
        else{
            res.status(200).json({message:"you dont have any"})
            next()
        }

       
       
    }
    catch(err){
        next(err)     }

}
module.exports.getHotelInformation= async(req,res,next)=>{
    try{
       
       const choosenHotel = await hotelModel.findById(req.params.id,{__v:0} )
      
    const list =await Promise.all(choosenHotel.rooms.map((room)=>{
        return Room.findById(room,{averageRating:1,price:1,imgs:1,title:1,bookingNumber:1})
    }))
    const theHotel = await hotelModel.findById(req.params.id,{imgs:1,desc:1,address:1,destanceFromCityCenter:1,city:1,name:1} )

        res.status(200).json({hotel:theHotel,HotelRooms:list})
        next()
    }
    catch(err){
        next(err)     }

}


module.exports.getRoom= async(req,res,next)=>{
    try{
        const id=req.params.id
        const wantedRoom = await Room.findById(id,{roomNumbers:1,feedbacks:1,imgs:1,features:1,disCount:1,averageRating:1,desc:1,maxPeople:1,price:1,title:1,discount:1})
      

        res.status(200).json({Room:wantedRoom})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.addNewRoomNumber= async(req,res,next)=>{
    try{
        const id=req.params.id
          await Room.findByIdAndUpdate(id,{$push:{roomNumbers:req.body.newNumber}})
      

        res.status(200).json({message:"successfully updated"})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.getSeriesInformation= async(req,res,next)=>{
    try{
       
       const choosenSeries = await hotelModel.findById(req.params.id,{__v:0} )
      
    const list =await Promise.all(choosenSeries.rooms.map((room)=>{
        return Room.findById(room,{averageRating:1,price:1,imgs:1,title:1,bookingNumber:1,city:1})
    }))
    const series = await hotelModel.findById(req.params.id,{imgs:1,desc:1,name:1} )

        res.status(200).json({series:series,places:list})
        next()
    }
    catch(err){
        next(err)     }

}
module.exports.getPlace= async(req,res,next)=>{
    try{
        const id=req.params.id
        const wantedRoom = await Room.findById(id,{feedbacks:1,imgs:1,features:1,disCount:1,averageRating:1,desc:1,maxPeople:1,price:1,title:1,city:1,type:1,destanceFromCityCenter:1,address:1,bookingNumber:1,unavailableDates:1})
      

        res.status(200).json({place:wantedRoom})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.getOwnerInformation= async(req,res,next)=>{
    try{
       
       const choosenUser = await userModel.findById(req.params.id ,{img:1,phone:1,city:1,country:1,email:1,username:1,})
      
        res.status(200).json({message:choosenUser})
        next()
       
    
       
    }
    catch(err){
        next(err)     }

}

module.exports.addfeedbackNotification= async(req,res,next)=>{
    try{
        const {userId,roomId}=req.body
          await feedbackModel.insertMany({userId,roomId,ratedOrNot:false})
      

        res.status(200).json({message:"successfully added"})
        next()
    }
    catch(err){
        next(err)    }

}

module.exports.getfeedbackNotification= async(req,res,next)=>{
    try{
        const {userId}=req.query
        const arrayOfNotRatedRoomsId=  await feedbackModel.find({userId:userId,ratedOrNot:false},{roomId:1})

        const arrayOfNotRatedRooms=await Promise.all(arrayOfNotRatedRoomsId.map(async (room)=>{
            
            return  Room.findOne({_id:room.roomId},{city:1,averageRating:1,maxPeople:1,price:1,type:1,title:1,imgs:1})

        })) 
        

     

        res.status(200).json({message:arrayOfNotRatedRooms})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.getOwnerReservations= async(req,res,next)=>{
    try{
        const {ownerId}=req.query
        const arrayOfOwnerReservation=  await reservationModel.find({ownerId: { $eq: ownerId }})
      
      const a=  await reservationModel.aggregate([
        {
          $project: {
              _id: 1,
              ownerId: 1,
              amount: 1,
              __v: 1,
              userId: 1,
              roomId: 1
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room"
          }
        },
        {
          $project: {
            _id: 1,
            ownerId: 1,
            amount: 1,
            __v: 1,
            user: {
              $arrayElemAt: ["$user", 0]
            },
            room: {
              $arrayElemAt: ["$room", 0]
            }
          }
        },
        {
          $project: {
            _id: 0,
            ownerId: 1,
            amount: 1,
            __v: 1,
            user: {
              phone: "$user.phone",
              city: "$user.city",
              country: "$user.country",
              email: "$user.email",
              username: "$user.username",
              _id: "$user._id"
            },
            room: {
              roomNumbers: "$room.roomNumbers",
              type: "$room.type",
              price: "$room.price",
              city: "$room.city",
              title: "$room.title",
              _id: "$room._id"
            }
          }
        }
      ])
      
      
          

          
        


     

        res.status(200).json({message:a})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.cheackIn= async(req,res,next)=>{
    try{
       
          

          
        


     

        res.status(200).json({message:"a"})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.cheackOut= async(req,res,next)=>{
    try{
       
          

          
        


     

        res.status(200).json({message:"a"})
        next()
    }
    catch(err){
        next(err)    }

}

module.exports.getOwnerMainPageInformation= async(req,res,next)=>{
    try{
        const currentDate = new Date();

        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
        let lastMonthProfit
        let lastTwoMonthProfit
        let lastThreeProfit
       await reservationModel.aggregate([
            {
                $match: { 
                    date: { 
                        $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
                        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) 
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalProfit: {
                        $sum: "$amount"
                    }
                }
            }
        ]).then((data) => {
            lastMonthProfit=data[0].totalProfit;
        });

        const lastTowMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate());
        
       await reservationModel.aggregate([
            {
                $match: { 
                    date: { 
                        $gte: new Date(lastTowMonth.getFullYear(), lastTowMonth.getMonth(), 1),
                        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) 
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalProfit: {
                        $sum: "$amount"
                    }
                }
            }
        ]).then((data) => {
            lastTwoMonthProfit=data[0].totalProfit;
        });
        
      
        
        const lastThreeMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
        
       await reservationModel.aggregate([
            {
                $match: { 
                    date: { 
                        $gte: new Date(lastThreeMonth.getFullYear(), lastThreeMonth.getMonth(), 1),
                        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) 
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalProfit: {
                        $sum: "$amount"
                    }
                }
            }
        ]).then((data) => {
            lastThreeProfit=data[0].totalProfit;
        });   

        



     

        res.status(200).json({lastMonthProfit:lastMonthProfit,lastTwoMonthProfit:lastTwoMonthProfit,lastThreeProfit:lastThreeProfit})
        next()
    }
    catch(err){
        next(err)    }

}



