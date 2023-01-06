// const admin=require("firebase-admin")
// const fcm=require("fcm-notification")
// const serviceAccount =require("../config/push-notification-key.json")
// const certPath=admin.credential.cert(serviceAccount)
// const FCM=new fcm(certPath)

// exports.sendNotification=(req,res,next)=>{
//     try{
//         let message={
//             notification:{
//                 title:"Test Notification",
//                 body:"Notification message"
//             },
//             data:{
//                 orederId:123456,
//                 orederDate:"2022-10-28"

//             },
//             token:req.body.fcm_token
//         }
//         FCM.send(message,function(err,res){
//             if(err){
//                 return res.status(500).send({
//                     message: err
//                 })

//             }
//             else{
//                 return res.status(200).send({
//                     message: "Notification sent"
//                 })
//             }
//         })

//     }
//     catch(err){
// throw err
//     }
// }