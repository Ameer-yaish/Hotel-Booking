const admin=require("firebase-admin")
var fcm = require('fcm-node');

const serviceAccount =require("../config/push-notification-key.json")
const certPath=admin.credential.cert(serviceAccount)
const server_key="AAAAlux7DBU:APA91bFw1jDN-7vEx_svFIx5PKVlQ1zt39YfhgvrBSL3775jL1Os96QMAmUYTebrd3q8zMtnznlHOGsn6WmHu7cwM0mtXVzKVPxgf6x8GYJSoM9zOzr28Z1jSIlOanSXUqQzSKGX8FNR"
const FCM=new fcm(server_key)

exports.sendNotification=(req,res,next)=>{
    try{


        const message = {
            to: req.body.token,
            notification: {
                title: 'Hello',
                body: 'This is a test notification'
            }
        };
        
        FCM.send(message, function(err, ressponce) {
            if (err) {
                res.json({message:err})

                
            } else {
                res.json({message:"Successfully sent notification"})
            }
        });

















        // let message={
        //     notification:{
        //         title:"Test Notification",
        //         body:"Notification message"
        //     },
        //     data:{
        //         orederId:123456,
        //         orederDate:"2022-10-28"

        //     },
        //     token:req.body.fcm_token
        // }
        // FCM.send(message,function(err,res){
        //     if(err){
        //         return res.status(500).send({
        //             message: err
        //         })

        //     }
        //     else{
        //         return res.status(200).send({
        //             message: "Notification sent"
        //         })
        //     }
        // })

    }
    catch(err){
throw err
    }
}
