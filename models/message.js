const mongoose=require('mongoose')


 const messageSchema= mongoose.Schema({
    conversationId:{
        type:String
    },
    sender:{
        type:String
    },
    imgs:{
        type:String
    },



},{timestamps:true})

module.exports=mongoose.model('message',messageSchema)