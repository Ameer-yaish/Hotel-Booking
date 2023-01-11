
const{ sendNotificationRequest} =require("../services/push_notification")



module.exports.sendNotification=async(req,res,next)=>{
   var message={
       app_id:"f4cfcf38-67f3-42f4-8c56-a4514ee1a6b5",
       contents:{en:"Test Push Notification"},
       included_segments:["All"],
       content_available:true,
       small_icon:"ic_notification_icon",
       data:{
           PushTitle:"CUSTOM NOTIFICATION"
       }
   }
   sendNotificationRequest(message,(error,results)=>{
      if(error){
          return next(error)
      }
      return res.status(200).send({
          message:"success",
          data:results
      })
  })

}



module.exports.sendNotificationToDevice=async(req,res,next)=>{
    var message={
        app_id:"f4cfcf38-67f3-42f4-8c56-a4514ee1a6b5",
        contents:{en:"Test Push Notification"},
        included_segments:["included_player_ids"],
        included_player_ids:req.body.devices,
        content_available:true,
        small_icon:"ic_notification_icon",
        data:{
            PushTitle:"CUSTOM NOTIFICATION"
        }
    }
    sendNotificationRequest(message,(error,results)=>{
       if(error){
           return next(error)
       }
       return res.status(200).send({
           message:"success",
           data:results
       })
   })
 
 }