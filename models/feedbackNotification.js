const mongoose=require('mongoose')


 const feedbackNotificationSchema= mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
      
    },
   
    roomId:{
      type:mongoose.SchemaTypes.ObjectId

    },
    desc:{
        type:String
    },

    ratedOrNot:{type:Boolean}


  



},{timestamps:true})

module.exports=mongoose.model('feedbackNotification',feedbackNotificationSchema)