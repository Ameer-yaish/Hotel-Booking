const mongoose=require('mongoose')


 const paymentSchema= mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId
    },
    roomId:{
        type:mongoose.SchemaTypes.ObjectId
    },
    
    PayerID:{
        type:String
    },
    paymentId:{
        type:String
    },
    price:{
        type:Number
    },



},{timestamps:true})

module.exports=mongoose.model('payment',paymentSchema)