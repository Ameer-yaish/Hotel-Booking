const mongoose=require('mongoose')


 const reservationSchema= mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        
    },
   
    ownerId:{
        type:mongoose.SchemaTypes.ObjectId,

    },
    roomId:{
        type:mongoose.SchemaTypes.ObjectId,
    },
    ownerId:{
        type:mongoose.SchemaTypes.ObjectId,
    },

    date:{
        type:Date,
        default:Date.now()
    } ,
    reservationDates:{
        type:String,
        default:''

    },
    amount: Number



  



})

module.exports=mongoose.model('reservations',reservationSchema)