const mongoose=require('mongoose')


 const HotelSchema= mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true

    },
    name:{
        type:String,
        required:true
    },

    type:{
        type:String,
        required:true


    },
    city:{
        type:String
    },
   
    distance:{
        type:String,
        


    },
    destanceFromCityCenter:{
        type:String,
        


    },
    address:{
        type:String,
        


    },
   
   
   
    desc:{
        type:String,
        


    },
    rating:{
        type:Number,
         min:0,
         max:5,
         default:0
    },
    imgs:{
        type:String
    },
    
    rooms:{
        type:[mongoose.SchemaTypes.ObjectId]

    },
featured:{
    type:Number,
    default:0
}


})

module.exports=mongoose.model('hotels',HotelSchema)