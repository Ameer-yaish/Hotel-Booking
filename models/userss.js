const mongoose=require('mongoose')


 const userssSchema= mongoose.Schema({
    preferredGenres:{
        type:[String]
    },
    ratings:{
        type:{}
    },
    



},{timestamps:true})

module.exports=mongoose.model('userss',userssSchema)