const hotel = require('../models/hotel')
const userModel=require('../models/user')
const { createError } = require('../utils/error')
const Room=require('../models/room')
const user = require('../models/user')
const { model } = require('mongoose')
const hotelTypes = require('../models/hotelTypes')
const { count } = require('../models/user')
const cityModel = require('../models/city')
const categoriesModel = require('../models/categories')



module.exports.newHotel= async(req,res,next)=>{
    try{
     const {imgs,...otherDetails}=req.body
        const newHotel=new hotel({
            ...otherDetails
            
        })
        if(req.files){
            let path=''
            req.files.forEach(function(files,index,arr){
                path=path+files.path+','
            })
            path=path.substring(0,path.lastIndexOf(","))
            newHotel.imgs=path
        } 

        newHotel.save()
        res.status(200).json({message:"successfully added"})
    }
    catch(err){
        next(err)    }

}

module.exports.updateHotel= async(req,res,next)=>{
    try{
        //this {new} will make the find byId..method return the updated value
       const updatedHotel= await hotel.findByIdAndUpdate(req.params.id,{$set:req.body},{new :true} )
        res.status(200).json({message:'Hotel updated this is thr new hotel',updatedHotel})
        next(err) 
    }
    catch(err){
        res.status(500).json(err)
    }

}
module.exports.deleteHotel= async(req,res,next)=>{
    try{
        await hotel.findByIdAndDelete(req.params.id )
        res.status(200).json({message:'Hotel deleted'})
        next()
    }
    catch(err){
        next(err)     }

}

module.exports.getHotel= async(req,res,next)=>{
    try{
       
       const choosenHotel = await hotel.findById(req.params.id,{__v:0} )
      
       const userHotel=await userModel.findById(choosenHotel.userId,{phone:1,city:1,country:1,email:1,username:1})
    const list =await Promise.all(choosenHotel.rooms.map((room)=>{
        return Room.findById(room,{_id:1,title:1,price:1,desc:1,city:1,averageRating:1,featured:1,imgs:1})
    }))
    const theHotel = await hotel.findById(req.params.id,{__v:0,rooms:0} )

        res.status(200).json({message:theHotel,userContactInfo:userHotel,HotelRooms:list})
        next()
    }
    catch(err){
        next(err)     }

}
module.exports.getHotels= async(req,res,next)=>{
    try{
       const hotels = await hotel.find({})
        res.status(200).json({message:hotels})
        next()
    }
    catch(err){
        next(err)    }

}

module.exports.countByCity= async(req,res,next)=>{
    
    let cityCount={
        name:[String],
        count:[Number]
    }
    
    try{
        const rooms=await Room.find({})
      let cities= rooms.map(room=>{
            return room.city
        })
     
        cities = [ ...new Set(cities)]
    
        
       const list = await Promise.all(cities.map(city=>{
        return Room.countDocuments({city})
       }))
       

       for(let i=0;i<list.length;i++){
        cityCount.name[i]=cities[i]
        cityCount.count[i]=list[i]
       }
       let s
       for(let i=0;i<list.length;i++){
        for(let j=0;j<list.length;j++){
            if(cityCount.count[i]>cityCount.count[j])
            {
                s=cityCount.name[i]
                cityCount.name[i]=cityCount.name[j]
                cityCount.name[j]=s

                s=cityCount.count[i]
                cityCount.count[i]=cityCount.count[j]
                cityCount.count[j]=s


            }

        }
       }
       
let orderCities

    
        orderCities=await Promise.all(cityCount.name.map(city=>{
               return cityModel.findOne({name:city},{createdAt:0,updatedAt:0,__v:0})
           }))  
      
      
       res.status(200).json({cities:orderCities})
        next()
    }
    catch(err){
        next(err)    }

}

module.exports.countByType= async(req,res,next)=>{
    const types=req.query.types.split(",")
    try{
       const list = await Promise.all(types.map(type=>{
        return hotel.countDocuments({type:type})
       }))
       
      
        res.status(200).json({types:types,count:list})
        next()
    }
    catch(err){
        next(err)    }

}

module.exports.featuredHotels= async(req,res,next)=>{
    try{
        const featured=req.query.featured
       const hotels = await hotel.find({featured:featured}).limit(req.query.limit)
        res.status(200).json({message:hotels})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.searchHotels= async(req,res,next)=>{
    try{
        const {min,max,...otherDetails}=req.query
       const hotels = await hotel.find({
        ...otherDetails,
        cheapestPrice:{$gt:min | 1,$lt:max || 999}
       }).limit(req.query.limit)
        res.status(200).json({message:hotels})
        next()
    }
    catch(err){
        next(err)    }

}


module.exports.getHotelRooms= async(req,res,next)=>{
   try{
    
    const Hotel= await hotel.findById(req.params.id)
    
    const list =await Promise.all(Hotel.rooms.map((room)=>{
        return Room.findById(room,{featured:1,averageRating:1,city:1,desc:1,price:1,title:1,_id:1,imgs:1})
    }))
    res.status(200).json(list)
   }
   catch(err){
    next(err)
   }

}





module.exports.getHotelTypes= async(req,res,next)=>{
    try{
       
       const Types = await hotelTypes.find({},{type:1,_id:0,desc:1,title:1,imgs:1})
        res.status(200).json({message:Types})
        next()
    }
    catch(err){
        next(err)     }

}





module.exports.getCities= async(req,res,next)=>{
    try{
       let duplicatedCities=[]
       const rooms = await Room.find({},{})
      
       for(let i=0;i<rooms.length;i++){
        duplicatedCities[i]=rooms[i].city
    }
      let cities=[]
       let uniqueCites = [...new Set(duplicatedCities)];
       for(let i=0;i<uniqueCites.length;i++){
         cities.push(await cityModel.findOne({name:uniqueCites[i]},{categories:0,createdAt:0,__v:0,updatedAt:0}))
       }
       
        res.status(200).json({message:cities})
        next()
    }
    catch(err){
        next(err)     }

}

module.exports.getCategories= async(req,res,next)=>{
    try{
       const categories = await categoriesModel.find({})
        res.status(200).json({message:categories})
        next()
    }
    catch(err){
        next(err)    }

}





