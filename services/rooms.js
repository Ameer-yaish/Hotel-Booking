const Room =require('../models/room')
const Hotel =require('../models/hotel')
const userModel =require('../models/user')
const cityModel=require('../models/city')
const topDestinationModel=require('../models/topDestination')
const { default: mongoose } = require('mongoose')
const { json } = require('express/lib/response')
const { object } = require('joi')
const room = require('../models/room')
const featuresModel = require('../models/feature')
const feedbackModel = require('../models/feedbackNotification')
const reservationModel=require('../models/reservation')
const { getUserId } = require('./users')
const math = require('mathjs');

const jwt=require('jsonwebtoken')

const rate = (rating) => {
    const count = {};

    rating.forEach(element => {
  count[element] = (count[element] || 0) + 1;
});
let sum=0
let noDupRating= removeDuplicates(rating)
noDupRating.forEach(element => {
    sum +=count[element]*parseFloat(element) ;
  });
  let total=0
  noDupRating.forEach(element => {
    total += count[element];
  });
  
  let rate=Math.round((sum/total) * 10) / 10
return rate
  }

 
module.exports.createRoom=async(req,res,next)=>{
    const hotelId=req.params.hotelid


    const foundRoom=await Room.findOne({name:req.body.name,type:req.body.type})
   
    if(foundRoom){
       res.status(200).json({message:" name found ,please choose another name"})


    }
    else{
        const h= await Hotel.findOne({_id:hotelId})
        
        req.body.type=h.type
       
        if(h.type=="فندق"){
           
       
          
            req.body.city=h.city
             req.body.destanceFromCityCenter=h.destanceFromCityCenter
             
                req.body.roomNumbers=req.body.roomNumbers
           
             req.body.category=h.category
        }
        
   
   

   
   
       
       
       
    
      
       
       try {
           const {features,...otherDetails}=req.body
           
           const newRoom=new Room(otherDetails)

         
           if(req.files){
               let path=''
               req.files.forEach(function(files,index,arr){
                   path=path+files.path+','
               })
               path=path.substring(0,path.lastIndexOf(","))
               newRoom.imgs=path
           } 
           if(h.type=="فندق"){
            
            newRoom.address=h.address

           }
           else{
            const address={
                placeId:newRoom._id,
                latitude:req.body.latitude,
                longitude:req.body.longitude
            }
            newRoom.address=address
           }
     
          
           
let savedRoom=await newRoom.save()


 
 let a=JSON.parse(req.body.features)  
 
  savedRoom= await Room.findByIdAndUpdate(
    {_id:newRoom._id}, // match all documents
    { $push: { features: { $each: a } } },{new:true} // update the arrayOfStrings field
   

  );

   
   
           
           try{
               if(savedRoom.type=="فندق"){
                   await Hotel.findByIdAndUpdate(hotelId,{
                       $push:{rooms:savedRoom._id},
                       $set:{city:savedRoom.city}
                   })
   
   
               }else{
                   await Hotel.findByIdAndUpdate(hotelId,{
                       $push:{rooms:savedRoom._id}
                   })
               }
               
           } catch(err){
               next(err)
           }
           res.status(200).json(savedRoom)
   
       } catch (err){
   next(err)
       }
    }

  

}


module.exports.updateRoom= async(req,res,next)=>{
    try{
        //this {new} will make the find byId..method return the updated value
       const updatedRoom= await Room.findByIdAndUpdate(req.params.id,{$set:req.body},{new :true} )
        res.status(200).json({message:'Room updated this is thr new Room',updatedRoom})
        next(err) 
    }
    catch(err){
        res.status(500).json(err)
    }

}
module.exports.deleteRoom= async(req,res,next)=>{
    const hotelId=req.params.hotelid
    try{
        await Room.findByIdAndDelete(req.params.id )
        try{
            await Hotel.findByIdAndUpdate(hotelId,{
                $pull:{rooms:req.params.id}
            })
        } catch(err){
            next(err)
        }
        
        
        res.status(200).json({message:'Room deleted'})
        next()
    }
    catch(err){
        next(err)     }

}

  
module.exports.getRoom= async(req,res,next)=>{
    try{
       
       
        const choosenRoom = await Room.findOne({_id:req.params.id},{__v:0,updatedAt:0,createdAt:0} )
    
      
      
      
      

       const hotels=await Hotel.find({type:choosenRoom.type})
       
       let allrelatedRoomsid=hotels.map(hotel=>{
           return hotel.rooms
       })
     

   
    let arr=[]
    for(let i=0;i<allrelatedRoomsid.length;i++){
        for(let j=0;j<allrelatedRoomsid[i].length;j++){
            
                arr.push(allrelatedRoomsid[i][j])
            
        } 
    }
   
    

      const relatedRooms=await Promise.all(arr.map(async room=>{

           return await Room.findById(room,{title:1,city:1,price:1,averageRating:1,imgs:1})
       }))
       
      let hotelId
      await Promise.all(hotels.map(hotel=>{
          hotel.rooms.map(room=>{
              if(room.equals(req.params.id)){
                
                hotelId= hotel._id
              }

          })

      }))
      let newArr=[]
      const userHotel=await Hotel.findById(hotelId)
      if(choosenRoom.type=="فندق")
      {
        newArr.length =0
        
        await Promise.all(userHotel.rooms.map(async room=>{
            newArr.push(await  Room.findById(room,{_id:1,title:1,city:1,price:1,averageRating:1,discount:1})) 
      }))

      }
      



       newArr = relatedRooms.filter(object => {
         
          
        if(object._id.equals(choosenRoom._id))
        return 
        else
         return object._id
      });
      
     

      const user =await userModel.findById(userHotel.userId,{phone:1,email:1,username:1,img:1})
     
        res.status(200).json({Room:choosenRoom,relatedRooms:newArr,UserContactInfo:user})
        next()
    }
    
    catch(err){
        next(err) 
        }

}

module.exports.getRoomsByType= async(req,res,next)=>{
    try{
        type=req.query.type.toLowerCase()
        
        if(type==="فندق"){
            const hotels = await Hotel.find({type},{name:1,type:1,desc:1,rating:1,imgs:1,featured:1,city:1})
            res.status(200).json({message:hotels})
        next()

        }
        
        else{
            const array=[]
            const hotels = await Hotel.find({type})
             const Rooms = await Promise.all(hotels.map(async hotel=>{ 
             return await Promise.all(hotel.rooms.map(roomId=>{
            return Room.findById(roomId,{featured:1,photos:1,desc:1,city:1,price:1,title:1,averageRating:1,featured:1,imgs:1})
       
        
        })) 
        
       }))

       for(let i=0;i<Rooms.length;i++){
            for(let j=0;j<Rooms[i].length;j++){
                array.push(Rooms[i][j])
            }
    }
       res.status(200).json({message:array})
        next()
}
       

        
    }
    catch(err){
        next(err)    }

}


module.exports.updateRoomAvailability= async(req,res,next)=>{
    try{
         const choosenRoom=await Room.findByIdAndUpdate(req.params.id,{$push:{unavailableDates:req.body.dates},$inc: {bookingNumber: 1}})
        const token= req.cookies.access_token
        
        if(!token){
            return next (createError(401,'You are not authenticated'))
        }
        jwt.verify(token,'ameer',(err,decoded)=>{
            if(err) return next(createError(403,'Token is not valid!'))
            req.user=decoded;
            
        
          
           
        
            
        })    
      
 const reservation=await reservationModel.findOneAndUpdate({roomId: req.params.id,userId: req.user.id},{$set:{reservationDates:req.body.dates}})



          if(choosenRoom){
           

            res.status(200).json({message:'Room status has been updated'})
          }
          else{
            await Room.updateOne(
                {"roomNumbers._id":req.params.id},
                {$push:{
                    "roomNumbers.$.unavailableDates":req.body.dates
                }},
            )
            res.status(200).json({message:'Room status has been updated'})

          }
        
        
        
        
    }
    catch(err){
        res.status(500).json(err)
    }

}


module.exports.getCity= async(req,res,next)=>{
    try{
        const id=req.params.id
        const city = await cityModel.findById(id,{__v:0,updatedAt:0,createdAt:0})
        const topDes=await topDestinationModel.find({city:city.name},{__v:0,updatedAt:0,createdAt:0})
        const rooms=await Room.find({city:city.name},{price:1,title:1,_id:1,averageRating:1,imgs:1,city:1,type:1})
        const hotels=await Hotel.find({city:city.name},{userId:0,rooms:0,__v:0})

        
        let homeArr=[]
       
        rooms.map(room=>{
           
            if(room.type==="فندق"){
                
            }
            else{
                
                homeArr.push(room)

            }
        })
        

        res.status(200).json({city:city,topDestination:topDes,places:homeArr,Hotels:hotels})
        next()
    }
    catch(err){
        next(err)    }

}


module.exports.topRating= async(req,res,next)=>{
    
    let topRating={
        id:[mongoose.SchemaTypes.ObjectId],
        rating:[Number]
    }
    
    try{
        const rooms=await Room.find({})
     
       for(let i=0;i<rooms.length;i++){
        topRating.id[i]=rooms[i]._id
        topRating.rating[i]=rooms[i].averageRating
       }
       let s
       for(let i=0;i<rooms.length;i++){
        for(let j=0;j<rooms.length;j++){
            if( topRating.rating[i]>topRating.rating[j])
            {
                s= topRating.id[i]
                topRating.id[i]=topRating.id[j]
                topRating.id[j]=s

                s=topRating.rating[i]
                topRating.rating[i]=topRating.rating[j]
                topRating.rating[j]=s


            }

        }
       }
       const topRatingRooms =await Promise.all(topRating.id.map((room)=>{
        return Room.findById(room,{title:1,city:1,price:1,averageRating:1,imgs:1})
    }))

      
       res.status(200).json({topRatingRooms:topRatingRooms})
        next()
    }
    catch(err){
        next(err)    }

}


module.exports.topBooking= async(req,res,next)=>{
    
    let topBooking={
        id:[mongoose.SchemaTypes.ObjectId],
        bookingnumber:[Number]
    }
    
    try{
        const rooms=await Room.find({})
     
       for(let i=0;i<rooms.length;i++){
        topBooking.id[i]=rooms[i]._id
        topBooking.bookingnumber[i]=rooms[i].bookingNumber
       }
       let s
       for(let i=0;i<rooms.length;i++){
        for(let j=0;j<rooms.length;j++){
            if( topBooking.bookingnumber[i]>topBooking.bookingnumber[j])
            {
                s= topBooking.id[i]
                topBooking.id[i]=topBooking.id[j]
                topBooking.id[j]=s

                s=topBooking.bookingnumber[i]
                topBooking.bookingnumber[i]=topBooking.bookingnumber[j]
                topBooking.bookingnumber[j]=s


            }

        }
       }
       const topBookingRooms =await Promise.all(topBooking.id.map((room)=>{
        return Room.findById(room,{title:1,city:1,price:1,bookingNumber:1,imgs:1})
    }))

      
       res.status(200).json({topBookingRooms:topBookingRooms})
        next()
    }
    catch(err){
        next(err)    }

}

function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}



module.exports.getDataForFilter= async(req,res,next)=>{
           
    try{
     rooms=await Room.find({})
     const fet =await featuresModel.find({},{name:1})
   

    prices= rooms.map(room=>{
         return room.price
     })
     prices.sort().reverse()
      
     features= rooms.map(room=>{
        return room.features
    })
  let  arrayOfFeatures=[]
  for(let i=0;i<features.length;i++){
    for(let j=0;j<features[i].length;j++){
        arrayOfFeatures.push(features[i][j])
    }
  }
  
  const arr=removeDuplicates(arrayOfFeatures)
   
  destanceFromCityCenter= rooms.map(room=>{
    return room.destanceFromCityCenter
})
destanceFromCityCenter.sort().reverse()

let typeOfAccommodation=rooms.map(room=>{
    return room.type
})

 typeOfAccommodation=removeDuplicates(typeOfAccommodation)
       res.status(200).json({prices:[prices[0],prices[prices.length-1]],
        features:arr,
        destanceFromCityCenter:[destanceFromCityCenter[0],destanceFromCityCenter[destanceFromCityCenter.length-1]],
        typeOfAccommodation:typeOfAccommodation
    })
        next()
    }
    catch(err){
        next(err)    }

}

module.exports.searchHotels= async(req,res,next)=>{
    try{
        const {minPrice,maxPrice,...otherDetails}=req.query
       const rooms = await Room.find({
        ...otherDetails,
        cheapestPrice:{$gt:minPrice | 1,$lt:maxPrice || 9999}
       }).limit(req.query.limit)
        res.status(200).json({message:rooms})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.addFeedback= async(req,res,next)=>{
    try{
        //this {new} will make the find byId..method return the updated value
        req.body.feedbacks.date=Date.now()

       let hotelID
      const userId= req.body.feedbacks.userId
     
      const user=await userModel.findById(userId)
      req.body.feedbacks.img=user.img
    
      
      let updatedRoom= await Room.findByIdAndUpdate(req.params.id,{$push:{feedbacks: req.body.feedbacks}},{new :true} )
       let hotels=await Hotel.find({})
        await Promise.all(hotels.map(async hotel=>{ 
        return await Promise.all(hotel.rooms.map(roomId=>{
           
            if(roomId==req.params.id){
                hotelID=hotel._id
            return hotel._id
        }
        else return 0
   })) 
   
  }))

        let Roomrating=[]
        let Hotelrating=[]
       let hotelRooms=[]


const theHotel=await Hotel.findOne({_id:hotelID})
    for(let i=0;i<theHotel.rooms.length;i++){
        hotelRooms.push(await Room.findById(theHotel.rooms[i])
        ) 
      }
      for(let i=0;i<hotelRooms.length;i++){
        Hotelrating.push(hotelRooms[i].averageRating)  
      }
      for(let i=0;i<updatedRoom.feedbacks.length;i++){
        Roomrating.push(updatedRoom.feedbacks[i].rating)  
      }
     
     const  upRoom=await Room.findByIdAndUpdate(updatedRoom._id,{averageRating:rate(Roomrating)},{new :true})
          Roomrating.length = 0
         

           const uphotel=await Hotel.findByIdAndUpdate(theHotel._id,{rating:rate(Hotelrating)},{new :true})
          Hotelrating.length = 0
           await feedbackModel.findOneAndUpdate({roomId:req.params.id},{ratedOrNot:true})

        res.status(200).json({message:'the feedback added successfully'})
        
    }
    catch(err){
        res.status(500).json(err)
    }


}
module.exports.roomsFilter= async(req,res,next)=>{
    try{
        const {minPrice,maxPrice,features,type,distance,title}=req.body
        city=req.body.city
        let typeArray=type.split(",")
        console.log(typeArray)
        
      
       const rooms = await Room.find({
       "$and":[
           {city:{$regex:city}}    , 
             {price:{$gte:minPrice || 1,$lte:maxPrice || 9999}},

             {features : {$in:features} },
             {type:{$in:typeArray} },
              {destanceFromCityCenter:{$lte:distance}},
              
              

                
       
       ]
        
       },{averageRating:1,desc:1,_id:1,title:1,type:1,imgs:1,price:1,city:1})
        res.status(200).json({message:rooms})
        next()
    }
    catch(err){
        next(err)    }

}


module.exports.roomSearch= async(req,res,next)=>{
    try{
 
      const  searchText=req.query.searchText
        

       const rooms = await Room.find({
       "$or":[
           {city:{$regex:searchText}} ,           
        {desc :{$regex:searchText}   },
          {type:{$regex:searchText}},
           {title:{$regex:searchText}},
       ]
        
       },{averageRating:1,desc:1,_id:1,title:1,type:1,imgs:1,price:1})
       
       const hotels = await Hotel.find({
        "$or":[
           
            {name:{$regex:searchText}},
        ]
         
        },{__v:0,rooms:0,featured:0})
        const newArr = rooms.filter(object => {
            
            if(object.type==="فندق"){
                return
            }
             
            else
             return object
          });
          const newArray = hotels.filter(object => {
            
            if(object.type==="فندق"){
                return object
            }
             
            else
             return 
          });

        res.status(200).json({Rooms:newArr,Hotels:newArray})
        next()
    }
    catch(err){
        next(err)    }

}



module.exports.roomInformationToBook= async(req,res,next)=>{
    try{
        
       
       let choosenRoom = await Room.findById(req.params.id,{maxPeople:1,price:1,_id:1,roomNumbers:1,type:1} )
       
       if(choosenRoom.type=="فندق"){
           

       }
       else {
        choosenRoom = await Room.findById(req.params.id,{maxPeople:1,price:1,_id:1,unavailableDates:1,type:1} )

       }
      

      
        res.status(200).json({Room:choosenRoom})
        next()
    }
    
    catch(err){
        next(err) 
        }

}


module.exports.getOffers= async(req,res,next)=>{
    try{
        const rooms=await Room.find({ discount: { $gt: 0 } },{title:1,city:1,price:1,averageRating:1,imgs:1,discount:1})

        if(rooms.length){
            res.status(200).json({RoomsWithOffers:rooms})
            next()
        }
        else{
            res.status(200).json({message:"no offers found"})


        }
        

        
    }
    catch(err){
        next(err)    }

}

module.exports.getRecommendRooms= async(req,res,next)=>{
    try{
    

    const user = await userModel.findById("63bc4b544adc57da5485eb3b");
    const ratings = user.ratings; 
    
  let movieIds=[]

     const userRatingsMatrix = {};
    ratings.forEach(rating => {
        userRatingsMatrix[rating.roomId] = rating.rating;
        movieIds.push(rating.roomId)
    });

  
    
const objectIds = movieIds.map(id => mongoose.Types.ObjectId(id));
const movies = await Room.find({ _id: { $in: objectIds } });
   
    // Create the movies matrix with all values set to 0
    const moviesMatrix = {};
    const genres = new Set();
    //iterating through all the movies
    movies.forEach(movie => {
        movie.category.forEach(genre => {
            genres.add(genre);
            if (!moviesMatrix[genre]) {
                moviesMatrix[genre] = {};
            }
            moviesMatrix[genre][movie._id] = 1;
        });
    });
    
    // iterating through all the genres
    Array.from(genres).forEach(genre => {
        // Find all the movies in the database
        movies.forEach(movie => {
            if (!moviesMatrix[genre].hasOwnProperty(movie._id)) {
                moviesMatrix[genre][movie._id] = 0;
            }
        });
    });

    const weightedGenreMatrix = {};

    Object.keys(moviesMatrix).forEach(genre => {
        weightedGenreMatrix[genre] = 0;
        Object.keys(userRatingsMatrix).forEach(movieId => {
            if (moviesMatrix[genre][movieId]) {
                weightedGenreMatrix[genre] += userRatingsMatrix[movieId] * moviesMatrix[genre][movieId];
            }
        });
    });
    const normalize = (matrix) => {
        const sum = Object.values(matrix).reduce((acc, val) => acc + val, 0);
        return Object.keys(matrix).map(genre => {
            return { genre: genre, value: matrix[genre] / sum };
        });
    }
    const normalizedWeightedGenreMatrix = normalize(weightedGenreMatrix);
    // console.log(normalizedWeightedGenreMatrix);
    

    const allMovies = await Room.find({ _id: { $nin: objectIds } });

    


    const allMoviesMatrix = {};
   
    //iterating through all the movies
    allMovies.forEach(movie => {
        movie.category.forEach(genre => {
           if(genres.has(genre))
           {
            if (!allMoviesMatrix[genre]) {
                allMoviesMatrix[genre] = {};
            }
            allMoviesMatrix[genre][movie._id] = 1;


           } 
            
        });
    });

// iterating through all the genres
Array.from(genres).forEach(genre => {
    // Find all the movies in the database
    allMovies.forEach(movie => {
        if (!allMoviesMatrix[genre].hasOwnProperty(movie._id)) {
            allMoviesMatrix[genre][movie._id] = 0;
        }
    });
});


const multipliedMatrix = {};
Object.keys(allMoviesMatrix).forEach(genre => {
    multipliedMatrix[genre] = {};
    Object.keys(allMoviesMatrix[genre]).forEach(movieId => {
        const normalizeValue = normalizedWeightedGenreMatrix.find(val => val.genre === genre);
        multipliedMatrix[genre][movieId] = allMoviesMatrix[genre][movieId] * normalizeValue.value;
    });
});



const movieScores = {};
Object.keys(multipliedMatrix).forEach(genre => {
    Object.keys(multipliedMatrix[genre]).forEach(movieId => {
        if (!movieScores[movieId]) {
            movieScores[movieId] = 0;
        }
        movieScores[movieId] += multipliedMatrix[genre][movieId];
    });
});



const sortedMovieScores = Object.entries(movieScores).sort((a, b) => b[1] - a[1]);
const topRecommendations = sortedMovieScores.slice(0, 10);

const topRecommendationsMovies = await Room.find({
    _id: { $in: topRecommendations.map(score => score[0]) }
},{averageRating:1,imgs:1,city:1,title:1,price:1,type:1,});
res.json({Rooms:topRecommendationsMovies})










    }
    catch(err){
        next(err)    }

}

