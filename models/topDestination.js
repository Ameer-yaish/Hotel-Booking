const mongoose=require('mongoose')


 const topDestination= mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
   
    imgs:{
      type:String

    },
  city:{
      type:String
    }


  



},{timestamps:true})

module.exports=mongoose.model('topDestination',topDestination)