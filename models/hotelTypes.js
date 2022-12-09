const mongoose=require('mongoose')


 const hotelTypes= mongoose.Schema({
    type:{
        type:String,
       
        unique:true
    },
    title:{
        type:String,

    },
    imgs:{
       type:String

    },

    desc:{
        type:String,

    },



},{timestamps:true})

module.exports=mongoose.model('hotelTypes',hotelTypes)