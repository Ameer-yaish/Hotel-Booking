const mongoose=require('mongoose')


 const categoriesSchema= mongoose.Schema({
    name:{
        type:String,
       
        unique:true
    },
   
    imgs:{
        type:String
     
    },

  



},{timestamps:true})

module.exports=mongoose.model('categories',categoriesSchema)