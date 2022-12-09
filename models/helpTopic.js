const mongoose=require('mongoose')


 const helpTopic= mongoose.Schema({
   topic:{
       type:String,
       unique:true

   },
   helpQuestions:{
       type:[{question:String,answer:String}]
   }

},{timestamps:true})

module.exports=mongoose.model('helpTopic',helpTopic)