const mongoose=require('mongoose')


 const moviesSchema= mongoose.Schema({
    title:{
        type:String
    },
    genres:{
        type:[String]
    },
    



},{timestamps:true})

module.exports=mongoose.model('movies',moviesSchema)