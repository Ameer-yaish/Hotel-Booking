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
        
        type:{
            placeId:mongoose.SchemaTypes.ObjectId,
            longitude:Number,
            latitude:Number
        }
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
},

category:{
    type:[String],
    
},

})

module.exports=mongoose.model('hotels',HotelSchema)