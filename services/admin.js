const multer  = require('multer')
const categoriesModel = require('../models/categories')
const cityModel = require('../models/city')
const hotelTypes = require('../models/hotelTypes')
const path=require('path')
const topDestinationModel=require('../models/topDestination')
const helpTopicModel = require('../models/helpTopic')
const featuresModel = require('../models/feature')


module.exports.addCategories=async(req,res,next)=>{
   
    try{
       
            const cat=new categoriesModel({
                name:req.body.name,
                
            })
            if(req.files){
                let path=''
                req.files.forEach(function(files,index,arr){
                    path=path+files.path+','
                })
                path=path.substring(0,path.lastIndexOf(","))
                cat.imgs=path
            } 

            cat.save()
            res.status(200).json({message:"successfully uploaded"})
        
        
        
        
    }
    catch(err){
        next(err)    }

}

module.exports.addHotelType= async(req,res,next)=>{
    try{
        const {type,title,desc}=req.body
        const hotelType=new hotelTypes({
            title:title,
            type:type,
            desc:desc
          
        })
       
        if(req.files){
            let path=''
            req.files.forEach(function(files,index,arr){
                path=path+files.path+','
            })
            path=path.substring(0,path.lastIndexOf(","))
            hotelType.imgs=path
        } 

        hotelType.save()
        res.status(200).json({message:"successfully uploaded"})


       }
       catch(err){
           next(err)    }

}

module.exports.addCity= async(req,res,next)=>{
    try{
       const {categories,name,desc}=req.body
       const cat=categories.split(',')
       

       
               const city=new cityModel({
                   name:name,
                   categories:cat,
                   desc:desc,
                   
                   
               })
           

               if(req.files){
                let path=''
                req.files.forEach(function(files,index,arr){
                    path=path+files.path+','
                })
                path=path.substring(0,path.lastIndexOf(","))
                city.imgs=path
            }  
               city.save()
               res.status(200).json({message:"successfully uploaded"})
           
        

           
           
           
       }
       catch(err){
           next(err)    }

}




module.exports.addHelpTopic= async(req,res,next)=>{
    try{
      const  {helpTopic }=req.body
      const topic=await helpTopicModel.findOne({topic:helpTopic})
      if(topic){
          res.json({error:"Topic name is exist try another one"})


      }
      else{
        await helpTopicModel.insertMany({topic:helpTopic})
        res.status(200).json({message:"help Topic add successfully"})
      }
      
           
           
       }
       catch(err){
           next(err)    }

}

module.exports.addHelpQuestion= async(req,res,next)=>{
    try{
      const  {helpTopicName,question,answer }=req.body
      const topic=await helpTopicModel.findOne({topic:helpTopicName})
      if(topic){
        await helpTopicModel.updateOne({topic:helpTopicName},{$push:{helpQuestions:{question:question,answer:answer}}})
        res.status(200).json({message:"help Question add successfully"})

      }
      else{
        res.json({error:"Topic name dosent  exist try another one"})
      }
      
           
           
       }
       catch(err){
           next(err)    }

}

module.exports.getHelpTopics= async(req,res,next)=>{
    try{
       
      
        const topics = await helpTopicModel.find({},{topic:1})
              

        res.status(200).json({Topics:topics})
        next()
    }
    catch(err){
        next(err)    }

}


module.exports.getHelpQuestions= async(req,res,next)=>{
    try{
       
      
        const topics = await helpTopicModel.find({},{__v:0,updatedAt:0,createdAt:0})
              

        res.status(200).json({Topics:topics})
        next()
    }
    catch(err){
        next(err)    }

}

module.exports.addFeature= async(req,res,next)=>{
    try{
      const  {featureName}=req.body
      
      const feature=await featuresModel.findOne({name:featureName})
      if(feature){
          
          res.json({error:"feature name is exist try another one"})


      }
      else{
        await featuresModel.insertMany({name:featureName})
        res.status(200).json({message:"feature  add successfully"})
      }
      
           
           
       }
       catch(err){
           next(err)    }

}

