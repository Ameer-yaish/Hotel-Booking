const { json } = require("express/lib/response")
const seen = [];
function replacer(key, value) {
 if (typeof value === 'object' && value !== null) {
   if (seen.indexOf(value) !== -1) {
     return;
   }
   seen.push(value);
 }
 return value;
}
module.exports.sendNotificationRequest= async(data,callback)=>{
   
var headers={
    "Content-Type":"application/json; charset=utf-8",
    Authorization:"Basic "+"MWJkOGZlNzEtZDcwMC00OTM2LTg0YzctMGU2NDQ1ZjkyNzFi",
}
var options={
    host:"onesignal.com",
    port:443,
    path:"/api/v1/notifications",
    method:"POST",
    headers:headers
}
var https=require("https")
var req= https.request(options,function(res){
    res.on("data",function(data){
        console.log(JSON.parse(data))

        return callback(null,JSON.parse(data))
    })
})
 req.on("error",function(e){
     return callback({
         message:e
     })
 })


 req.write(JSON.stringify(data,replacer))
 req.end()
}