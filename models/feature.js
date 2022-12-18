const mongoose=require('mongoose')


 const featuresSchema= mongoose.Schema({
    name:{
        type:String,       
        unique:true
    },

},{timestamps:true})

module.exports=mongoose.model('features',featuresSchema)