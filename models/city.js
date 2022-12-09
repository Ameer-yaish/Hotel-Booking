const mongoose=require('mongoose')


 const citySchema= mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
   
    imgs:{
      type:String

    },
    desc:{
        type:String
    },
    categories:[String],
    topDestination:{
        type:{
            name:String,
            imgs:String,

        }

    }


  



},{timestamps:true})

module.exports=mongoose.model('cities',citySchema)