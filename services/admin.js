const multer  = require('multer')
const categoriesModel = require('../models/categories')
const cityModel = require('../models/city')
const hotelTypes = require('../models/hotelTypes')
const path=require('path')
const topDestinationModel=require('../models/topDestination')
const helpTopicModel = require('../models/helpTopic')
const featuresModel = require('../models/feature')
const userModel = require('../models/user')
const hotelModel = require('../models/hotel')


module.exports.addCategories=async(req,res,next)=>{
   
    try{
       
            const cat=new categoriesModel({
                ...req.body
                
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
            ...req.body
          
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
       const {categories,name,desc,imgs}=req.body
       const cat=categories.split(',')
       

       
               const city=new cityModel({
                   name:name,
                   categories:cat,
                   desc:desc,
                   imgs
                   
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
          res.json({message:"Topic name is exist try another one"})


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
        res.json({message:"Topic name dosent  exist try another one"})
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
          
          res.json({message:"feature name is exist try another one"})


      }
      else{
        await featuresModel.insertMany({name:featureName})
        res.status(200).json({message:"feature  add successfully"})
      }
      
           
           
       }
       catch(err){
           next(err)    }

}


module.exports.getUsersCount= async(req,res,next)=>{
    try{
       
      
        const owners = await userModel.countDocuments({ isOwner: true });
        const users = await userModel.countDocuments({ isOwner: false });
     

        res.status(200).json({Users:users,Owners:owners})
        next()
    }
    catch(err){
        next(err)    }

}



module.exports.getUsersAndOwners= async(req,res,next)=>{
    try{
       
      
        const owners = await userModel.find({ isOwner: true },{email:1,phone:1,country:1,img:1,username:1,city:1});
        const users = await userModel.find({ isOwner: false },{email:1,phone:1,country:1,img:1,username:1,city:1});
        const usersWantsToBeOwner = await userModel.find({ wantToBeOwner: true },{email:1,phone:1,country:1,img:1,username:1,city:1});
     

        res.status(200).json({Users:users,Owners:owners,UsersWantsToBeOwner:usersWantsToBeOwner})
        next()
    }
    catch(err){
        next(err)    }

}

module.exports.makeOwner= async(req,res,next)=>{
    try{
      const  userId=req.params.id
      
      
      const newUser=await userModel.findByIdAndUpdate(userId,{$set:{isOwner:true,wantToBeOwner:false}},{new:true})
      if(newUser){
        const {wantToBeOwner,_id,isOwner,username}=newUser
          
          res.json({message:{wantToBeOwner,_id,isOwner,username}})


      }
      else{
         
       
        res.status(200).json({message:"user dosent updated please check if the user exist"})
      }
      
           
           
       }
       catch(err){
           next(err)    }

}
module.exports.deleteCategory= async(req,res,next)=>{
    try{
       const catId=req.params.id
      
       const result = await categoriesModel.deleteOne({ _id: catId });
       if (result.deletedCount > 0) {
        res.json({message:'category deleted'});
    } else {
         res.json({message:'category not found'});
       }

        
    }
    catch(err){
        next(err)    }

}

module.exports.getHotelTypes= async(req,res,next)=>{
    try{
       
      
        const types = await hotelTypes.find({},{__v:0,updatedAt:0,createdAt:0})
              

        res.status(200).json({types:types})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.deleteHotelType= async(req,res,next)=>{
    try{
       const typeId=req.params.id
      
       const result = await hotelTypes.deleteOne({ _id: typeId });
       if (result.deletedCount > 0) {
        res.json({message:'type deleted'});
    } else {
         res.json({message:'type not found'});
       }

        
    }
    catch(err){
        next(err)    }

}

module.exports.getAllCities= async(req,res,next)=>{
    try{
       
      
        const cities = await cityModel.find({},{__v:0,updatedAt:0,createdAt:0})

              

        res.status(200).json({cities:cities})
        next()
    }
    catch(err){
        next(err)    }

}
module.exports.deleteCity= async(req,res,next)=>{
    try{
       const cityId=req.params.id
      
       const result = await cityModel.deleteOne({ _id: cityId });
       if (result.deletedCount > 0) {
        res.json({message:'city deleted'});
    } else {
         res.json({message:'city not found'});
       }

        
    }
    catch(err){
        next(err)    }

}


module.exports.deleteFeature= async(req,res,next)=>{
    try{
       const featureId=req.params.id
      
       const result = await featuresModel.deleteOne({ _id: featureId });
       if (result.deletedCount > 0) {
        res.json({message:'feature deleted'});
    } else {
         res.json({message:'feature not found'});
       }

        
    }
    catch(err){
        next(err)    }

}
module.exports.deletehelpTopic= async(req,res,next)=>{
    try{
       const helpTopiccId=req.params.id
      
       const result = await helpTopicModel.deleteOne({ _id: helpTopiccId });
       if (result.deletedCount > 0) {
        res.json({message:'helpTopic deleted'});
    } else {
         res.json({message:'helpTopic not found'});
       }

        
    }
    catch(err){
        next(err)    }

}

module.exports.getHelpTopicQuestions= async(req,res,next)=>{
    try{
       
      const helpTopicId=req.params.id
        const topics = await helpTopicModel.find({_id:helpTopicId},{__v:0,updatedAt:0,createdAt:0})
        if(topics){
            res.status(200).json({HelpTopicQuestions:topics})
        next()

        }
        else{
            res.status(200).json({message:"no qustions found please add one"})
        next()
        }
              

        
    }
    catch(err){
        next(err)    }

}


module.exports.deletehelpQuestion= async(req,res,next)=>{
    try{
       const {topicId,questionId}=req.query
     
       const newHelpTopic= await helpTopicModel.findOneAndUpdate(
        { _id: topicId },
        { $pull: { helpQuestions: { _id: questionId } } },
        { new: true }
        
      );
       if(newHelpTopic){
        res.json({message:"deleted successfuly"})

       }
       else{
        res.json({message:"plesec check the id you enter"})

       }
    }
    catch(err){
        next(err)    }

}

module.exports.getTopDestination= async(req,res,next)=>{
    try{
       
      
        const topDestination = await topDestinationModel.find({},{__v:0,updatedAt:0,createdAt:0})
        if(topDestination){
            res.status(200).json({topDestination:topDestination})
        next()

        }
        else{
            res.status(200).json({message:"no topDestination found please add one"})
        next()
        }
              

        
    }
    catch(err){
        next(err)    }

}
module.exports.deleteUser= async(req,res,next)=>{
    try{

        const {userId}=req.query
        await userModel.deleteOne({ _id: userId})
        .then(result => {
          if (result.deletedCount > 0) {
              res.json({message:"deleted successfully"})
          } else {
            res.json({message:"please check the id you enter"})
        }
        })
        .catch(error => console.log(error));
       
          

          
        


     

       
        
    }
    catch(err){
        next(err)    }

}

module.exports.deleteTopDestination= async(req,res,next)=>{
    try{

        const {id}=req.params
        await topDestinationModel.deleteOne({ _id: id})
        .then(result => {
          if (result.deletedCount > 0) {
              res.json({message:"deleted successfully"})
          } else {
            res.json({message:"please check the id you enter"})
        }
        })
        .catch(error => console.log(error));
       
          

          
        


     

       
        
    }
    catch(err){
        next(err)    }

}