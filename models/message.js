const mongoose=require('mongoose')


 const messageSchema= mongoose.Schema({
    city:{
        type:String
    },
    name:{
        type:String
    },
    imgs:{
        type:String
    },



},{timestamps:true})

module.exports=mongoose.model('message',messageSchema)