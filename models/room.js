const mongoose=require('mongoose')


 const roomSchema= mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique: true
    },
    type:{
        type:String
    },

    price:{
        type:Number,
        required:true


    },
    maxPeople:{
        type:Number,
        required:true


    },
    desc:{
        type:String,
        required:true


    },
    city:{
        type:String,
        required:true


    },
    address:{
        type:String,
        required:true


    },
    imgs:{
        type:String
     
    },
    feedbacks:[{
        userId:mongoose.SchemaTypes.ObjectId,
        rating:{type:Number, min:0, max:5},
        review:String,
        date:Date
       
    }],
   
    destanceFromCityCenter:{
        type:Number
     
    },
    cheapestPrice:{
        type:Number,
        


    },
    averageRating:{
        type:Number,
        default:0
    },
    features:{
        type:[String],
        
    },
    featured:{
        type:Boolean,
        default:false


    },

    bookingNumber:{
        type:Number,
        default:0
    },
   
    roomNumbers:[{
        number:{type:Number},
        unavailableDates:{
            type:[Date],
            default:[]
        }
    }],
    //for houses not room in hotel
    unavailableDates:{
        type:[Date],
        default:[]

    },
    category:{
        type:[String],
        
    },
    

},{timestamps:true})

module.exports=mongoose.model('Room',roomSchema)